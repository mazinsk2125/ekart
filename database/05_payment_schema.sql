-- =====================================================================
-- EKart — Payment Service schema (database: ekart_payment)
-- =====================================================================
CREATE DATABASE IF NOT EXISTS ekart_payment
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ekart_payment;

CREATE TABLE IF NOT EXISTS card (
    card_id           INT          NOT NULL AUTO_INCREMENT,
    card_type         VARCHAR(10)  NOT NULL,        -- Credit | Debit
    card_number       VARCHAR(16)  NOT NULL,
    name_on_card      VARCHAR(50)  NOT NULL,
    hash_cvv          VARCHAR(100) NOT NULL,        -- BCrypt hash of CVV
    expiry_date       DATE         NOT NULL,
    customer_email_id VARCHAR(120) NOT NULL,
    PRIMARY KEY (card_id),
    INDEX idx_card_customer (customer_email_id),
    INDEX idx_card_type     (card_type)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS payment (
    payment_id        INT          NOT NULL AUTO_INCREMENT,
    order_id          INT          NOT NULL,
    customer_email_id VARCHAR(120) NOT NULL,
    card_id           INT          NOT NULL,
    amount            DOUBLE       NOT NULL,
    paid_at           DATETIME     NOT NULL,
    PRIMARY KEY (payment_id),
    UNIQUE KEY uq_payment_order (order_id),         -- one payment per order
    INDEX idx_payment_customer (customer_email_id),
    CONSTRAINT fk_payment_card FOREIGN KEY (card_id)
        REFERENCES card (card_id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Seed data: one credit card for john.doe
-- hash_cvv below is a BCrypt hash of CVV "123".
-- ---------------------------------------------------------------------
INSERT INTO card (card_id, card_type, card_number, name_on_card, hash_cvv, expiry_date, customer_email_id) VALUES
    (1, 'Credit', '4111111111111111', 'John Doe',
     '$2b$10$Ojqn2UkhD5GyB17yWMGNwORFyKf9fkGBzW1KFC4qg7nnieOyo4vLC', '2030-12-31', 'john.doe@example.com')
ON DUPLICATE KEY UPDATE card_number = VALUES(card_number);
