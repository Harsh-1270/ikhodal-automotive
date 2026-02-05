package com.ikhodalautomotive.appointment.security;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import com.ikhodalautomotive.appointment.service.AvailabilityService;
import com.ikhodalautomotive.appointment.service.ServiceService;
import com.ikhodalautomotive.appointment.service.UserService;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class SecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AvailabilityService availabilityService;

    @MockBean
    private ServiceService serviceService;

    @MockBean
    private UserService userService;

    @Test
    @WithMockUser(username = "user@test.com", roles = "USER")
    void shouldForbidUserFromAccessingAdminApi() throws Exception {

        mockMvc.perform(get("/api/admin/getAllUsers"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "admin@test.com", roles = "ADMIN")
    void shouldAllowAdminToAccessAdminApi() throws Exception {

        mockMvc.perform(get("/api/admin/getAllUsers"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "admin@test.com", roles = "ADMIN")
    void shouldAllowAdminToAddAvailabilityRule() throws Exception {

        String payload = """
            {
              "dayOfWeek": "MONDAY",
              "startTime": "10:00",
              "endTime": "12:00",
              "isAvailable": false
            }
            """;

        mockMvc.perform(
                post("/api/admin/addAvailabilityRule")
                        .contentType("application/json")
                        .content(payload)
        ).andExpect(status().isOk());
    }
}
