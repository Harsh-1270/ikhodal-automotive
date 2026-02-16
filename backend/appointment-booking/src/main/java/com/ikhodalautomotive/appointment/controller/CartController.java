package com.ikhodalautomotive.appointment.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.ikhodalautomotive.appointment.dto.request.AddToCartRequestDTO;
import com.ikhodalautomotive.appointment.dto.request.UpdateCartItemRequestDTO;
import com.ikhodalautomotive.appointment.dto.response.CartItemResponseDTO;
import com.ikhodalautomotive.appointment.service.CartService;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    // GET : localhost:8082/api/cart
    @GetMapping
    public ResponseEntity<List<CartItemResponseDTO>> getCartItems(Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(cartService.getCartItems(userEmail));
    }

    // POST : localhost:8082/api/cart
    @PostMapping
    public ResponseEntity<CartItemResponseDTO> addToCart(
            @RequestBody AddToCartRequestDTO request,
            Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(cartService.addToCart(request, userEmail));
    }

    // PUT : localhost:8082/api/cart/{serviceId}
    @PutMapping("/{serviceId}")
    public ResponseEntity<CartItemResponseDTO> updateCartItem(
            @PathVariable Long serviceId,
            @RequestBody UpdateCartItemRequestDTO request,
            Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(cartService.updateCartItem(serviceId, request, userEmail));
    }

    // DELETE : localhost:8082/api/cart/{serviceId}
    @DeleteMapping("/{serviceId}")
    public ResponseEntity<Void> removeFromCart(
            @PathVariable Long serviceId,
            Authentication authentication) {
        String userEmail = authentication.getName();
        cartService.removeFromCart(serviceId, userEmail);
        return ResponseEntity.noContent().build();
    }

    // DELETE : localhost:8082/api/cart
    @DeleteMapping
    public ResponseEntity<Void> clearCart(Authentication authentication) {
        String userEmail = authentication.getName();
        cartService.clearCart(userEmail);
        return ResponseEntity.noContent().build();
    }
}
