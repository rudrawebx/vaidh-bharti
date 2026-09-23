-- =========================================================================
-- VAIDH BHARTI AYURVEDA — HOSTINGER MYSQL DATABASE SCHEMA & INITIAL SEED
-- =========================================================================
-- Instructions:
-- 1. In Hostinger hPanel -> Databases -> MySQL Databases, create a new Database & User.
-- 2. Open phpMyAdmin for that database.
-- 3. Click "Import" -> Select this file -> Click "Go" / "Import".
-- =========================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Site Settings (Business Info, Sequence, Shipping, Taxes)
CREATE TABLE IF NOT EXISTS `site_settings` (
  `key` VARCHAR(80) NOT NULL PRIMARY KEY,
  `value` JSON NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Categories
CREATE TABLE IF NOT EXISTS `categories` (
  `id` VARCHAR(80) NOT NULL PRIMARY KEY,
  `name` VARCHAR(120) NOT NULL,
  `slug` VARCHAR(120) NOT NULL UNIQUE,
  `description` TEXT NULL,
  `image_url` VARCHAR(500) NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Products
CREATE TABLE IF NOT EXISTS `products` (
  `id` VARCHAR(80) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `sku` VARCHAR(80) NULL,
  `short_description` TEXT NULL,
  `description` LONGTEXT NULL,
  `benefits` JSON NULL,
  `ingredients` TEXT NULL,
  `usage_instructions` TEXT NULL,
  `price` DECIMAL(10,2) NULL,
  `mrp` DECIMAL(10,2) NULL,
  `stock` INT NOT NULL DEFAULT 100,
  `net_quantity` VARCHAR(80) NULL,
  `category_id` VARCHAR(80) NULL,
  `images` JSON NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
  `is_best_seller` TINYINT(1) NOT NULL DEFAULT 0,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_prod_slug` (`slug`),
  INDEX `idx_prod_sku` (`sku`),
  INDEX `idx_prod_cat` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Product Pack Variants
CREATE TABLE IF NOT EXISTS `product_variants` (
  `id` VARCHAR(80) NOT NULL PRIMARY KEY,
  `product_id` VARCHAR(80) NOT NULL,
  `label` VARCHAR(80) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `mrp` DECIMAL(10,2) NULL,
  `stock` INT NOT NULL DEFAULT 50,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_var_prod` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Orders (Monotonic Sequential Numbers, Invoicing, Fulfillment)
CREATE TABLE IF NOT EXISTS `orders` (
  `id` VARCHAR(80) NOT NULL PRIMARY KEY,
  `order_number` VARCHAR(80) NOT NULL UNIQUE,
  `invoice_number` VARCHAR(80) NULL UNIQUE,
  `invoice_date` DATETIME NULL,
  `customer_name` VARCHAR(160) NOT NULL,
  `phone` VARCHAR(40) NOT NULL,
  `email` VARCHAR(160) NULL,
  `address_line1` VARCHAR(255) NOT NULL,
  `address_line2` VARCHAR(255) NULL,
  `city` VARCHAR(100) NOT NULL,
  `state` VARCHAR(100) NOT NULL,
  `pincode` VARCHAR(20) NOT NULL,
  `payment_method` VARCHAR(40) NOT NULL, -- 'cod' | 'online'
  `payment_status` VARCHAR(40) NOT NULL DEFAULT 'pending', -- 'pending' | 'paid' | 'failed' | 'refunded'
  `payment_gateway_order_id` VARCHAR(100) NULL,
  `payment_gateway_payment_id` VARCHAR(100) NULL,
  `payment_gateway_payload` JSON NULL,
  `status` VARCHAR(40) NOT NULL DEFAULT 'pending', -- 'pending' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled'
  `subtotal` DECIMAL(10,2) NOT NULL,
  `discount_amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `shipping_amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `tax_amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `total` DECIMAL(10,2) NOT NULL,
  `coupon_code` VARCHAR(50) NULL,
  `courier` VARCHAR(100) NULL,
  `tracking_number` VARCHAR(100) NULL,
  `notes` TEXT NULL,
  `audit_log` JSON NULL,
  `cancelled_reason` TEXT NULL,
  `refund_reference` VARCHAR(100) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_order_num` (`order_number`),
  INDEX `idx_order_inv` (`invoice_number`),
  INDEX `idx_order_status` (`status`),
  INDEX `idx_order_created` (`created_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Order Items
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` VARCHAR(80) NOT NULL PRIMARY KEY,
  `order_id` VARCHAR(80) NOT NULL,
  `product_id` VARCHAR(80) NULL,
  `product_name` VARCHAR(255) NOT NULL,
  `variant_label` VARCHAR(80) NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `unit_price` DECIMAL(10,2) NOT NULL,
  `image_url` VARCHAR(500) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_item_order` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Notification Logs
CREATE TABLE IF NOT EXISTS `notification_logs` (
  `id` VARCHAR(80) NOT NULL PRIMARY KEY,
  `order_id` VARCHAR(80) NULL,
  `order_number` VARCHAR(80) NULL,
  `channel` VARCHAR(40) NOT NULL, -- 'customer_email' | 'admin_email' | 'whatsapp'
  `recipient` VARCHAR(255) NOT NULL,
  `subject` VARCHAR(255) NULL,
  `status` VARCHAR(40) NOT NULL DEFAULT 'pending',
  `error_message` TEXT NULL,
  `payload` JSON NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_notif_order` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Consultations & Clinic Bookings
CREATE TABLE IF NOT EXISTS `bookings` (
  `id` VARCHAR(80) NOT NULL PRIMARY KEY,
  `reference` VARCHAR(80) NOT NULL UNIQUE,
  `customer_name` VARCHAR(160) NOT NULL,
  `phone` VARCHAR(40) NOT NULL,
  `email` VARCHAR(160) NULL,
  `consultation_type` VARCHAR(100) NOT NULL,
  `booking_date` DATE NOT NULL,
  `slot_time` VARCHAR(20) NOT NULL,
  `status` VARCHAR(40) NOT NULL DEFAULT 'pending',
  `payment_status` VARCHAR(40) NOT NULL DEFAULT 'pending',
  `fee` DECIMAL(10,2) NOT NULL DEFAULT 300.00,
  `notes` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_book_date` (`booking_date`),
  INDEX `idx_book_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Patient Enquiries
CREATE TABLE IF NOT EXISTS `enquiries` (
  `id` VARCHAR(80) NOT NULL PRIMARY KEY,
  `name` VARCHAR(160) NOT NULL,
  `phone` VARCHAR(40) NOT NULL,
  `email` VARCHAR(160) NULL,
  `health_concern` VARCHAR(255) NULL,
  `message` TEXT NOT NULL,
  `status` VARCHAR(40) NOT NULL DEFAULT 'new',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Reviews
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` VARCHAR(80) NOT NULL PRIMARY KEY,
  `product_id` VARCHAR(80) NULL,
  `customer_name` VARCHAR(160) NOT NULL,
  `rating` INT NOT NULL DEFAULT 5,
  `comment` TEXT NOT NULL,
  `status` VARCHAR(40) NOT NULL DEFAULT 'pending',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Discount Coupons
CREATE TABLE IF NOT EXISTS `coupons` (
  `id` VARCHAR(80) NOT NULL PRIMARY KEY,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `discount_type` VARCHAR(20) NOT NULL DEFAULT 'percent',
  `discount_value` DECIMAL(10,2) NOT NULL,
  `min_order_amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- INITIAL SEED: Site Settings & Master Order Sequence
-- =========================================================================
INSERT INTO `site_settings` (`key`, `value`)
VALUES
  ('business_details', '{
    "legal_name": "Vaidh Bharti - Panchsheel Aarogya Dhaam",
    "owner_name": "Vaidh Jitender Bharti",
    "address": "Barwala Road, Near Shree Ram ITI, Hansi, Haryana 125033",
    "phone": "+91 99964 15501",
    "email": "vaidbharti80@gmail.com",
    "gstin": "",
    "order_prefix": "VB",
    "invoice_prefix": "INV"
  }'),
  ('order_sequence', '{
    "next_order_number": 1001,
    "next_invoice_number": 1001,
    "year": 2026
  }'),
  ('shipping', '{
    "flat_rate": 60,
    "free_above": 999,
    "note": "Free delivery across India on orders above ₹999."
  }'),
  ('notification_settings', '{
    "admin_emails": ["vaidbharti80@gmail.com"],
    "whatsapp_phone": "+91 99964 15501",
    "notify_on_new_order": true,
    "notify_on_shipped": true,
    "cod_enabled": true,
    "online_enabled": true
  }')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`);

-- Categories
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `sort_order`)
VALUES
  ('cat-powder', 'Ayurvedic Powders', 'powders', 'Classical churnas formulated according to ancient texts', 1),
  ('cat-oils', 'Therapeutic Oils', 'oils', 'Medicated tailams for pain relief, joints and hair care', 2),
  ('cat-shilajit', 'Pure Shilajit', 'shilajit', 'Purified Himalayan mineral pitch for vitality', 3),
  ('cat-capsules', 'Herbal Capsules', 'capsules', 'Standardized extracts in vegetarian capsules', 4),
  ('cat-teas', 'Herbal Teas & Kadha', 'teas', 'Revitalizing daily wellness brews and decoctions', 5)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Coupons
INSERT INTO `coupons` (`id`, `code`, `discount_type`, `discount_value`, `min_order_amount`, `is_active`)
VALUES
  ('cp-1', 'AYURVEDA10', 'percent', 10.00, 499.00, 1),
  ('cp-2', 'FIRST50', 'fixed', 50.00, 399.00, 1)
ON DUPLICATE KEY UPDATE `code` = VALUES(`code`);

SET FOREIGN_KEY_CHECKS = 1;
