package com.ikhodalautomotive.appointment.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ikhodalautomotive.appointment.dto.response.UserResponseDTO;
import com.ikhodalautomotive.appointment.exception.ApiException;
import com.ikhodalautomotive.appointment.repository.AppointmentRepository;
import com.ikhodalautomotive.appointment.repository.UserRepository;
import com.ikhodalautomotive.appointment.service.UserService;

@Service
public class UserServiceImpl implements UserService {

        @Autowired
        public UserRepository userRepository;

        @Autowired
        private AppointmentRepository appointmentRepository;

        public List<UserResponseDTO> getAllUsers() {
                return userRepository.findAll().stream()
                                .filter(user -> user.getRole() != null
                                                && !"ROLE_ADMIN".equals(user.getRole().getName()))
                                .map(user -> UserResponseDTO.builder()
                                                .id(user.getId())
                                                .name(user.getName())
                                                .email(user.getEmail())
                                                .isActive(user.isActive())
                                                .isOnline(user.isOnline())
                                                .createdAt(user.getCreatedAt())
                                                .totalBookings((int) appointmentRepository.countByUserId(user.getId()))
                                                .build())
                                .toList();
        }

        @Override
        public void deleteUser(Long id) {
                if (!userRepository.existsById(id)) {
                        throw new ApiException("User not found with id: " + id);
                }
                userRepository.deleteById(id);
        }
}
