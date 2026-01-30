package com.ikhodalautomotive.appointment.exception;



import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.ikhodalautomotive.appointment.dto.response.ApiResponseDTO;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Handle business exceptions
    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ApiResponseDTO> handleApiException(ApiException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponseDTO(ex.getMessage()));
    }

    // Optional: fallback for unexpected errors
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponseDTO> handleGenericException(Exception ex) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDTO("Something went wrong"));
    }
}
