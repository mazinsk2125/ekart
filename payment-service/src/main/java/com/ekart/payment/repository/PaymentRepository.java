package com.ekart.payment.repository;

import com.ekart.payment.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    boolean existsByOrderId(Integer orderId);
}
