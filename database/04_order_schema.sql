-- =====================================================================
-- EKart — Order Service schema (database: ekart_order)
-- =====================================================================
CREATE DATABASE IF NOT EXISTS ekart_order
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ekart_order;

CREATE TABLE IF NOT EXISTS customer_order (
    order_id          INT          NOT NULL AUTO_INCREMENT,
    customer_email_id VARCHAR(120) NOT NULL,
    date_of_order     DATETIME     NOT NULL,
    total_price       DOUBLE       NOT NULL,
    order_status      VARCHAR(30)  NOT NULL,        -- PENDING_PAYMENT | CONFIRMED
    discount          DOUBLE       NOT NULL DEFAULT 0,
    payment_through   VARCHAR(20)  NOT NULL,        -- Credit | Debit
    date_of_delivery  DATETIME,
    delivery_address  VARCHAR(255) NOT NULL,
    PRIMARY KEY (order_id),
    INDEX idx_order_customer (customer_email_id),
    INDEX idx_order_status   (order_status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS ordered_product (
    ordered_product_id INT    NOT NULL AUTO_INCREMENT,
    product_id         INT    NOT NULL,             -- references product in ekart_product
    unit_price         DOUBLE NOT NULL,
    quantity           INT    NOT NULL,
    order_id           INT    NOT NULL,
    PRIMARY KEY (ordered_product_id),
    INDEX idx_ordered_product_order (order_id),
    CONSTRAINT fk_ordered_product_order FOREIGN KEY (order_id)
        REFERENCES customer_order (order_id) ON DELETE CASCADE,
    CONSTRAINT chk_ordered_product_qty CHECK (quantity >= 1)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Seed data: one confirmed historical order for john.doe
-- ---------------------------------------------------------------------
INSERT INTO customer_order
    (order_id, customer_email_id, date_of_order, total_price, order_status, discount, payment_through, date_of_delivery, delivery_address)
VALUES
    (1, 'john.doe@example.com', '2026-05-20 14:30:00', 7648.20, 'CONFIRMED', 850.80, 'Credit', '2026-05-25 14:30:00', '12 Baker Street, Springfield')
ON DUPLICATE KEY UPDATE total_price = VALUES(total_price);

INSERT INTO ordered_product (product_id, unit_price, quantity, order_id) VALUES
    (2, 8499.00, 1, 1);
