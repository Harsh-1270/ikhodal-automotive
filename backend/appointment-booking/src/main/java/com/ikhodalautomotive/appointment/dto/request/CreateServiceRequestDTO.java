package com.ikhodalautomotive.appointment.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class CreateServiceRequestDTO {

    @NotBlank
    private String name;

    private String description;

    @NotNull
    private BigDecimal price;

    private String icon;

    private String duration;

    private String category;

    private Boolean isPopular;

    private Double rating;

    private Boolean isActive;
}
