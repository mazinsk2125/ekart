-- =====================================================================
-- EKart — Cart Service schema (database: ekart_cart)
-- =====================================================================
CREATE DATABASE IF NOT EXISTS ekart_cart
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ekart_cart;

CREATE TABLE IF NOT EXISTS cart (
    cart_id            INT          NOT NULL AUTO_INCREMENT,
    customer_email_id  VARCHAR(120) NOT NULL,
    PRIMARY KEY (cart_id),
    UNIQUE KEY uq_cart_customer (customer_email_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS cart_product (
    cart_product_id INT NOT NULL AUTO_INCREMENT,
    product_id      INT NOT NULL,                 -- references product in ekart_product (no cross-DB FK)
    quantity        INT NOT NULL DEFAULT 1,
    cart_id         INT NOT NULL,
    PRIMARY KEY (cart_product_id),
    INDEX idx_cart_product_cart (cart_id),
    CONSTRAINT fk_cart_product_cart FOREIGN KEY (cart_id)
        REFERENCES cart (cart_id) ON DELETE CASCADE,
    CONSTRAINT chk_cart_product_qty CHECK (quantity >= 1)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Seed data: one cart for john.doe with two products
-- ---------------------------------------------------------------------
INSERT INTO cart (cart_id, customer_email_id) VALUES (1, 'john.doe@example.com')
ON DUPLICATE KEY UPDATE customer_email_id = VALUES(customer_email_id);

INSERT INTO cart_product (product_id, quantity, cart_id) VALUES
    (1, 1, 1),
    (3, 2, 1);
