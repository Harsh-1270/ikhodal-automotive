package com.ikhodalautomotive.appointment.dto.response;


import java.time.LocalTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TimeSlotResponseDTO {

    private String date;
    private List<SlotDTO> slots;


    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SlotDTO {
        private LocalTime start;
        private LocalTime end;
        private boolean available;

    }
}
