package com.ikhodalautomotive.appointment.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.*;
import java.util.List;

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
        private String start;
        private String end;
        private boolean available;
    }
}
