package com.ikhodalautomotive.appointment.service.impl;

import com.ikhodalautomotive.appointment.dto.request.AvailabilityRequestDTO;
import com.ikhodalautomotive.appointment.dto.response.AvailabilityResponseDTO;
import com.ikhodalautomotive.appointment.dto.response.TimeSlotResponseDTO;
import com.ikhodalautomotive.appointment.exception.ApiException;
import com.ikhodalautomotive.appointment.model.AvailabilityRule;
import com.ikhodalautomotive.appointment.model.Appointment;
import com.ikhodalautomotive.appointment.repository.AvailabilityRuleRepository;
import com.ikhodalautomotive.appointment.repository.AppointmentRepository;
import com.ikhodalautomotive.appointment.service.AvailabilityService;

import com.ikhodalautomotive.appointment.constants.AppointmentStatusConstants;
import java.util.Arrays;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AvailabilityServiceImpl implements AvailabilityService {

    private static final Logger log = LoggerFactory.getLogger(AvailabilityServiceImpl.class);

    private final AvailabilityRuleRepository repository;
    private final AppointmentRepository appointmentRepository;

    public AvailabilityServiceImpl(AvailabilityRuleRepository repository, AppointmentRepository appointmentRepository) {
        this.repository = repository;
        this.appointmentRepository = appointmentRepository;
    }

    @Override
    public void addAvailabilityRule(AvailabilityRequestDTO dto) {

        // 1️⃣ Basic validation
        if (dto.getStartTime().isAfter(dto.getEndTime())
                || dto.getStartTime().equals(dto.getEndTime())) {
            throw new ApiException("Start time must be before end time");
        }

        // 2️⃣ Check overlapping BLOCKED slots
        if (!dto.getIsAvailable()) {

            List<AvailabilityRule> overlaps = repository.findOverlappingBlockedRules(
                    dto.getDayOfWeek(),
                    dto.getStartTime(),
                    dto.getEndTime());

            if (!overlaps.isEmpty()) {
                throw new ApiException(
                        "Overlapping blocked slot already exists for "
                                + dto.getDayOfWeek());
            }
        }

        // 3️⃣ Save rule
        AvailabilityRule rule = new AvailabilityRule();
        rule.setDayOfWeek(dto.getDayOfWeek());
        rule.setStartTime(dto.getStartTime());
        rule.setEndTime(dto.getEndTime());
        rule.setIsAvailable(dto.getIsAvailable());

        repository.save(rule);
    }

    @Override
    public AvailabilityResponseDTO getAvailabilityForDate(LocalDate date) {
        DayOfWeek day = date.getDayOfWeek();
        List<AvailabilityRule> rules = repository.findByDayOfWeek(day);

        AvailabilityResponseDTO response = new AvailabilityResponseDTO();
        response.setDate(date.toString());
        response.setDayOfWeek(day.name());

        List<AvailabilityResponseDTO.BlockedSlotDTO> blocked = rules.stream()
                .filter(r -> !r.getIsAvailable())
                .map(r -> {
                    AvailabilityResponseDTO.BlockedSlotDTO b = new AvailabilityResponseDTO.BlockedSlotDTO();
                    b.setStartTime(r.getStartTime());
                    b.setEndTime(r.getEndTime());
                    return b;
                }).collect(Collectors.toList());

        response.setBlockedSlots(blocked);
        return response;
    }

    @Override
    public boolean isSlotAvailable(LocalDate date,
            java.time.LocalTime start,
            java.time.LocalTime end) {

        DayOfWeek day = date.getDayOfWeek();
        List<AvailabilityRule> rules = repository.findByDayOfWeek(day);

        return rules.stream()
                .filter(r -> !r.getIsAvailable())
                .noneMatch(r -> start.isBefore(r.getEndTime()) &&
                        end.isAfter(r.getStartTime()));
    }

    @Override
    public TimeSlotResponseDTO getTimeSlotsForDate(LocalDate date) {

        // 1️⃣ Configuration (can move to DB later)
        LocalTime workingStart = LocalTime.of(8, 0);
        LocalTime workingEnd = LocalTime.of(22, 0);
        int slotMinutes = 120; // Changed from 60 to 120 (2 hours)

        // 2️⃣ Get blocked slots for that day
        DayOfWeek day = date.getDayOfWeek();
        List<AvailabilityRule> blockedRules = repository.findByDayOfWeek(day)
                .stream()
                .filter(r -> !r.getIsAvailable())
                .toList();

        // 3️⃣ Get existing appointments (exclude CANCELLED if we had that status, for
        // now just PENDING/CONFIRMED/COMPLETED)
        List<Appointment> existingAppointments = appointmentRepository.findByAppointmentDateAndStatusIn(
                date,
                Arrays.asList(
                        AppointmentStatusConstants.PENDING,
                        AppointmentStatusConstants.CONFIRMED,
                        AppointmentStatusConstants.COMPLETED));

        List<TimeSlotResponseDTO.SlotDTO> slots = new ArrayList<>();

        // 4️⃣ Generate slots
        LocalTime current = workingStart;

        while (current.isBefore(workingEnd)) {
            LocalTime slotEnd = current.plusMinutes(slotMinutes);

            // If it wraps around or goes past workingEnd, stop
            if (slotEnd.isBefore(current) || slotEnd.isAfter(workingEnd)) {
                break;
            }

            LocalTime slotStart = current;

            // Check against blocked rules
            boolean isBlockedByRule = blockedRules.stream()
                    .anyMatch(rule -> slotStart.isBefore(rule.getEndTime()) && slotEnd.isAfter(rule.getStartTime()));

            // Check against existing appointments
            boolean isBooked = existingAppointments.stream()
                    .anyMatch(app -> slotStart.isBefore(app.getEndTime()) && slotEnd.isAfter(app.getStartTime()));

            boolean available = !isBlockedByRule && !isBooked;

            TimeSlotResponseDTO.SlotDTO slot = new TimeSlotResponseDTO.SlotDTO();
            slot.setStart(current.toString());
            slot.setEnd(slotEnd.toString());
            slot.setAvailable(available);

            slots.add(slot);

            current = slotEnd;
        }

        // 5️⃣ Build response
        TimeSlotResponseDTO response = new TimeSlotResponseDTO();
        response.setDate(date.toString());
        response.setSlots(slots);

        log.info("Total slots generated: {}", slots.size());

        return response;
    }

}
