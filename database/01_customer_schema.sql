-- =====================================================================
-- EKart — Customer Service schema (database: ekart_customer)
-- =====================================================================
CREATE DATABASE IF NOT EXISTS ekart_customer
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ekart_customer;

CREATE TABLE IF NOT EXISTS customer (
    email_id     VARCHAR(120) NOT NULL,
    name         VARCHAR(100) NOT NULL,
    password     VARCHAR(100) NOT NULL,            -- BCrypt hash
    phone_number VARCHAR(15)  NOT NULL,
    address      VARCHAR(255) NOT NULL,
    PRIMARY KEY (email_id),
    INDEX idx_customer_phone (phone_number)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Seed data
-- Password for all sample users is "Ekart@123" (BCrypt hashed).
-- ---------------------------------------------------------------------
INSERT INTO customer (email_id, name, password, phone_number, address) VALUES
    ('john.doe@example.com',  'John Doe',
     '$2b$10$Nd6Hj0ltI3wFDFBf5EngZOvUoMGEyNvSd/sjfzMKtMKxa2p0qdEjO', '9876543210',
     '12 Baker Street, Springfield'),
    ('jane.smith@example.com','Jane Smith',
     '$2b$10$tIdStLBqvykSrXlB9cIyyeMW31vRzCnQb.SnYxlf2wXoqu1tUOt1C', '9123456780',
     '45 Park Avenue, Metropolis')
ON DUPLICATE KEY UPDATE name = VALUES(name);
