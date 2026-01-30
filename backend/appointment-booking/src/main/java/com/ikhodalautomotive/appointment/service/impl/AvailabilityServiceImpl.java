package com.ikhodalautomotive.appointment.service.impl;

import com.ikhodalautomotive.appointment.dto.request.AvailabilityRequestDTO;
import com.ikhodalautomotive.appointment.dto.response.AvailabilityResponseDTO;
import com.ikhodalautomotive.appointment.exception.ApiException;
import com.ikhodalautomotive.appointment.model.AvailabilityRule;
import com.ikhodalautomotive.appointment.repository.AvailabilityRuleRepository;
import com.ikhodalautomotive.appointment.service.AvailabilityService;

import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AvailabilityServiceImpl implements AvailabilityService {

    private final AvailabilityRuleRepository repository;

    public AvailabilityServiceImpl(AvailabilityRuleRepository repository) {
        this.repository = repository;
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

        List<AvailabilityRule> overlaps =
                repository.findOverlappingBlockedRules(
                        dto.getDayOfWeek(),
                        dto.getStartTime(),
                        dto.getEndTime()
                );

        if (!overlaps.isEmpty()) {
            throw new ApiException(
                    "Overlapping blocked slot already exists for "
                    + dto.getDayOfWeek()
            );
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

        List<AvailabilityResponseDTO.BlockedSlotDTO> blocked =
                rules.stream()
                        .filter(r -> !r.getIsAvailable())
                        .map(r -> {
                            AvailabilityResponseDTO.BlockedSlotDTO b =
                                    new AvailabilityResponseDTO.BlockedSlotDTO();
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
                .noneMatch(r ->
                        start.isBefore(r.getEndTime()) &&
                        end.isAfter(r.getStartTime())
                );
    }
}
