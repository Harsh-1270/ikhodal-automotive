// package com.ikhodalautomotive.appointment.service;

// import com.ikhodalautomotive.appointment.service.impl.EmailServiceImpl;

// import jakarta.mail.MessagingException;
// import jakarta.mail.internet.MimeMessage;

// import org.junit.jupiter.api.Test;
// import org.junit.jupiter.api.extension.ExtendWith;
// import org.mockito.InjectMocks;
// import org.mockito.Mock;
// import org.mockito.junit.jupiter.MockitoExtension;
// import org.springframework.mail.MailSendException;
// import org.springframework.mail.javamail.JavaMailSender;

// import static org.junit.jupiter.api.Assertions.*;
// import static org.mockito.Mockito.*;

// @ExtendWith(MockitoExtension.class)
// class EmailServiceImplTest {

//     @Mock
//     private JavaMailSender mailSender;

//     @InjectMocks
//     private EmailServiceImpl emailService;

//     @Test
//     void shouldSendOtpEmailSuccessfully() {

//         MimeMessage mimeMessage = mock(MimeMessage.class);

//         when(mailSender.createMimeMessage())
//                 .thenReturn(mimeMessage);

//         assertDoesNotThrow(() ->
//                 emailService.sendOtpEmail("test@test.com", "123456")
//         );

//         verify(mailSender, times(1))
//                 .send(mimeMessage);
//     }

//     @Test
//     void shouldThrowRuntimeExceptionWhenEmailSendingFails() {

//         MimeMessage mimeMessage = mock(MimeMessage.class);

//         when(mailSender.createMimeMessage())
//                 .thenReturn(mimeMessage);

//         doThrow(new MailSendException("Mail error"))
//                 .when(mailSender).send(mimeMessage);

//         RuntimeException ex = assertThrows(
//                 RuntimeException.class,
//                 () -> emailService.sendOtpEmail("test@test.com", "123456")
//         );

//         assertEquals("Failed to send OTP email", ex.getMessage());
//     }

//     @Test
//     void shouldThrowRuntimeExceptionWhenMimeMessageCreationFails() {

//         when(mailSender.createMimeMessage())
//                 .thenThrow(new MailSendException("Create message failed"));

//         RuntimeException ex = assertThrows(
//                 RuntimeException.class,
//                 () -> emailService.sendOtpEmail("test@test.com", "123456")
//         );

//         assertEquals("Failed to send OTP email", ex.getMessage());
//     }
// }
