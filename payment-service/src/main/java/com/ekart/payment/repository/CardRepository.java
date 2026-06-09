package com.ekart.payment.repository;

import com.ekart.payment.entity.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CardRepository extends JpaRepository<Card, Integer> {

    List<Card> findByCustomerEmailIdAndCardTypeIgnoreCase(String customerEmailId, String cardType);

    List<Card> findByCustomerEmailId(String customerEmailId);

    Optional<Card> findByCardIdAndCustomerEmailId(Integer cardId, String customerEmailId);
}
