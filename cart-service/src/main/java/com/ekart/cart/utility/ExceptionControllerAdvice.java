package com.ekart.cart.utility;

import com.ekart.cart.exception.EkartException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

/**
 * Global ControllerAdvice exception handler. Converts exceptions into a
 * consistent ErrorInfo response body.
 */
@RestControllerAdvice
public class ExceptionControllerAdvice {

    @ExceptionHandler(EkartException.class)
    public ResponseEntity<ErrorInfo> handleEkart(EkartException ex) {
        ErrorInfo body = new ErrorInfo(HttpStatus.BAD_REQUEST.value(), ex.getMessage(), LocalDateTime.now());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorInfo> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
            .map(FieldError::getDefaultMessage)
            .collect(Collectors.joining("; "));
        ErrorInfo body = new ErrorInfo(
            HttpStatus.BAD_REQUEST.value(),
            message.isEmpty() ? "Invalid data" : message,
            LocalDateTime.now());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorInfo> handleGeneric(Exception ex) {
        ErrorInfo body = new ErrorInfo(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "An unexpected error occurred: " + ex.getMessage(),
            LocalDateTime.now());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }
}
