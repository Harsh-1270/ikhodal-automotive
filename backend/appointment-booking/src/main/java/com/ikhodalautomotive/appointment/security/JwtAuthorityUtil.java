package com.ikhodalautomotive.appointment.security;

import java.util.List;

import org.springframework.security.core.authority.SimpleGrantedAuthority;

public class JwtAuthorityUtil {

    public static List<SimpleGrantedAuthority> getAuthorities(String role) {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role));
    }
}
