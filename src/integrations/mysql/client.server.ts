import mysql from "mysql2/promise";

const DB_HOST = process.env["DB_HOST"] || process.env["MYSQL_HOST"] || "localhost";
const DB_USER = process.env["DB_USER"] || process.env["MYSQL_USER"] || "u931854669_vaidbharti";
const DB_PASSWORD = process.env["DB_PASSWORD"] || process.env["MYSQL_PASSWORD"] || "VaidhBharti@2026";
const DB_NAME = process.env["DB_NAME"] || process.env["MYSQL_DATABASE"] || "u931854669_vaidbharti";
const DB_PORT = Number(process.env["DB_PORT"] || process.env["MYSQL_PORT"] || 3306);

let pool: mysql.Pool | null = null;

export function getDbPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      port: DB_PORT,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
    });
  }
  return pool;
}

export async function testDbConnection(): Promise<{ ok: boolean; message: string; host: string; database: string }> {
  try {
    const p = getDbPool();
    const [rows] = await p.query("SELECT 1 AS connected");
    return {
      ok: true,
      message: `Connected successfully to Hostinger MySQL Database [${DB_NAME}] on ${DB_HOST}.`,
      host: DB_HOST,
      database: DB_NAME,
    };
  } catch (err: any) {
    console.error("[Hostinger MySQL] Connection error:", err.message);
    return {
      ok: false,
      message: err.message || "Failed to connect to database.",
      host: DB_HOST,
      database: DB_NAME,
    };
  }
}

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const p = getDbPool();
  const [rows] = await p.query(sql, params);
  return rows as T[];
}

export async function queryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] || null;
}

export async function execute(sql: string, params: any[] = []): Promise<mysql.ResultSetHeader> {
  const p = getDbPool();
  const [result] = await p.execute(sql, params);
  return result as mysql.ResultSetHeader;
}

