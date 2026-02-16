package com.ikhodalautomotive.appointment.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemResponseDTO {

    private Long id;
    private Long serviceId;
    private String serviceName;
    private String serviceDescription;
    private String serviceIcon;
    private BigDecimal price;
    private String duration;
    private Integer quantity;
}
