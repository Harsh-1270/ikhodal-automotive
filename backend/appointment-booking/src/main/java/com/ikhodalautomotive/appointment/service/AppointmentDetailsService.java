package com.ikhodalautomotive.appointment.service;

import com.ikhodalautomotive.appointment.dto.request.AppointmentDetailsRequestDTO;

public interface AppointmentDetailsService {

    void saveAppointmentDetails(Long appointmentId,
                                AppointmentDetailsRequestDTO request,
                                String userEmail);
}
