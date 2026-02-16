package com.ikhodalautomotive.appointment.service;

import com.ikhodalautomotive.appointment.dto.request.AddToCartRequestDTO;
import com.ikhodalautomotive.appointment.dto.request.UpdateCartItemRequestDTO;
import com.ikhodalautomotive.appointment.dto.response.CartItemResponseDTO;

import java.util.List;

public interface CartService {

    List<CartItemResponseDTO> getCartItems(String userEmail);

    CartItemResponseDTO addToCart(AddToCartRequestDTO request, String userEmail);

    CartItemResponseDTO updateCartItem(Long serviceId, UpdateCartItemRequestDTO request, String userEmail);

    void removeFromCart(Long serviceId, String userEmail);

    void clearCart(String userEmail);
}
