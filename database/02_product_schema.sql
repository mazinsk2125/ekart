-- =====================================================================
-- EKart — Product Service schema (database: ekart_product)
-- =====================================================================
CREATE DATABASE IF NOT EXISTS ekart_product
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ekart_product;

CREATE TABLE IF NOT EXISTS product (
    product_id         INT          NOT NULL AUTO_INCREMENT,
    name               VARCHAR(150) NOT NULL,
    description        VARCHAR(1000) NOT NULL,
    category           VARCHAR(80)  NOT NULL,
    brand              VARCHAR(80)  NOT NULL,
    price              DOUBLE       NOT NULL,
    available_quantity INT          NOT NULL DEFAULT 0,
    image_url          VARCHAR(500),
    PRIMARY KEY (product_id),
    INDEX idx_product_name  (name),
    INDEX idx_product_brand (brand),
    CONSTRAINT chk_product_price CHECK (price >= 0),
    CONSTRAINT chk_product_qty   CHECK (available_quantity >= 0)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Seed data
-- ---------------------------------------------------------------------
INSERT INTO product (name, description, category, brand, price, available_quantity, image_url) VALUES
    ('Aurora Wireless Headphones', 'Over-ear noise-cancelling headphones with 30-hour battery life.', 'Electronics', 'SoundWave', 5999.00, 40, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'),
    ('Pulse Smartwatch 5', 'Fitness smartwatch with heart-rate, SpO2 and GPS tracking.', 'Electronics', 'Pulse', 8499.00, 25, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'),
    ('Nimbus Running Shoes', 'Lightweight breathable running shoes with cushioned sole.', 'Footwear', 'StridePro', 3299.00, 60, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'),
    ('Everyday Cotton T-Shirt', '100% organic cotton crew-neck t-shirt, unisex fit.', 'Apparel', 'UrbanThreads', 799.00, 120, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600'),
    ('Brew Master Coffee Maker', '12-cup programmable drip coffee maker with auto shut-off.', 'Home Appliances', 'BrewMaster', 4599.00, 18, 'https://images.unsplash.com/photo-1517663154410-3a0a35d5b7e3?w=600'),
    ('TrailBlazer Backpack 30L', 'Water-resistant hiking backpack with laptop compartment.', 'Accessories', 'TrailBlazer', 2199.00, 35, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600'),
    ('Lumin Desk Lamp', 'LED desk lamp with adjustable brightness and USB charging port.', 'Home', 'Lumin', 1499.00, 50, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600'),
    ('ProGrip Yoga Mat', 'Non-slip eco-friendly yoga mat, 6mm thickness.', 'Fitness', 'ProGrip', 1099.00, 80, 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=600')
;
