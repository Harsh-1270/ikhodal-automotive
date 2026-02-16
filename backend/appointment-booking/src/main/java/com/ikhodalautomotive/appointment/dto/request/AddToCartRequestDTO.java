package com.ikhodalautomotive.appointment.dto.request;

import lombok.Data;

@Data
public class AddToCartRequestDTO {

    private Long serviceId;

    private Integer quantity = 1;
}
