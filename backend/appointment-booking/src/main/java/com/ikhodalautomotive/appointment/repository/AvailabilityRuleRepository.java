package com.ikhodalautomotive.appointment.repository;

import com.ikhodalautomotive.appointment.model.AvailabilityRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

public interface AvailabilityRuleRepository
        extends JpaRepository<AvailabilityRule, Long> {

    List<AvailabilityRule> findByDayOfWeek(DayOfWeek dayOfWeek);

     @Query("""
        SELECT r FROM AvailabilityRule r
        WHERE r.dayOfWeek = :dayOfWeek
          AND r.isAvailable = false
          AND (:start < r.endTime AND :end > r.startTime)
    """)
    List<AvailabilityRule> findOverlappingBlockedRules(
            DayOfWeek dayOfWeek,
            LocalTime start,
            LocalTime end
    );
}
