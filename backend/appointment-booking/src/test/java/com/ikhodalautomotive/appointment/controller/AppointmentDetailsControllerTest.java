package com.ikhodalautomotive.appointment.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ikhodalautomotive.appointment.dto.request.AppointmentDetailsRequestDTO;
import com.ikhodalautomotive.appointment.service.AppointmentDetailsService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.doNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AppointmentDetailsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AppointmentDetailsService appointmentDetailsService;

    @Test
    @WithMockUser(username = "user@test.com", roles = "USER")
    void shouldSaveAppointmentDetailsSuccessfully() throws Exception {

        AppointmentDetailsRequestDTO dto = new AppointmentDetailsRequestDTO();
        dto.setRegistrationNumber("GJ01AB1234");
        dto.setCarMakeModel("Honda City");
        dto.setCarYear(2022);
        dto.setFullName("Test User");
        dto.setAddress("Ahmedabad");
        dto.setPostCode("380001");
        dto.setAdditionalComments("Test comments");

        doNothing().when(appointmentDetailsService)
                .saveAppointmentDetails(10L, dto, "user@test.com");

        mockMvc.perform(
                post("/api/appointments/10/details")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto))
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.message")
                .value("Appointment details saved successfully"));
    }

    @Test
    void shouldRejectWhenUserIsNotAuthenticated() throws Exception {

        mockMvc.perform(
                post("/api/appointments/10/details")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}")
        )
        .andExpect(status().isForbidden());
    }
}
