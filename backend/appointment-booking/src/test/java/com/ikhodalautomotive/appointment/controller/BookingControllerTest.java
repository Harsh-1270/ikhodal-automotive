package com.ikhodalautomotive.appointment.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ikhodalautomotive.appointment.dto.request.CreateBookingRequestDTO;
import com.ikhodalautomotive.appointment.dto.response.BookingResponseDTO;
import com.ikhodalautomotive.appointment.service.BookingService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class BookingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BookingService bookingService;

    @Autowired
    private ObjectMapper objectMapper;

    private CreateBookingRequestDTO buildRequest() {
        CreateBookingRequestDTO dto = new CreateBookingRequestDTO();
        dto.setDate(LocalDate.of(2026, 2, 2));
        dto.setStartTime(LocalTime.of(10, 0));
        dto.setEndTime(LocalTime.of(11, 0));
        dto.setServiceIds(List.of(1L, 2L));
        return dto;
    }

    @Test
    void shouldReturn401WhenNotAuthenticated() throws Exception {

        mockMvc.perform(
                post("/api/createBooking")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "user@test.com", roles = "USER")
    void shouldCreateBookingSuccessfully() throws Exception {

        CreateBookingRequestDTO request = buildRequest();

        BookingResponseDTO response = new BookingResponseDTO(1L, "PENDING", "Booking created successfully");

        when(bookingService.createBooking(request, "user@test.com"))
                .thenReturn(response);

        mockMvc.perform(
                post("/api/createBooking")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andExpect(jsonPath("$.message").value("Booking created successfully"));
    }

}
