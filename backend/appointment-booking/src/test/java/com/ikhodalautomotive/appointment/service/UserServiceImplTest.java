package com.ikhodalautomotive.appointment.service;

import com.ikhodalautomotive.appointment.dto.response.UserResponseDTO;
import com.ikhodalautomotive.appointment.model.User;
import com.ikhodalautomotive.appointment.repository.UserRepository;
import com.ikhodalautomotive.appointment.service.impl.UserServiceImpl;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserServiceImpl userService;

    @Test
    void shouldReturnAllUsersMappedToResponseDTO() {

        User u1 = new User();
        u1.setName("User One");
        u1.setEmail("one@test.com");

        User u2 = new User();
        u2.setName("User Two");
        u2.setEmail("two@test.com");

        when(userRepository.findAll())
                .thenReturn(List.of(u1, u2));

        List<UserResponseDTO> result = userService.getAllUsers();

        assertEquals(2, result.size());
        assertEquals("User One", result.get(0).getName());
        assertEquals("one@test.com", result.get(0).getEmail());
        assertEquals("User Two", result.get(1).getName());
        assertEquals("two@test.com", result.get(1).getEmail());
    }

    @Test
    void shouldReturnEmptyListWhenNoUsersExist() {

        when(userRepository.findAll())
                .thenReturn(List.of());

        List<UserResponseDTO> result = userService.getAllUsers();

        assertTrue(result.isEmpty());
    }
}
