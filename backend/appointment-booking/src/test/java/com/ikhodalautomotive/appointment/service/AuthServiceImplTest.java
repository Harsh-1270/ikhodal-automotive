package com.ikhodalautomotive.appointment.service;

import com.ikhodalautomotive.appointment.dto.request.LoginRequestDTO;
import com.ikhodalautomotive.appointment.dto.request.SignupRequestDTO;
import com.ikhodalautomotive.appointment.dto.request.VerifyOtpRequestDTO;
import com.ikhodalautomotive.appointment.exception.ApiException;
import com.ikhodalautomotive.appointment.model.EmailOtpVerification;
import com.ikhodalautomotive.appointment.model.Role;
import com.ikhodalautomotive.appointment.model.User;
import com.ikhodalautomotive.appointment.repository.EmailOtpRepository;
import com.ikhodalautomotive.appointment.repository.RoleRepository;
import com.ikhodalautomotive.appointment.repository.UserAuthProviderRepository;
import com.ikhodalautomotive.appointment.repository.UserRepository;
import com.ikhodalautomotive.appointment.security.JwtUtil;
import com.ikhodalautomotive.appointment.service.impl.AuthServiceImpl;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private UserAuthProviderRepository authProviderRepository;

    @Mock
    private EmailOtpRepository otpRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private EmailService emailService;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthServiceImpl authService;

    // ================= SIGNUP =================

    @Test
    void shouldSignupUserSuccessfully() {

        SignupRequestDTO dto = new SignupRequestDTO();
        dto.setName("Test");
        dto.setEmail("test@test.com");
        dto.setPassword("pass");

        Role role = new Role();
        role.setName("USER");

        when(userRepository.findByEmail("test@test.com"))
                .thenReturn(Optional.empty());

        when(roleRepository.findByName("USER"))
                .thenReturn(Optional.of(role));

        when(passwordEncoder.encode("pass"))
                .thenReturn("ENCODED");

        authService.signup(dto);

        verify(userRepository).save(any(User.class));
        verify(authProviderRepository).save(any());
        verify(otpRepository).save(any(EmailOtpVerification.class));
        verify(emailService).sendOtpEmail(eq("test@test.com"), anyString());
    }

    @Test
    void shouldFailSignupWhenEmailAlreadyExists() {

        when(userRepository.findByEmail("test@test.com"))
                .thenReturn(Optional.of(new User()));

        SignupRequestDTO dto = new SignupRequestDTO();
        dto.setEmail("test@test.com");

        ApiException ex = assertThrows(
                ApiException.class,
                () -> authService.signup(dto)
        );

        assertEquals("Email already registered", ex.getMessage());
    }

    // ================= VERIFY OTP =================

    @Test
    void shouldVerifyOtpSuccessfully() {

        User user = new User();
        user.setEmail("test@test.com");

        EmailOtpVerification otp = new EmailOtpVerification();
        otp.setOtpCode("123456");
        otp.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        otp.setUsed(false);

        when(userRepository.findByEmail("test@test.com"))
                .thenReturn(Optional.of(user));

        when(otpRepository.findByUserAndOtpCodeAndIsUsedFalse(user, "123456"))
                .thenReturn(Optional.of(otp));

        VerifyOtpRequestDTO dto = new VerifyOtpRequestDTO();
        dto.setEmail("test@test.com");
        dto.setOtp("123456");

        authService.verifyOtp(dto);

        assertTrue(otp.isUsed());
        verify(userRepository).save(user);
    }

    @Test
    void shouldFailOtpWhenExpired() {

        User user = new User();

        EmailOtpVerification otp = new EmailOtpVerification();
        otp.setExpiresAt(LocalDateTime.now().minusMinutes(1));

        when(userRepository.findByEmail("test@test.com"))
                .thenReturn(Optional.of(user));

        when(otpRepository.findByUserAndOtpCodeAndIsUsedFalse(user, "123456"))
                .thenReturn(Optional.of(otp));

        VerifyOtpRequestDTO dto = new VerifyOtpRequestDTO();
        dto.setEmail("test@test.com");
        dto.setOtp("123456");

        ApiException ex = assertThrows(
                ApiException.class,
                () -> authService.verifyOtp(dto)
        );

        assertEquals("OTP expired", ex.getMessage());
    }

    // ================= LOGIN =================

    @Test
    void shouldLoginSuccessfully() {

        Role role = new Role();
        role.setName("USER");

        User user = new User();
        user.setEmail("test@test.com");
        user.setPassword("ENCODED");
        user.setEmailVerified(true);
        user.setRole(role);

        when(userRepository.findByEmail("test@test.com"))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches("pass", "ENCODED"))
                .thenReturn(true);

        when(jwtUtil.generateToken("test@test.com", "ROLE_USER"))
                .thenReturn("JWT_TOKEN");

        LoginRequestDTO dto = new LoginRequestDTO();
        dto.setEmail("test@test.com");
        dto.setPassword("pass");

        String token = authService.login(dto);

        assertEquals("JWT_TOKEN", token);
    }

    @Test
    void shouldFailLoginWhenEmailNotVerified() {

        User user = new User();
        user.setEmailVerified(false);

        when(userRepository.findByEmail("test@test.com"))
                .thenReturn(Optional.of(user));

        LoginRequestDTO dto = new LoginRequestDTO();
        dto.setEmail("test@test.com");

        ApiException ex = assertThrows(
                ApiException.class,
                () -> authService.login(dto)
        );

        assertEquals("Email not verified", ex.getMessage());
    }

    @Test
    void shouldFailLoginWhenPasswordInvalid() {

        User user = new User();
        user.setEmailVerified(true);
        user.setPassword("ENCODED");

        when(userRepository.findByEmail("test@test.com"))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches(any(), any()))
                .thenReturn(false);

        LoginRequestDTO dto = new LoginRequestDTO();
        dto.setEmail("test@test.com");
        dto.setPassword("wrong");

        ApiException ex = assertThrows(
                ApiException.class,
                () -> authService.login(dto)
        );

        assertEquals("Invalid email or password", ex.getMessage());
    }
}
