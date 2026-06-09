package com.ekart.customer.exception;

/**
 * Business exception that maps to HTTP 400 Bad Request, carrying a
 * human-readable message exactly as described in the EKart API contract.
 */
public class EkartException extends RuntimeException {

    public EkartException(String message) {
        super(message);
    }
}