export async function runSchemaMigration(): Promise<{ success: boolean; executed: number; error?: string }> {
  const statements = [
    `CREATE TABLE IF NOT EXISTS \`site_settings\` (
      \`key\` VARCHAR(80) NOT NULL PRIMARY KEY,
      \`value\` JSON NOT NULL,
      \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    `CREATE TABLE IF NOT EXISTS \`categories\` (
      \`id\` VARCHAR(80) NOT NULL PRIMARY KEY,
      \`name\` VARCHAR(120) NOT NULL,
      \`slug\` VARCHAR(120) NOT NULL UNIQUE,
      \`description\` TEXT NULL,
      \`image_url\` VARCHAR(500) NULL,
      \`sort_order\` INT NOT NULL DEFAULT 0,
      \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    `CREATE TABLE IF NOT EXISTS \`products\` (
      \`id\` VARCHAR(80) NOT NULL PRIMARY KEY,
      \`name\` VARCHAR(255) NOT NULL,
      \`slug\` VARCHAR(255) NOT NULL UNIQUE,
      \`sku\` VARCHAR(80) NULL,
      \`short_description\` TEXT NULL,
      \`description\` LONGTEXT NULL,
      \`benefits\` JSON NULL,
      \`ingredients\` TEXT NULL,
      \`usage_instructions\` TEXT NULL,
      \`price\` DECIMAL(10,2) NULL,
      \`mrp\` DECIMAL(10,2) NULL,
      \`stock\` INT NOT NULL DEFAULT 100,
      \`net_quantity\` VARCHAR(80) NULL,
      \`category_id\` VARCHAR(80) NULL,
      \`images\` JSON NULL,
      \`is_active\` TINYINT(1) NOT NULL DEFAULT 1,
      \`is_featured\` TINYINT(1) NOT NULL DEFAULT 0,
      \`is_best_seller\` TINYINT(1) NOT NULL DEFAULT 0,
      \`sort_order\` INT NOT NULL DEFAULT 0,
      \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX \`idx_prod_slug\` (\`slug\`),
      INDEX \`idx_prod_sku\` (\`sku\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    `CREATE TABLE IF NOT EXISTS \`product_variants\` (
      \`id\` VARCHAR(80) NOT NULL PRIMARY KEY,
      \`product_id\` VARCHAR(80) NOT NULL,
      \`label\` VARCHAR(80) NOT NULL,
      \`price\` DECIMAL(10,2) NOT NULL,
      \`mrp\` DECIMAL(10,2) NULL,
      \`stock\` INT NOT NULL DEFAULT 50,
      \`sort_order\` INT NOT NULL DEFAULT 0,
      \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX \`idx_var_prod\` (\`product_id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    `CREATE TABLE IF NOT EXISTS \`orders\` (
      \`id\` VARCHAR(80) NOT NULL PRIMARY KEY,
      \`order_number\` VARCHAR(80) NOT NULL UNIQUE,
      \`invoice_number\` VARCHAR(80) NULL UNIQUE,
      \`invoice_date\` DATETIME NULL,
      \`customer_name\` VARCHAR(160) NOT NULL,
      \`phone\` VARCHAR(40) NOT NULL,
      \`email\` VARCHAR(160) NULL,
      \`address_line1\` VARCHAR(255) NOT NULL,
      \`address_line2\` VARCHAR(255) NULL,
      \`city\` VARCHAR(100) NOT NULL,
      \`state\` VARCHAR(100) NOT NULL,
      \`pincode\` VARCHAR(20) NOT NULL,
      \`payment_method\` VARCHAR(40) NOT NULL,
      \`payment_status\` VARCHAR(40) NOT NULL DEFAULT 'pending',
      \`payment_gateway_order_id\` VARCHAR(100) NULL,
      \`payment_gateway_payment_id\` VARCHAR(100) NULL,
      \`payment_gateway_payload\` JSON NULL,
      \`status\` VARCHAR(40) NOT NULL DEFAULT 'pending',
      \`subtotal\` DECIMAL(10,2) NOT NULL,
      \`discount_amount\` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
      \`shipping_amount\` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
      \`tax_amount\` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
      \`total\` DECIMAL(10,2) NOT NULL,
      \`coupon_code\` VARCHAR(50) NULL,
      \`courier\` VARCHAR(100) NULL,
      \`tracking_number\` VARCHAR(100) NULL,
      \`notes\` TEXT NULL,
      \`audit_log\` JSON NULL,
      \`cancelled_reason\` TEXT NULL,
      \`refund_reference\` VARCHAR(100) NULL,
      \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX \`idx_order_num\` (\`order_number\`),
      INDEX \`idx_order_inv\` (\`invoice_number\`),
      INDEX \`idx_order_status\` (\`status\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    `CREATE TABLE IF NOT EXISTS \`order_items\` (
      \`id\` VARCHAR(80) NOT NULL PRIMARY KEY,
      \`order_id\` VARCHAR(80) NOT NULL,
      \`product_id\` VARCHAR(80) NULL,
      \`product_name\` VARCHAR(255) NOT NULL,
      \`variant_label\` VARCHAR(80) NULL,
      \`quantity\` INT NOT NULL DEFAULT 1,
      \`unit_price\` DECIMAL(10,2) NOT NULL,
      \`image_url\` VARCHAR(500) NULL,
      \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX \`idx_item_order\` (\`order_id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    `CREATE TABLE IF NOT EXISTS \`notification_logs\` (
      \`id\` VARCHAR(80) NOT NULL PRIMARY KEY,
      \`order_id\` VARCHAR(80) NULL,
      \`order_number\` VARCHAR(80) NULL,
      \`channel\` VARCHAR(40) NOT NULL,
      \`recipient\` VARCHAR(255) NOT NULL,
      \`subject\` VARCHAR(255) NULL,
      \`status\` VARCHAR(40) NOT NULL DEFAULT 'pending',
      \`error_message\` TEXT NULL,
      \`payload\` JSON NULL,
      \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX \`idx_notif_order\` (\`order_id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    `CREATE TABLE IF NOT EXISTS \`bookings\` (
      \`id\` VARCHAR(80) NOT NULL PRIMARY KEY,
      \`reference\` VARCHAR(80) NOT NULL UNIQUE,
      \`customer_name\` VARCHAR(160) NOT NULL,
      \`phone\` VARCHAR(40) NOT NULL,
      \`email\` VARCHAR(160) NULL,
      \`consultation_type\` VARCHAR(100) NOT NULL,
      \`booking_date\` DATE NOT NULL,
      \`slot_time\` VARCHAR(20) NOT NULL,
      \`status\` VARCHAR(40) NOT NULL DEFAULT 'pending',
      \`payment_status\` VARCHAR(40) NOT NULL DEFAULT 'pending',
      \`fee\` DECIMAL(10,2) NOT NULL DEFAULT 300.00,
      \`notes\` TEXT NULL,
      \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX \`idx_book_date\` (\`booking_date\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    `CREATE TABLE IF NOT EXISTS \`enquiries\` (
      \`id\` VARCHAR(80) NOT NULL PRIMARY KEY,
      \`name\` VARCHAR(160) NOT NULL,
      \`phone\` VARCHAR(40) NOT NULL,
      \`email\` VARCHAR(160) NULL,
      \`health_concern\` VARCHAR(255) NULL,
      \`message\` TEXT NOT NULL,
      \`status\` VARCHAR(40) NOT NULL DEFAULT 'new',
      \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    `CREATE TABLE IF NOT EXISTS \`coupons\` (
      \`id\` VARCHAR(80) NOT NULL PRIMARY KEY,
      \`code\` VARCHAR(50) NOT NULL UNIQUE,
      \`discount_type\` VARCHAR(20) NOT NULL DEFAULT 'percent',
      \`discount_value\` DECIMAL(10,2) NOT NULL,
      \`min_order_amount\` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
      \`is_active\` TINYINT(1) NOT NULL DEFAULT 1,
      \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  ];

  const p = getDbPool();
  let count = 0;
  for (const sql of statements) {
    try {
      await p.execute(sql);
      count++;
    } catch (e: any) {
      console.error("[Hostinger MySQL Migration Error]:", e.message);
      return { success: false, executed: count, error: e.message };
    }
  }
  return { success: true, executed: count };
}
