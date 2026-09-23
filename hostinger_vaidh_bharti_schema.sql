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


-- =========================================================================
-- INITIAL SEED: ALL 18 AYURVEDIC PRODUCTS & PACK VARIANTS
-- =========================================================================

INSERT INTO `products` (
  `id`, `name`, `slug`, `sku`, `short_description`, `description`, `benefits`,
  `ingredients`, `usage_instructions`, `price`, `mrp`, `stock`, `net_quantity`,
  `category_id`, `images`, `is_active`, `is_featured`, `is_best_seller`, `sort_order`
) VALUES
  ('prod-pit-shanti', 'Pit Shanti Powder', 'pit-shanti-powder', 'VB-001', 'Classical Ayurvedic churna for soothing hyperacidity, sour belching, heartburn, gas and cooling digestive comfort.', 'Pit Shanti Powder is a time-tested Ayurvedic formulation prepared under Vaidya supervision at Panchsheel Aarogya Dhaam. Fortified with Parwal Pishti, Kamdudha Ras and Sutsekhar Ras, it neutralizes excess stomach acid and pacifies aggravated Pitta dosha.', '[\"Soothing relief from acidity, acid reflux, heartburn and sour belching\",\"Deep cooling action on gastric mucosa and balances internal heat\",\"Contains Parwal Pishti, Kamdudha Ras, Sutsekhar Ras & Triphala\",\"100\% natural Ayurvedic formulation, non-habit forming\"]', 'Harad (5.0g), Baheda (5.0g), Amla (10.0g), Zeera (5.0g), Kala Namak (10.0g), Pipli (5.0g), Tez Pata (5.0g), Kali Mirch (5.0g), Sounth (5.0g), Loung (10.0g), Nisoth (10.0g), Mishri (10.0g), Parwal Pishti (5.0g), Kamdudha Ras (5.0g), Sutsekhar Ras (5.0g) per 100g.', 'Take 1 teaspoon (approx. 3g to 5g) with fresh water or milk twice daily after meals, or as directed by your physician.', 959, 1199, 50, '100 gm', 'cat-1', '[\"/assets/products/pit-shanti-powder-front.png\",\"/assets/products/pit-shanti-powder-back.png\",\"/assets/products/pit-shanti-powder-banner.png\"]', 1, 1, 1, 1),
  ('prod-luko-panch', 'Luko Panch Powder', 'luko-panch-powder', 'VB-002', 'Specialized classical Ayurvedic formulation for women\'s reproductive health, hormonal balance, and vitality.', 'Luko Panch Powder is formulated specifically for women\'s wellness in the sacred traditions of Ayurveda. Blended with potent astringent and rejuvenating herbs like Lodhra Pathani, Ashok Chaal, Mochras and Shatavari, it helps manage excessive vaginal discharge (Shweta Pradara), strengthens uterine tissues and relieves persistent fatigue.', '[\"Specially formulated for women\'s reproductive and hormonal wellness\",\"Helps alleviate excessive white discharge (Shweta Pradara) and fatigue\",\"Enriched with Lodhra Pathani, Ashok Chaal, Mochras and Shatavari\",\"Strengthens pelvic floor and promotes general vitality\"]', 'Majufal (5g), Nagkeshar (5g), Singhara (5g), Gond Chuniya (10g), Lodh Pathani (10g), Sangaj Rahal (10g), Mochras (10g), Mai (5g), Talmakhana (5g), Lajwanti (5g), Shatavari (5g), Ashwagandha (5g), Ashok Chaal (5g), Chikni Supari (5g), Pradrantak Lauh (5g).', 'Take 1 teaspoon (3g–5g) twice daily with warm milk or water after meals, or as advised by your Ayurvedic physician.', 799, 999, 45, '100 gm', 'cat-1', '[\"/assets/products/luko-panch-powder-front.png\",\"/assets/products/luko-panch-powder-back.png\",\"/assets/products/luko-panch-powder-banner.png\"]', 1, 1, 1, 2),
  ('prod-panch-liv', 'Panch Liv Powder', 'panch-liv-powder', 'VB-003', 'Targeted Ayurvedic Yakrit-Pliha churna for liver detox, enzyme stimulation, and sluggish digestion.', 'Panch Liv Powder is a restorative Ayurvedic compound engineered to protect hepatic cells and restore balanced bile secretion. Combining potent hepatoprotective herbs like Kalmegh, Bhumi Amla, Giloy and Mandur Bhasma, it aids natural liver detoxification and strengthens metabolic assimilation.', '[\"Supports hepatic enzyme balance and healthy bile flow\",\"Assists liver detox and revitalizes sluggish digestion\",\"Contains Kalmegh, Bhumi Amla, Giloy, Kasni and Mandur Bhasma\",\"Enhances nutrient absorption and natural appetite\"]', 'Punarnava (320mg), Bhumi Amla (320mg), Pitta Papda (320mg), Harad (320mg), Baheda (320mg), Amla (320mg), Bhringraj (200mg), Kasni (640mg), Chitrak (320mg), Rohida (640mg), Giloy (320mg), Kalmegh (320mg), Mandur Bhasma (640mg) per 5g.', 'Take 1/2 to 1 teaspoon (approx. 3g) with lukewarm water twice daily before meals.', 749, 999, 50, '100 gm', 'cat-1', '[\"/assets/products/panch-liv-powder-front.png\",\"/assets/products/panch-liv-powder-back.png\",\"/assets/products/panch-liv-powder-banner.png\"]', 1, 0, 0, 3),
  ('prod-nabhi-oil', 'Nabhi Oil', 'nabhi-oil', 'VB-004', 'Pure Ayurvedic belly button wellness oil infused with Almond, Neem, Castor, Bhringraj and Clove.', 'Nabhi Oil harnesses the ancient science of Pechoti method (Nabhi Chikitsa). The navel connects over 72,000 subtle energy channels (Nadis). Applying this classical herbal infusion before sleep deeply nourishes bodily tissues, improves digestive fire (Jatharagni), and enhances facial radiance.', '[\"Rooted in ancient Pechoti chakra nourishing method\",\"Balances Agni and relieves bloating, constipation & abdominal tension\",\"Infused with Almond, Castor, Neem, Bhringraj, Clove & Tea Tree oils\",\"Enhances natural skin luminosity and lip softness\"]', 'Til Taila (Sesame Oil), Badam Taila (Almond Oil), Erand Taila (Castor Oil), Neem Taila, Bhringraj, Lavang (Clove), Camphor, Tea Tree Oil.', 'Warm 2 to 3 drops slightly, gently pour into navel at bedtime, and massage in a circular motion for 1–2 minutes.', 500, 999, 60, '30 ml', 'cat-2', '[\"/assets/products/nabhi-oil-front.png\",\"/assets/products/nabhi-oil-back.png\",\"/assets/products/nabhi-oil-banner.png\"]', 1, 1, 1, 4),
  ('prod-panch-vat', 'Panch Vat Powder', 'panch-vat-powder', 'VB-005', 'Classical Sandhivata churna for joint mobility, stiffness, swelling and soothing aggravated Vata.', 'Panch Vat Powder is formulated according to classical Sandhivata Chikitsa principles. Enriched with anti-inflammatory herbs such as Shallaki, Rasna, Ashwagandha, Yograj Guggulu and Suranjan, it soothes swollen articular joints, enhances lubrication, and relieves morning stiffness.', '[\"Relieves morning joint stiffness and knee discomfort\",\"Pacifies deep-seated aggravated Vata in articular capsules\",\"Contains Shallaki, Rasna, Ashwagandha, Suranjan and Shuddha Guggulu\",\"Promotes natural synovial joint mobility and flexibility\"]', 'Shallaki (10g), Rasna (10g), Ashwagandha (10g), Suranjan (5g), Nirgundi (5g), Devdaru (5g), Shunthi (5g), Yograj Guggulu (20g), Maharasnadi Kwath extract.', 'Take 1 teaspoon (3g–5g) twice daily with lukewarm milk or water after meals.', 1124, 1499, 45, '100 gm', 'cat-1', '[\"/assets/products/panch-vat-powder-front.png\",\"/assets/products/panch-vat-powder-back.png\",\"/assets/products/panch-vat-powder-banner.png\"]', 1, 1, 0, 5),
  ('prod-fat-panch', 'Fat Panch Powder', 'fat-panch-powder', 'VB-006', 'Natural Ayurvedic Medohar churna for healthy weight management, lipid balance, and Agni support.', 'Fat Panch Powder is an authentic Ayurvedic Medohar preparation formulated under strict classical standards. Combining Medohar Vidangadi, Arogyavardhini Vati, Shuddha Guggulu, Punarnava and Triphala, it enhances basal metabolism, eliminates toxic Ama, and promotes healthy body composition without synthetic stimulants.', '[\"Supports natural fat metabolism and digestion of accumulated Ama\",\"Promotes healthy weight management without synthetic stimulants\",\"Combines Shuddha Guggulu, Medohar Vidangadi & Arogyavardhini Vati\",\"Helps clear lymphatic and circulatory channels\"]', 'Punarnava (5g), Nagarmotha (5g), Chitrakmool (5g), Vaividang (5g), Harad (5g), Baheda (5g), Amla (5g), Pippali (5g), Sonth (5g), Shuddha Guggulu (20g), Medohar Vidangadi (10g), Arogyavardhini Vati (10g), Kali Mirch (5g), Shwet Jeerak (5g), Dalchini (5g).', 'Take 3g to 5g twice daily with lukewarm water 30 minutes before meals, or as advised by Vaidh Bharti.', 1199, 1499, 50, '100 gm', 'cat-1', '[\"/assets/products/fat-panch-powder-front.png\",\"/assets/products/fat-panch-powder-back.png\",\"/assets/products/fat-panch-powder-banner.png\"]', 1, 1, 1, 6),
  ('prod-shahi-panch-powder', 'Shahi Panch Powder', 'shahi-panch-powder', 'VB-007', 'Classical Ayurvedic Rasayana churna fortified with Kesar, Makardhwaj and Swarna Bhasma for peak vitality and vigor.', 'Shahi Panch Powder is a prestigious classical Ayurvedic Rasayana formulation crafted at Panchsheel Aarogya Dhaam. Infused with Swarna Bhasma (Gold Calx), Kesar (Saffron), Makardhwaj, Ashwagandha and Safed Musli, it delivers supreme cellular nourishment (Rasadi Dhatus), enhances stamina, and revitalizes natural inner strength.', '[\"Fortified with Kesar (Saffron), Makardhwaj and Swarna Bhasma\",\"Deeply nourishes all 7 Dhatus to rebuild stamina and vitality\",\"Combats chronic fatigue, nervous exhaustion and physical burnout\",\"100\% authentic Ayurvedic Rasayana medicine\"]', 'Swarna Bhasma, Kesar (Crocus sativus), Makardhwaj, Ashwagandha, Safed Musli, Kaunch Beej, Gokshura, Akarkara, Jaiphal, Javitri, Vang Bhasma, Shuddha Shilajit per 100g.', 'Take 2 to 3 gm daily with warm milk or as directed by the physician. Best taken before bedtime.', 1499, 1999, 40, '100 gm', 'cat-1', '[\"/assets/products/shahi-panch-powder-front.png\",\"/assets/products/shahi-panch-powder-back.png\",\"/assets/products/shahi-panch-powder-banner.png\"]', 1, 1, 1, 7),
  ('prod-shilajit', 'Shilajit', 'shilajit', 'VB-008', '100\% Authentic Purified Himalayan Suryatapi Shilajit Resin for stamina, vitality, and cellular rejuvenation.', 'Sourced from the pristine high-altitude rocks of the Himalayas and purified using the classical Suryatapi (sun-curing) method. Vaidh Bharti Shilajit contains over 80\% Fulvic Acid and 84+ ionic trace minerals, offering deep rejuvenation (Rasayana) and peak physical endurance.', '[\"Purified Himalayan Suryatapi Grade-A Shilajit resin\",\"Naturally rich in >80\% Fulvic Acid and 84+ essential trace minerals\",\"Boosts stamina, athletic endurance and cellular rejuvenation\",\"Tested for heavy metals and purity\"]', '100\% Purified Himalayan Shilajit (Asphaltum punjabianum) Resin.', 'Dissolve a pea-sized portion (300mg–500mg) in warm milk or water once daily in the morning.', 799, 999, 40, '20 g', 'cat-3', '[\"/assets/products/shilajit-front.png\",\"/assets/products/shilajit-banner.png\"]', 1, 1, 1, 8),
  ('prod-red-onion', 'Red Onion Hair Oil', 'red-onion-hair-oil', 'VB-009', 'Non-sticky classical Ayurvedic hair elixir with Red Onion, Bhringraj, Brahmi and Almond Oil for hair strength.', 'Vaidh Bharti Red Onion Hair Oil is a potent herbal blend formulated in cold-pressed Sesame and Coconut base. Powered by Allium Cepa (Red Onion), Bhringraj, Brahmi, Methi and Amla, it revitalizes dormant follicles, controls excess hair fall, and restores deep shine without sticky heaviness.', '[\"Strengthens hair roots and curbs excessive shedding\",\"Rich in sulfur from Red Onion extract to support natural keratin\",\"Infused with classical Keshya herbs: Bhringraj, Brahmi & Amla\",\"Lightweight, non-sticky and non-greasy absorption\"]', 'Red Onion (Allium Cepa) extract, Bhringraj, Brahmi, Amla, Methi, Shikakai, Til Taila (Sesame Oil), Coconut Oil, Almond Oil, Vitamin E.', 'Gently massage into hair roots and scalp with fingertips. Leave on for at least 1 hour or overnight before washing.', 359, 599, 60, '200 ml', 'cat-2', '[\"/assets/products/red-onion-hair-oil-front.png\",\"/assets/products/red-onion-hair-oil-back.png\",\"/assets/products/red-onion-hair-oil-banner.png\"]', 1, 1, 0, 9),
  ('prod-panch-fresh', 'Panch Fresh Powder', 'panch-fresh-powder', 'VB-010', 'Gentle yet potent Ayurvedic Virechana churna for chronic constipation, bowel regularity, and gas relief.', 'Panch Fresh Powder is a time-tested Ayurvedic colon-cleansing formula. Expertly crafted with Sanay Patti, Haritaki, Saunf, Ajwain, Sendha Namak and Nishoth, it stimulates peristalsis without causing cramps, colic pain, or dependency.', '[\"Effective overnight relief from chronic constipation and sluggish bowels\",\"Promotes comfortable morning evacuation without cramps or strain\",\"Relieves abdominal bloating, gas, and heaviness\",\"Enriched with Sanay Patti, Haritaki, Saunf, Ajwain and Sendha Namak\"]', 'Sanay Patti (Senna leaves), Haritaki (Harad), Saunf, Ajwain, Sendha Namak (Rock salt), Nishoth, Baheda, Amla, Mulethi.', 'Take 1/2 to 1 teaspoon (approx. 3g–5g) with a glass of lukewarm water at bedtime, or as advised by physician.', 269, 299, 50, '100 gm', 'cat-1', '[\"/assets/products/panch-fresh-powder-front.png\",\"/assets/products/panch-fresh-powder-back.png\",\"/assets/products/panch-fresh-powder-banner.png\"]', 1, 0, 0, 10),
  ('prod-shahi-panch-24x7', 'Shahi Panch 24x7', 'shahi-panch-24x7', 'VB-011', 'Daily classical Ayurvedic Rasayana capsules for round-the-clock energy, stamina, and stress resilience.', 'Shahi Panch 24x7 Capsules are scientifically formulated for active lifestyles. Powered by pure Ashwagandha, Shilajit, Safed Musli and essential micro-minerals, it maintains sustained vitality, supports adrenal function, and reduces daily physical and mental exhaustion.', '[\"Provides 24x7 sustained energy and stamina support\",\"Contains purified Shilajit, Ashwagandha and Safed Musli\",\"Supports stress recovery and combats routine mental fatigue\",\"Convenient travel-friendly blister pack (30 capsules)\"]', 'Shuddha Shilajit, Ashwagandha, Safed Musli, Kaunch Beej, Gokshura, Shatavari, Vidarikand, Akarkara, Yashad Bhasma.', 'Take 1 capsule twice daily with warm water or milk after meals, or as directed by your physician.', 674, 899, 40, '30 Capsules', 'cat-4', '[\"/assets/products/shahi-panch-gold-front.png\",\"/assets/products/shahi-panch-gold-banner.png\"]', 1, 0, 0, 11),
  ('prod-vatt-tea', 'Vatt Tea', 'vatt-tea', 'VB-012', 'Classical Ayurvedic Vata-balancing herbal tea for calming nervous restlessness, stiff joints, and erratic digestion.', 'According to Ayurveda, imbalance of Vata dosha is responsible for 80 distinct disorders including constipation, anxiety, restlessness of mind, and joint pains. Vatt Tea is formulated with Rasna, Ashwagandha, Sunthi, Shankhpushpi, Bala, and Elaichi to gently warm the system, ground the nervous energy, and promote peaceful digestion.', '[\"Pacifies aggravated Vata dosha and calms nervous tension\",\"Soothes joint stiffness, body aches and muscular spasms\",\"Promotes smooth digestion and relieves erratic bowel movement\",\"Caffeine-free therapeutic herbal infusion with Rasna & Ashwagandha\"]', 'Pluchea lanceolata (Rasna), Terminalia arjuna, Piper longum (Pippali), Withania somnifera (Ashwagandha), Zingiber officinale (Sunthi), Sida cordifolia (Bala), Centella asiatica (Brahmi), Convolvulus pluricaulis (Shankhpushpi), Cinnamomum tamala (Tejpatta), Elettaria cardamomum (Elaichi), Syzygium aromaticum (Lavanga).', 'Boil 1/2 to 1 teaspoon (approx 3g) in 150-200ml water for 3-5 minutes until reduced. Strain and drink warm. Honey or a splash of warm milk may be added to taste. Take twice daily in morning and evening.', 368, 460, 50, '100 gm', 'cat-5', '[\"/assets/products/vatt-tea-front.png\",\"/assets/products/vatt-tea-back.png\",\"/assets/products/vatt-tea-banner.png\"]', 1, 1, 0, 12),
  ('prod-uder-shaant', 'Uder Shaant Powder', 'uder-shaant-powder', 'VB-013', 'Classical Grahani & IBS churna for soothing hyperactive bowels, frequent loose stools, and abdominal cramps.', 'Uder Shaant Powder is specially formulated for individuals struggling with frequent bowel urgency, loose stool frequency, irritable bowel symptoms (Sangrahani), and lower abdominal cramping. Crafted with potent intestinal astringents and digestive balancers like Bilva, Kutaj, Mustak, Dadim and Mochras, it restores normal stool consistency and calms intestinal inflammation.', '[\"Specially formulated for frequent toilet urgency and chronic loose bowels\",\"Calms intestinal inflammation, bowel cramping and Sangrahani / IBS\",\"Fortified with Kutaj, Bilva, Mustak and Dadim skin\",\"Restores healthy intestinal mucosal barrier and digestive peace\"]', 'Kutaj Chaal, Bilva Giri (Bael fruit), Mustak (Nagarmotha), Mochras, Dadim Twak, Ativisha, Lodhra, Shunthi, Dhanyak, Jeerak per 100g.', 'Take 5 gm powder twice daily with lassi (buttermilk) or fresh curd after meals in morning and evening. Avoid oily, spicy, refined flour and stale foods during use.', 1039, 1299, 50, '100 gm', 'cat-1', '[\"/assets/products/uder-shaant-powder-front.png\",\"/assets/products/uder-shaant-powder-back.png\",\"/assets/products/uder-shaant-powder-banner.png\"]', 1, 1, 0, 13),
  ('prod-shahi-panch-gold-extra', 'Shahi Panch Gold Extra', 'shahi-panch-gold-extra', 'VB-014', 'Premium Ayurvedic Rasayana & Vajikarana capsules fortified with Swarna Bhasma, Shilajit & Ashwagandha for elite vigor.', 'Shahi Panch Gold Extra is the pinnacle classical Ayurvedic Rasayana and Vajikarana preparation in a premium 60-capsule pack. Formulated with Swarna Bhasma (Gold Calx), Shuddha Shilajit, Kesar, Ashwagandha, Safed Musli and Vang Bhasma, it replenishes depleted Ojas, enhances physical endurance, and restores youthfulness.', '[\"Premium Rasayana & Vajikarana formulation in 60-capsule pack\",\"Enriched with Swarna Bhasma, Shilajit, Ashwagandha and Kesar\",\"Promotes stamina, muscular endurance and rapid post-workout recovery\",\"Supports peak vitality and reproductive wellness\"]', 'Swarna Bhasma, Shuddha Shilajit, Ashwagandha, Safed Musli, Kaunch Beej, Gokshura, Akarkara, Jaiphal, Kesar, Vang Bhasma.', 'Take 1 capsule twice daily with warm milk or as directed by your Ayurvedic physician.', 1124, 1499, 40, '60 Capsules', 'cat-4', '[\"/assets/products/shahi-panch-gold-front.png\",\"/assets/products/shahi-panch-gold-banner.png\"]', 1, 1, 1, 14),
  ('prod-arshopanch', 'Arshopanch Powder', 'arshopanch-powder', 'VB-015', 'Targeted classical Ayurvedic Arshohara churna providing soothing relief from piles, fissures, and fistula discomfort.', 'Arshopanch Powder is a specialized Ayurvedic proprietary medicine developed to treat both bleeding and non-bleeding hemorrhoids (Arsha), anal fissures (Parikartika), and fistulae (Bhagandara). Enriched with Suran (Jimikand), Nagkeshar, Neem Beej, Haritaki and Triphala Guggulu, it shrinks swollen venous piles mass, stops bleeding, and softens stools to eliminate straining.', '[\"Relieves pain, swelling, burning and bleeding associated with piles and fissures\",\"Promotes natural shrinkage of hemorrhoidal pile masses\",\"Encourages smooth, strain-free morning bowel evacuation\",\"Contains Suran, Nagkeshar, Neem Beej, Haritaki and Guggulu\"]', 'Suran Kand (Amorphophallus campanulatus), Nagkeshar, Neem Beej, Bakayan Beej, Haritaki, Nishoth, Shuddha Guggulu, Rasont, Daruharidra, Chitrak.', 'Take 5 gm powder twice daily after meals with lassi (buttermilk) or curd in the morning and evening. Avoid garam masala, fried foods, pickles, red chilli, and stale food.', 959, 1199, 50, '100 gm', 'cat-1', '[\"/assets/products/arshopanch-powder-front.png\",\"/assets/products/arshopanch-powder-back.png\",\"/assets/products/arshopanch-powder-banner.png\"]', 1, 1, 0, 15),
  ('prod-pitt-tea', 'Pitt Tea', 'pitt-tea', 'VB-016', 'Cooling Ayurvedic Pitta-balancing herbal tea for soothing hyperacidity, internal body heat, and fiery skin flare-ups.', 'Pitt Tea (पित्त चाय) is an authentic cooling herbal brew formulated for individuals with aggravated Pitta dosha. Featuring botanical refrigerants like Giloy, Saunf, Dhaniya, Amla, Shankhpushpi, Brahmi, and Gulab, it cools internal thermal excess, eases sour belching and heartburn, and promotes a serene, balanced mind.', '[\"Pacifies aggravated Pitta dosha and reduces internal metabolic heat\",\"Relieves acidity, heartburn, sour throat and hot sensations in palms/soles\",\"Enriched with Giloy, Saunf, Dhaniya, Amla, Shankhpushpi & Gulab\",\"Refreshes and clears the complexion from heat-induced flare-ups\"]', 'Tinospora cordifolia (Giloy, 15g), Foeniculum vulgare (Saunf, 15g), Emblica officinalis (Amla, 10g), Rosa centifolia (Gulab, 10g), Coriandrum sativum (Dhaniya, 10g), Convolvulus pluricaulis (Shankhpushpi, 10g), Centella asiatica (Brahmi, 10g), Tribulus terrestris (Gokshura, 5g), Adhatoda vasica (Vasa, 5g), Glycyrrhiza glabra (Mulethi, 5g), Elettaria cardamomum (Elaichi, 2.5g), Syzygium aromaticum (Lavanga, 2.5g) per 100g.', 'Take 1 spoon of tea and mix with 200ml water. Boil until the quantity reduces to half. Strain and drink lukewarm. Honey or a little warm milk may be added to taste. Take twice daily in morning and evening.', 368, 460, 50, '100 gm', 'cat-5', '[\"/assets/products/pitt-tea-front.png\",\"/assets/products/pitt-tea-back.png\",\"/assets/products/pitt-tea-banner.png\"]', 1, 0, 0, 16),
  ('prod-arogya-tea', 'Arogya Tea', 'arogya-tea', 'VB-017', 'Everyday Ayurvedic wellness & Tridosha rejuvenation herbal tea with Arjuna, Mulethi, Tulsi and Brahmi for vitality.', 'Arogya Tea is a master herbal formulation designed for daily holistic health, hormonal balance, and deep cellular detoxification. Blended with 19 sacred botanicals including Terminalia arjuna (heart tonic), Mulethi, Haldi, Brahmi, Tulsi, and Anantmool, it strengthens natural immunity, aids cardiovascular rhythm, and uplifts daily spirit.', '[\"Tridosha balancing blend for daily vitality and disease prevention\",\"Cardiovascular and micro-circulatory support with Terminalia arjuna (25g)\",\"Balances hormones and supports calm mental clarity with Brahmi & Tulsi\",\"Antioxidant-rich herbal blend with Haldi, Sunthi, Amla & Mulethi\"]', 'Terminalia arjuna (25g), Glycyrrhiza glabra [Mulethi] (10g), Foeniculum vulgare [Saunf] (8g), Zingiber officinale [Sunthi] (7g), Curcuma longa [Haldi] (6g), Cinnamomum tamala [Tejpatta] (6g), Sida cordifolia [Bala] (5g), Bacopa monnieri [Brahmi] (5g), Cinnamomum zeylanicum [Dalchini] (4g), Hemidesmus indicus [Anantmool] (4g), Emblica officinalis [Amla] (4g), Ocimum sanctum [Tulsi] (3g), Piper nigrum [Kali Mirch] (3g), Rosa centifolia [Gulab] (2g), Piper longum [Pippali] (2g), Alpinia galanga [Kulanjan] (2g), Elettaria cardamomum [Elaichi] (2g), Piper cubeba (1g), Syzygium aromaticum (1g) per 100g.', 'Add a pinch (approx 2-3g) of Arogya Tea to boiling water (150-200ml). Let it steep for 5-7 minutes. Strain and enjoy warm twice daily in the morning and evening.', 368, 460, 50, '100 gm', 'cat-5', '[\"/assets/products/arogya-tea-front.png\",\"/assets/products/arogya-tea-back.png\",\"/assets/products/arogya-tea-banner.png\"]', 1, 1, 1, 17),
  ('prod-kapha-tea', 'Kapha Tea', 'kapha-tea', 'VB-018', 'Invigorating Ayurvedic Kapha-clearing herbal tea for respiratory clarity, sluggish metabolism, and excess congestion.', 'Kapha Tea (कफ चाय) is an invigorating herbal brew designed to clear deep-seated mucus, stimulate sluggish metabolism, and disperse lethargy. Featuring classical Trikatu herbs (Sunthi, Pippali, Kali Mirch) combined with Baheda, Amla, Mulethi, Dalchini, and Lavanga, it expands the bronchial passages, aids digestion of heavy meals, and warms cold tissues.', '[\"Clears heavy congestion from throat, chest, and nasal passages\",\"Kindles sluggish digestive fire (Manda Agni) and accelerates metabolism\",\"Formulated with Trikatu (Pippali, Sunthi, Kali Mirch), Baheda & Mulethi\",\"Dispels morning lethargy and heaviness without caffeine crashes\"]', 'Zingiber officinalis [Sunthi] (15g), Piper longum [Pippali] (15g), Terminalia belirica [Baheda] (15g), Emblica officinalis [Amla] (10g), Rosa cordifolia [Manjistha/Gulab] (10g), Syzygium aromaticum [Lavanga] (10g), Piper nigrum [Kali Mirch] (5g), Glycyrrhiza glabra [Mulethi] (5g), Cinnamomum tamala [Tejpatta] (5g), Cinnamomum zeylanicum [Dalchini] (5g), Elettaria cardamomum [Elaichi] (2.5g) per 100g.', 'Take 1 spoon of tea and mix with 200ml water. Boil until the quantity reduces to half. Strain and drink lukewarm. Honey or a little warm milk may be added to taste. Take twice daily in morning and evening.', 368, 460, 50, '100 gm', 'cat-5', '[\"/assets/products/kapha-tea-front.png\",\"/assets/products/kapha-tea-back.png\",\"/assets/products/kapha-tea-banner.png\"]', 1, 0, 0, 18)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `price` = VALUES(`price`), `mrp` = VALUES(`mrp`), `stock` = VALUES(`stock`), `images` = VALUES(`images`), `description` = VALUES(`description`);

