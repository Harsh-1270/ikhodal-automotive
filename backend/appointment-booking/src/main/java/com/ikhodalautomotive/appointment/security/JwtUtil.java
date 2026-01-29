package com.ikhodalautomotive.appointment.security;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpirationMs;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    // ================= GENERATE TOKEN =================
    public String generateToken(String email, String role) {

        System.out.println("[JwtUtil] Generating token");
        System.out.println("[JwtUtil] Email : " + email);
        System.out.println("[JwtUtil] Role  : " + role);

        String token = Jwts.builder()
                .setSubject(email)
                .claim("role", role) // MUST be ROLE_ADMIN / ROLE_USER
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();

        System.out.println("[JwtUtil] Token generated successfully");
        return token;
    }

    // ================= EXTRACT EMAIL =================
    public String extractEmail(String token) {
        String email = extractAllClaims(token).getSubject();
        System.out.println("[JwtUtil] Extracted Email: " + email);
        return email;
    }

    // ================= EXTRACT ROLE =================
    public String extractRole(String token) {
        String role = extractAllClaims(token).get("role", String.class);
        System.out.println("[JwtUtil] Extracted Role: " + role);
        return role;
    }

    // ================= VALIDATE TOKEN =================
    public boolean validateToken(String token) {
        try {
            extractAllClaims(token);
            System.out.println("[JwtUtil] Token VALID (signature + expiration)");
            return true;
        } catch (Exception e) {
            System.out.println("[JwtUtil] Token INVALID: " + e.getMessage());
            return false;
        }
    }

    // ================= INTERNAL =================
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
