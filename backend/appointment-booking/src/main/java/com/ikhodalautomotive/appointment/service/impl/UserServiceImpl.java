package com.ikhodalautomotive.appointment.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ikhodalautomotive.appointment.dto.response.UserResponseDTO;
import com.ikhodalautomotive.appointment.repository.UserRepository;
import com.ikhodalautomotive.appointment.service.UserService;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    public UserRepository userRepository;


    public List<UserResponseDTO> getAllUsers(){
        return userRepository.findAll().stream().map(user -> {
            return new UserResponseDTO(
                user.getName(),
                user.getEmail()
            );
        }).toList();
    }
}
