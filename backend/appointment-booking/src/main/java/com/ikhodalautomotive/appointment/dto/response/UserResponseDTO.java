package com.ikhodalautomotive.appointment.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private boolean isActive;
    private LocalDateTime createdAt;
    private int totalBookings;
}
