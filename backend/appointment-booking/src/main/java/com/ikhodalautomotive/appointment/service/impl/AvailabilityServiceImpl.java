package com.ikhodalautomotive.appointment.service.impl;

import com.ikhodalautomotive.appointment.dto.request.AvailabilityRequestDTO;
import com.ikhodalautomotive.appointment.dto.response.AvailabilityResponseDTO;
import com.ikhodalautomotive.appointment.dto.response.TimeSlotResponseDTO;
import com.ikhodalautomotive.appointment.exception.ApiException;
import com.ikhodalautomotive.appointment.model.AvailabilityRule;
import com.ikhodalautomotive.appointment.model.Appointment;
import com.ikhodalautomotive.appointment.model.ScheduleOverride;
import com.ikhodalautomotive.appointment.repository.AvailabilityRuleRepository;
import com.ikhodalautomotive.appointment.repository.AppointmentRepository;
import com.ikhodalautomotive.appointment.repository.ScheduleOverrideRepository;
import com.ikhodalautomotive.appointment.service.AvailabilityService;

import com.ikhodalautomotive.appointment.constants.AppointmentStatusConstants;
import java.util.Arrays;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    private final ScheduleOverrideRepository scheduleOverrideRepository;

    public AvailabilityServiceImpl(AvailabilityRuleRepository repository,
            AppointmentRepository appointmentRepository,
            ScheduleOverrideRepository scheduleOverrideRepository) {
        this.repository = repository;
        this.appointmentRepository = appointmentRepository;
        this.scheduleOverrideRepository = scheduleOverrideRepository;
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

        // 1️⃣ Configuration
        LocalTime workingStart = LocalTime.of(8, 0);
        LocalTime workingEnd = LocalTime.of(22, 0);
        int slotMinutes = 120;

        // 2️⃣ Check date-specific overrides
        List<ScheduleOverride> dateOverrides = scheduleOverrideRepository.findByDate(date);

        boolean dateIsHoliday = dateOverrides.stream()
                .anyMatch(o -> "HOLIDAY".equals(o.getOverrideType()));
        boolean dateIsUnavailable = dateOverrides.stream()
                .anyMatch(o -> "UNAVAILABLE".equals(o.getOverrideType()));

        // Slot-level overrides
        List<ScheduleOverride> slotOverrides = dateOverrides.stream()
                .filter(o -> "SLOT_BLOCKED".equals(o.getOverrideType()))
                .toList();

        // 3️⃣ Get blocked rules for that day-of-week
        DayOfWeek day = date.getDayOfWeek();
        List<AvailabilityRule> blockedRules = repository.findByDayOfWeek(day)
                .stream()
                .filter(r -> !r.getIsAvailable())
                .toList();

        // 4️⃣ Get existing appointments
        List<Appointment> existingAppointments = appointmentRepository.findByAppointmentDateAndStatusIn(
                date,
                Arrays.asList(
                        AppointmentStatusConstants.PENDING,
                        AppointmentStatusConstants.CONFIRMED,
                        AppointmentStatusConstants.COMPLETED));

        List<TimeSlotResponseDTO.SlotDTO> slots = new ArrayList<>();

        // 5️⃣ Generate slots
        LocalTime current = workingStart;

        while (current.isBefore(workingEnd)) {
            LocalTime slotEnd = current.plusMinutes(slotMinutes);

            if (slotEnd.isBefore(current) || slotEnd.isAfter(workingEnd)) {
                break;
            }

            LocalTime slotStart = current;

            TimeSlotResponseDTO.SlotDTO slot = new TimeSlotResponseDTO.SlotDTO();
            slot.setStart(current.toString());
            slot.setEnd(slotEnd.toString());

            // Determine slot status
            if (dateIsHoliday || dateIsUnavailable) {
                // Full-day override — all slots blocked
                slot.setAvailable(false);
                slot.setStatus("BLOCKED");
            } else {
                // Check slot-level overrides
                boolean isSlotOverridden = slotOverrides.stream()
                        .anyMatch(o -> slotStart.isBefore(o.getEndTime()) && slotEnd.isAfter(o.getStartTime()));

                // Check day-of-week rules
                boolean isBlockedByRule = blockedRules.stream()
                        .anyMatch(
                                rule -> slotStart.isBefore(rule.getEndTime()) && slotEnd.isAfter(rule.getStartTime()));

                // Check booked appointments
                boolean isBooked = existingAppointments.stream()
                        .anyMatch(app -> slotStart.isBefore(app.getEndTime()) && slotEnd.isAfter(app.getStartTime()));

                if (isBooked) {
                    slot.setAvailable(false);
                    slot.setStatus("BOOKED");
                } else if (isBlockedByRule || isSlotOverridden) {
                    slot.setAvailable(false);
                    slot.setStatus("BLOCKED");
                } else {
                    slot.setAvailable(true);
                    slot.setStatus("AVAILABLE");
                }
            }

            slots.add(slot);
            current = slotEnd;
        }

        // 6️⃣ Build response
        TimeSlotResponseDTO response = new TimeSlotResponseDTO();
        response.setDate(date.toString());
        response.setHoliday(dateIsHoliday);
        response.setUnavailable(dateIsUnavailable);
        response.setSlots(slots);

        log.info("Total slots generated for {}: {}", date, slots.size());

        return response;
    }

    // ================= SCHEDULE OVERRIDE METHODS =================

    @Override
    public List<ScheduleOverride> getScheduleOverrides(int year, int month) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());
        return scheduleOverrideRepository.findByDateBetween(startDate, endDate);
    }

    @Override
    @Transactional
    public ScheduleOverride addScheduleOverride(LocalDate date, String overrideType,
            LocalTime startTime, LocalTime endTime) {

        // For full-day overrides, remove any conflicting override first
        if ("HOLIDAY".equals(overrideType) || "UNAVAILABLE".equals(overrideType)) {
            // Remove opposite full-day override if exists
            scheduleOverrideRepository.findByDateAndOverrideType(date, "HOLIDAY")
                    .ifPresent(scheduleOverrideRepository::delete);
            scheduleOverrideRepository.findByDateAndOverrideType(date, "UNAVAILABLE")
                    .ifPresent(scheduleOverrideRepository::delete);
        }

        // Check if exact override already exists
        if ("SLOT_BLOCKED".equals(overrideType) && startTime != null && endTime != null) {
            var existing = scheduleOverrideRepository
                    .findByDateAndOverrideTypeAndStartTimeAndEndTime(date, overrideType, startTime, endTime);
            if (existing.isPresent()) {
                throw new ApiException("This slot is already blocked");
            }
        }

        ScheduleOverride override = ScheduleOverride.builder()
                .date(date)
                .overrideType(overrideType)
                .startTime(startTime)
                .endTime(endTime)
                .build();

        return scheduleOverrideRepository.save(override);
    }

    @Override
    @Transactional
    public void removeScheduleOverride(LocalDate date, String overrideType,
            LocalTime startTime, LocalTime endTime) {

        if ("SLOT_BLOCKED".equals(overrideType) && startTime != null && endTime != null) {
            scheduleOverrideRepository
                    .findByDateAndOverrideTypeAndStartTimeAndEndTime(date, overrideType, startTime, endTime)
                    .ifPresent(scheduleOverrideRepository::delete);
        } else {
            scheduleOverrideRepository.findByDateAndOverrideType(date, overrideType)
                    .ifPresent(scheduleOverrideRepository::delete);
        }
    }

}
