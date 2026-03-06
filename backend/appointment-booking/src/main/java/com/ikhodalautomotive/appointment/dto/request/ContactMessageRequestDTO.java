package com.ikhodalautomotive.appointment.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactMessageRequestDTO {
    private String name;
    private String email;
    private String subject;
    private String message;
}
