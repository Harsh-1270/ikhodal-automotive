package com.ikhodalautomotive.appointment.repository;

import com.ikhodalautomotive.appointment.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByUserEmail(String email);

    Optional<CartItem> findByUserEmailAndServiceId(String email, Long serviceId);

    void deleteByUserEmail(String email);

    void deleteByUserEmailAndServiceId(String email, Long serviceId);

    void deleteByUserId(Long userId);
}