INSERT INTO `product_variants` (
  `id`, `product_id`, `label`, `price`, `mrp`, `stock`, `sort_order`
) VALUES
  ('var-pit', 'prod-pit-shanti', '100 gm', 959, 1199, 50, 1),
  ('var-luko', 'prod-luko-panch', '100 gm', 799, 999, 45, 1),
  ('var-liv', 'prod-panch-liv', '100 gm', 749, 999, 50, 1),
  ('var-nabhi', 'prod-nabhi-oil', '30 ml', 500, 999, 60, 1),
  ('var-vat', 'prod-panch-vat', '100 gm', 1124, 1499, 45, 1),
  ('var-fat', 'prod-fat-panch', '100 gm', 1199, 1499, 50, 1),
  ('var-shahi-pow', 'prod-shahi-panch-powder', '100 gm', 1499, 1999, 40, 1),
  ('var-shilajit', 'prod-shilajit', '20 g', 799, 999, 40, 1),
  ('var-onion', 'prod-red-onion', '200 ml', 359, 599, 60, 1),
  ('var-fresh', 'prod-panch-fresh', '100 gm', 269, 299, 50, 1),
  ('var-shahi-24x7', 'prod-shahi-panch-24x7', '30 Capsules', 674, 899, 40, 1),
  ('var-vatt-tea', 'prod-vatt-tea', '100 gm', 368, 460, 50, 1),
  ('var-uder', 'prod-uder-shaant', '100 gm', 1039, 1299, 50, 1),
  ('var-shahi-gold', 'prod-shahi-panch-gold-extra', '60 Capsules', 1124, 1499, 40, 1),
  ('var-arsho', 'prod-arshopanch', '100 gm', 959, 1199, 50, 1),
  ('var-pitt-tea', 'prod-pitt-tea', '100 gm', 368, 460, 50, 1),
  ('var-arogya-tea', 'prod-arogya-tea', '100 gm', 368, 460, 50, 1),
  ('var-kapha-tea', 'prod-kapha-tea', '100 gm', 368, 460, 50, 1)
ON DUPLICATE KEY UPDATE `price` = VALUES(`price`), `mrp` = VALUES(`mrp`), `stock` = VALUES(`stock`);

SET FOREIGN_KEY_CHECKS = 1;
