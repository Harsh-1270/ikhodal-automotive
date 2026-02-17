package com.ikhodalautomotive.appointment.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ikhodalautomotive.appointment.dto.response.AvailabilityResponseDTO;
import com.ikhodalautomotive.appointment.dto.response.ServiceResponseDTO;
import com.ikhodalautomotive.appointment.dto.response.TimeSlotResponseDTO;
import com.ikhodalautomotive.appointment.dto.response.TimeSlotResponseDTO.SlotDTO;
import com.ikhodalautomotive.appointment.service.AvailabilityService;
import com.ikhodalautomotive.appointment.service.ServiceService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ServiceService serviceService;

    @MockBean
    private AvailabilityService availabilityService;

    // ================= GET ALL SERVICES =================

    @Test
    @WithMockUser(username = "user@test.com", roles = "USER")
    void shouldReturnAllActiveServices() throws Exception {

        ServiceResponseDTO s1 = new ServiceResponseDTO();
        s1.setId(1L);
        s1.setName("Oil Change");
        s1.setDescription("Basic service");
        s1.setPrice(BigDecimal.valueOf(100));

        ServiceResponseDTO s2 = new ServiceResponseDTO();
        s2.setId(2L);
        s2.setName("Full Service");
        s2.setDescription("Complete service");
        s2.setPrice(BigDecimal.valueOf(300));

        when(serviceService.getAllActiveServices())
                .thenReturn(List.of(s1, s2));

        mockMvc.perform(get("/api/getAllServices"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(2))
                .andExpect(jsonPath("$[0].name").value("Oil Change"));
    }

    // ================= GET AVAILABILITY =================

    @Test
    @WithMockUser(username = "user@test.com", roles = "USER")
    void shouldReturnAvailabilityForDate() throws Exception {

        AvailabilityResponseDTO response = new AvailabilityResponseDTO();
        response.setDate("2026-02-09");
        response.setDayOfWeek("MONDAY");
        response.setBlockedSlots(List.of());

        when(availabilityService.getAvailabilityForDate(LocalDate.of(2026, 2, 9)))
                .thenReturn(response);

        mockMvc.perform(get("/api/getAvailability")
                        .param("date", "2026-02-09"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.date").value("2026-02-09"))
                .andExpect(jsonPath("$.dayOfWeek").value("MONDAY"));
    }

    // ================= GET SLOTS =================

//     @Test
//     @WithMockUser(username = "user@test.com", roles = "USER")
//     void shouldReturnTimeSlotsForDate() throws Exception {

//         SlotDTO slot = new SlotDTO();
//         slot.setStart(LocalTime.of(10, 0));
//         slot.setEnd(LocalTime.of(11, 0));
//         slot.setAvailable(true);

//         TimeSlotResponseDTO response = new TimeSlotResponseDTO();
//         response.setDate("2026-02-09");
//         response.setSlots(List.of(slot));

//         when(availabilityService.getTimeSlotsForDate(LocalDate.of(2026, 2, 9)))
//                 .thenReturn(response);

//         mockMvc.perform(get("/api/getSlots")
//                         .param("date", "2026-02-09"))
//                 .andExpect(status().isOk())
//                 .andExpect(jsonPath("$.date").value("2026-02-09"))
//                 .andExpect(jsonPath("$.slots[0].available").value(true));
//     }

    // ================= UNAUTHENTICATED =================

    @Test
    void shouldRejectWhenNotAuthenticated() throws Exception {

        mockMvc.perform(get("/api/getAllServices"))
                .andExpect(status().isForbidden());
    }
}
