package com.ikhodalautomotive.appointment.dto.response;

import java.time.LocalTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AvailabilityResponseDTO {

    private String date;
    private String dayOfWeek;
    private List<BlockedSlotDTO> blockedSlots;

    @Data
    public static class BlockedSlotDTO {
        private LocalTime startTime;
        private LocalTime endTime;

    }

}
