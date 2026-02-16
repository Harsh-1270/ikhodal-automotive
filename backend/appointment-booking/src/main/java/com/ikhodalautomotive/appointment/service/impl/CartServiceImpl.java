package com.ikhodalautomotive.appointment.service.impl;

import com.ikhodalautomotive.appointment.dto.request.AddToCartRequestDTO;
import com.ikhodalautomotive.appointment.dto.request.UpdateCartItemRequestDTO;
import com.ikhodalautomotive.appointment.dto.response.CartItemResponseDTO;
import com.ikhodalautomotive.appointment.model.CartItem;
import com.ikhodalautomotive.appointment.model.Services;
import com.ikhodalautomotive.appointment.model.User;
import com.ikhodalautomotive.appointment.repository.CartItemRepository;
import com.ikhodalautomotive.appointment.repository.ServiceRepository;
import com.ikhodalautomotive.appointment.repository.UserRepository;
import com.ikhodalautomotive.appointment.service.CartService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartServiceImpl implements CartService {

    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;

    public CartServiceImpl(CartItemRepository cartItemRepository,
            UserRepository userRepository,
            ServiceRepository serviceRepository) {
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
    }

    @Override
    public List<CartItemResponseDTO> getCartItems(String userEmail) {
        List<CartItem> items = cartItemRepository.findByUserEmail(userEmail);
        return items.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CartItemResponseDTO addToCart(AddToCartRequestDTO request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Services service = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new RuntimeException("Service not found"));

        // Check if item already exists in cart
        Optional<CartItem> existingItem = cartItemRepository
                .findByUserEmailAndServiceId(userEmail, request.getServiceId());

        CartItem cartItem;
        if (existingItem.isPresent()) {
            // Increment quantity
            cartItem = existingItem.get();
            int addQty = (request.getQuantity() != null && request.getQuantity() > 0)
                    ? request.getQuantity()
                    : 1;
            cartItem.setQuantity(cartItem.getQuantity() + addQty);
        } else {
            // Create new cart item
            cartItem = new CartItem();
            cartItem.setUser(user);
            cartItem.setService(service);
            cartItem.setQuantity(
                    (request.getQuantity() != null && request.getQuantity() > 0)
                            ? request.getQuantity()
                            : 1);
        }

        cartItem = cartItemRepository.save(cartItem);
        return toResponseDTO(cartItem);
    }

    @Override
    @Transactional
    public CartItemResponseDTO updateCartItem(Long serviceId, UpdateCartItemRequestDTO request,
            String userEmail) {
        CartItem cartItem = cartItemRepository.findByUserEmailAndServiceId(userEmail, serviceId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (request.getQuantity() != null && request.getQuantity() > 0) {
            cartItem.setQuantity(request.getQuantity());
        } else {
            throw new RuntimeException("Quantity must be greater than 0");
        }

        cartItem = cartItemRepository.save(cartItem);
        return toResponseDTO(cartItem);
    }

    @Override
    @Transactional
    public void removeFromCart(Long serviceId, String userEmail) {
        cartItemRepository.deleteByUserEmailAndServiceId(userEmail, serviceId);
    }

    @Override
    @Transactional
    public void clearCart(String userEmail) {
        cartItemRepository.deleteByUserEmail(userEmail);
    }

    private CartItemResponseDTO toResponseDTO(CartItem cartItem) {
        Services service = cartItem.getService();
        return new CartItemResponseDTO(
                cartItem.getId(),
                service.getId(),
                service.getName(),
                service.getDescription(),
                service.getIcon(),
                service.getPrice(),
                service.getDuration(),
                cartItem.getQuantity());
    }
}
