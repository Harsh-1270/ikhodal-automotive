package com.ikhodalautomotive.appointment.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ikhodalautomotive.appointment.dto.response.UserResponseDTO;
import com.ikhodalautomotive.appointment.exception.ApiException;
import com.ikhodalautomotive.appointment.model.Appointment;
import com.ikhodalautomotive.appointment.repository.AppointmentDetailsRepository;
import com.ikhodalautomotive.appointment.repository.AppointmentRepository;
import com.ikhodalautomotive.appointment.repository.AppointmentServiceRepository;
import com.ikhodalautomotive.appointment.repository.CartItemRepository;
import com.ikhodalautomotive.appointment.repository.EmailOtpRepository;
import com.ikhodalautomotive.appointment.repository.PaymentRepository;
import com.ikhodalautomotive.appointment.repository.RefreshTokenRepository;
import com.ikhodalautomotive.appointment.repository.UserAuthProviderRepository;
import com.ikhodalautomotive.appointment.repository.UserRepository;
import com.ikhodalautomotive.appointment.service.UserService;

@Service
public class UserServiceImpl implements UserService {

        @Autowired
        public UserRepository userRepository;

        @Autowired
        private AppointmentRepository appointmentRepository;

        @Autowired
        private AppointmentServiceRepository appointmentServiceRepository;

        @Autowired
        private AppointmentDetailsRepository appointmentDetailsRepository;

        @Autowired
        private PaymentRepository paymentRepository;

        @Autowired
        private CartItemRepository cartItemRepository;

        @Autowired
        private RefreshTokenRepository refreshTokenRepository;

        @Autowired
        private UserAuthProviderRepository userAuthProviderRepository;

        @Autowired
        private EmailOtpRepository emailOtpRepository;

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
        @Transactional
        public void deleteUser(Long id) {
                if (!userRepository.existsById(id)) {
                        throw new ApiException("User not found with id: " + id);
                }

                // 1. Get all appointment IDs for this user
                List<Long> appointmentIds = appointmentRepository.findByUserId(id)
                                .stream()
                                .map(Appointment::getId)
                                .collect(Collectors.toList());

                if (!appointmentIds.isEmpty()) {
                        // 2. Delete payments linked to user's appointments
                        paymentRepository.deleteByAppointmentIdIn(appointmentIds);

                        // 3. Delete appointment details linked to user's appointments
                        appointmentDetailsRepository.deleteByAppointmentIdIn(appointmentIds);

                        // 4. Delete appointment-service mappings
                        appointmentServiceRepository.deleteByAppointmentIdIn(appointmentIds);

                        // 5. Delete appointments themselves
                        appointmentRepository.deleteAllById(appointmentIds);
                }

                // 6. Delete cart items
                cartItemRepository.deleteByUserId(id);

                // 7. Delete refresh tokens
                refreshTokenRepository.deleteByUserId(id);

                // 8. Delete auth providers
                userAuthProviderRepository.deleteByUserId(id);

                // 9. Delete email OTP verifications
                emailOtpRepository.deleteByUserId(id);

                // 10. Finally delete the user
                userRepository.deleteById(id);
        }
}
