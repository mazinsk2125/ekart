package com.ekart.order.repository;

import com.ekart.order.entity.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, Integer> {

    List<OrderEntity> findByCustomerEmailIdOrderByDateOfOrderDesc(String customerEmailId);
}
