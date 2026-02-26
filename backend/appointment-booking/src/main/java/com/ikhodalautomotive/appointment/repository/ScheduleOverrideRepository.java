package com.ikhodalautomotive.appointment.repository;

import com.ikhodalautomotive.appointment.model.ScheduleOverride;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface ScheduleOverrideRepository
        extends JpaRepository<ScheduleOverride, Long> {

    List<ScheduleOverride> findByDate(LocalDate date);

    List<ScheduleOverride> findByDateBetween(LocalDate startDate, LocalDate endDate);

    void deleteByDateAndOverrideType(LocalDate date, String overrideType);

    void deleteByDateAndOverrideTypeAndStartTimeAndEndTime(
            LocalDate date, String overrideType, LocalTime startTime, LocalTime endTime);

    Optional<ScheduleOverride> findByDateAndOverrideType(LocalDate date, String overrideType);

    Optional<ScheduleOverride> findByDateAndOverrideTypeAndStartTimeAndEndTime(
            LocalDate date, String overrideType, LocalTime startTime, LocalTime endTime);
}
