package com.ekart.payment.controller;

import com.ekart.payment.dto.AddCardRequest;
import com.ekart.payment.dto.CardResponse;
import com.ekart.payment.dto.MakePaymentRequest;
import com.ekart.payment.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/payment-api")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // ":.+" preserves the full email (so the dot before the TLD isn't truncated).
    @PostMapping("/customer/{customerEmailId:.+}/cards")
    public ResponseEntity<String> addCard(@PathVariable String customerEmailId,
                                          @Valid @RequestBody AddCardRequest request) {
        Integer cardId = paymentService.addCard(customerEmailId, request);
        return ResponseEntity.ok("The card has been successfully added, with card ID: " + cardId);
    }

    @GetMapping("/customer/{customerEmailId}/card-type/{cardType}")
    public ResponseEntity<List<CardResponse>> getCards(@PathVariable String customerEmailId,
                                                       @PathVariable String cardType) {
        return ResponseEntity.ok(paymentService.getCards(customerEmailId, cardType));
    }

    @PostMapping("/customer/{customerEmailId}/order/{orderId}")
    public ResponseEntity<String> makePayment(@PathVariable String customerEmailId,
                                              @PathVariable Integer orderId,
                                              @Valid @RequestBody MakePaymentRequest request) {
        return ResponseEntity.ok(paymentService.makePayment(customerEmailId, orderId, request));
    }
}
