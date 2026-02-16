package com.ikhodalautomotive.appointment.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ikhodalautomotive.appointment.dto.request.AddToCartRequestDTO;
import com.ikhodalautomotive.appointment.dto.response.CartItemResponseDTO;
import com.ikhodalautomotive.appointment.service.CartService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class CartControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CartService cartService;

    @Autowired
    private ObjectMapper objectMapper;

    private CartItemResponseDTO buildCartItemResponse() {
        return new CartItemResponseDTO(
                1L, 10L, "General Service",
                "Complete car checkup & maintenance",
                "Wrench", new BigDecimal("249.00"),
                "2-3 hours", 1);
    }

    @Test
    void shouldReturn403WhenNotAuthenticated() throws Exception {
        mockMvc.perform(get("/api/cart"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "user@test.com", roles = "USER")
    void shouldReturnCartItemsForAuthenticatedUser() throws Exception {
        CartItemResponseDTO item = buildCartItemResponse();
        when(cartService.getCartItems("user@test.com"))
                .thenReturn(List.of(item));

        mockMvc.perform(get("/api/cart"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].serviceName").value("General Service"))
                .andExpect(jsonPath("$[0].quantity").value(1));
    }

    @Test
    @WithMockUser(username = "user@test.com", roles = "USER")
    void shouldAddItemToCart() throws Exception {
        AddToCartRequestDTO request = new AddToCartRequestDTO();
        request.setServiceId(10L);
        request.setQuantity(1);

        CartItemResponseDTO response = buildCartItemResponse();
        when(cartService.addToCart(any(AddToCartRequestDTO.class), eq("user@test.com")))
                .thenReturn(response);

        mockMvc.perform(post("/api/cart")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.serviceName").value("General Service"))
                .andExpect(jsonPath("$.quantity").value(1));
    }

    @Test
    @WithMockUser(username = "user@test.com", roles = "USER")
    void shouldRemoveItemFromCart() throws Exception {
        doNothing().when(cartService).removeFromCart(10L, "user@test.com");

        mockMvc.perform(delete("/api/cart/10"))
                .andExpect(status().isNoContent());
    }
}
