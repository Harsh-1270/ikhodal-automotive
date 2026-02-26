package com.ikhodalautomotive.appointment.service;

import java.util.List;
import com.ikhodalautomotive.appointment.dto.response.UserResponseDTO;

public interface UserService {

    List<UserResponseDTO> getAllUsers();

    void deleteUser(Long id);
}
