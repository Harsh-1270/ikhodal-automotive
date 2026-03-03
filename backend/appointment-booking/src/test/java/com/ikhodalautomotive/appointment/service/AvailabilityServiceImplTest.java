package com.ikhodalautomotive.appointment.service;

import com.ikhodalautomotive.appointment.model.AvailabilityRule;
import com.ikhodalautomotive.appointment.repository.AvailabilityRuleRepository;
import com.ikhodalautomotive.appointment.service.impl.AvailabilityServiceImpl;
import com.ikhodalautomotive.appointment.dto.response.TimeSlotResponseDTO;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.ikhodalautomotive.appointment.dto.request.AvailabilityRequestDTO;
import com.ikhodalautomotive.appointment.exception.ApiException;

@ExtendWith(MockitoExtension.class)
class AvailabilityServiceImplTest {

        @Mock
        private AvailabilityRuleRepository repository;

        @Mock
        private com.ikhodalautomotive.appointment.repository.AppointmentRepository appointmentRepository;

        @Mock
        private com.ikhodalautomotive.appointment.repository.ScheduleOverrideRepository scheduleOverrideRepository;

        @InjectMocks
        private AvailabilityServiceImpl availabilityService;

        @Test
        void shouldGenerateSlotsAndMarkBlockedOnesUnavailable() {

                // 📅 Given
                LocalDate date = LocalDate.of(2026, 2, 2); // MONDAY

                AvailabilityRule blockedRule = new AvailabilityRule();
                blockedRule.setDayOfWeek(DayOfWeek.MONDAY);
                blockedRule.setStartTime(LocalTime.of(10, 0));
                blockedRule.setEndTime(LocalTime.of(12, 0));
                blockedRule.setIsAvailable(false);

                when(repository.findByDayOfWeek(DayOfWeek.MONDAY))
                                .thenReturn(List.of(blockedRule));

                when(appointmentRepository.findByAppointmentDateAndStatusIn(any(), any()))
                                .thenReturn(List.of());

                when(scheduleOverrideRepository.findByDate(any()))
                                .thenReturn(List.of());

                // ▶️ When
                TimeSlotResponseDTO response = availabilityService.getTimeSlotsForDate(date);

                // ✅ Then
                assertNotNull(response);
                assertEquals(date.toString(), response.getDate());
                assertFalse(response.getSlots().isEmpty());

                // Slot 10:00–12:00 should be unavailable
                TimeSlotResponseDTO.SlotDTO blockedSlot = response.getSlots().stream()
                                .filter(s -> s.getStart().equals("10:00"))
                                .findFirst()
                                .orElseThrow();

                assertFalse(blockedSlot.isAvailable());

                // Slot 12:00–14:00 should be available
                TimeSlotResponseDTO.SlotDTO freeSlot = response.getSlots().stream()
                                .filter(s -> s.getStart().equals("12:00"))
                                .findFirst()
                                .orElseThrow();

                assertTrue(freeSlot.isAvailable());
        }

        @Test
        void shouldThrowExceptionWhenStartTimeIsAfterEndTime() {

                AvailabilityRequestDTO dto = new AvailabilityRequestDTO();
                dto.setDayOfWeek(DayOfWeek.MONDAY);
                dto.setStartTime(LocalTime.of(12, 0));
                dto.setEndTime(LocalTime.of(10, 0));
                dto.setIsAvailable(false);

                ApiException ex = assertThrows(
                                ApiException.class,
                                () -> availabilityService.addAvailabilityRule(dto));

                assertEquals("Start time must be before end time", ex.getMessage());
        }

        @Test
        void shouldThrowExceptionWhenBlockedSlotOverlaps() {

                AvailabilityRequestDTO dto = new AvailabilityRequestDTO();
                dto.setDayOfWeek(DayOfWeek.MONDAY);
                dto.setStartTime(LocalTime.of(10, 0));
                dto.setEndTime(LocalTime.of(12, 0));
                dto.setIsAvailable(false);

                AvailabilityRule existing = new AvailabilityRule();
                existing.setDayOfWeek(DayOfWeek.MONDAY);
                existing.setStartTime(LocalTime.of(9, 0));
                existing.setEndTime(LocalTime.of(11, 0));
                existing.setIsAvailable(false);

                when(repository.findOverlappingBlockedRules(
                                DayOfWeek.MONDAY,
                                LocalTime.of(10, 0),
                                LocalTime.of(12, 0))).thenReturn(List.of(existing));

                ApiException ex = assertThrows(
                                ApiException.class,
                                () -> availabilityService.addAvailabilityRule(dto));

                assertTrue(ex.getMessage().contains("Overlapping blocked slot"));
        }

        @Test
        void shouldSaveAvailabilityRuleWhenValid() {

                AvailabilityRequestDTO dto = new AvailabilityRequestDTO();
                dto.setDayOfWeek(DayOfWeek.TUESDAY);
                dto.setStartTime(LocalTime.of(14, 0));
                dto.setEndTime(LocalTime.of(16, 0));
                dto.setIsAvailable(false);

                when(repository.findOverlappingBlockedRules(
                                DayOfWeek.TUESDAY,
                                LocalTime.of(14, 0),
                                LocalTime.of(16, 0))).thenReturn(List.of());

                availabilityService.addAvailabilityRule(dto);

                verify(repository, times(1)).save(any(AvailabilityRule.class));
        }

}
