package com.ikhodalautomotive.appointment.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceResponseDTO {

    private Long id;

    private String name;

    private String description;

    private BigDecimal price;

    private String icon;

    private String duration;

    private String category;

    private Boolean isPopular;

    private Double rating;

    private Boolean isActive;

    private LocalDateTime createdAt;
}
