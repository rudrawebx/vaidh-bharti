import { getFallbackProducts, getFallbackCategories } from "../src/lib/catalog.functions.ts";
import fs from "fs";

function sqlEscape(val: any): string {
  if (val === null || val === undefined) return "NULL";
  if (typeof val === "number") return String(val);
  if (typeof val === "boolean") return val ? "1" : "0";
  const s = typeof val === "object" ? JSON.stringify(val) : String(val);
  return "'" + s.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, (char: string) => {
    switch (char) {
      case "\0": return "\\0";
      case "\x08": return "\\b";
      case "\x09": return "\\t";
      case "\x1a": return "\\z";
      case "\n": return "\\n";
      case "\r": return "\\r";
      case "\"": return '\\"';
      case "'": return "\\'";
      case "\\": return "\\\\";
      case "%": return "\\%";
      default: return char;
    }
  }) + "'";
}

const categories = getFallbackCategories();
const products = getFallbackProducts();

let sql = `\n-- =========================================================================\n-- INITIAL SEED: ALL 18 AYURVEDIC PRODUCTS & PACK VARIANTS\n-- =========================================================================\n\n`;

// Products
sql += "INSERT INTO `products` (\n";
sql += "  `id`, `name`, `slug`, `sku`, `short_description`, `description`, `benefits`,\n";
sql += "  `ingredients`, `usage_instructions`, `price`, `mrp`, `stock`, `net_quantity`,\n";
sql += "  `category_id`, `images`, `is_active`, `is_featured`, `is_best_seller`, `sort_order`\n";
sql += ") VALUES\n";

const prodValues = products.map((p, idx) => {
  const cat = categories.find((c) => c.slug === p.category?.slug);
  const catId = cat ? cat.id : null;
  return `  (${sqlEscape(p.id)}, ${sqlEscape(p.name)}, ${sqlEscape(p.slug)}, ${sqlEscape(p.sku)}, ${sqlEscape(p.short_description)}, ${sqlEscape(p.description)}, ${sqlEscape(p.benefits)}, ${sqlEscape(p.ingredients)}, ${sqlEscape(p.usage_instructions)}, ${sqlEscape(p.price)}, ${sqlEscape(p.mrp)}, ${sqlEscape(p.stock)}, ${sqlEscape(p.net_quantity)}, ${sqlEscape(catId)}, ${sqlEscape(p.images)}, 1, ${sqlEscape(p.is_featured)}, ${sqlEscape(p.is_best_seller)}, ${idx + 1})`;
});

sql += prodValues.join(",\n");
sql += "\nON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `price` = VALUES(`price`), `mrp` = VALUES(`mrp`), `stock` = VALUES(`stock`), `images` = VALUES(`images`), `description` = VALUES(`description`);\n\n";

// Variants
const allVariants: any[] = [];
for (const p of products) {
  if (p.variants && p.variants.length > 0) {
    p.variants.forEach((v: any, vidx: number) => {
      allVariants.push({
        id: v.id || `${p.id}-var-${vidx + 1}`,
        product_id: p.id,
        label: v.label,
        price: v.price,
        mrp: v.mrp,
        stock: v.stock || 50,
        sort_order: vidx + 1,
      });
    });
  }
}

if (allVariants.length > 0) {
  sql += "INSERT INTO `product_variants` (\n";
  sql += "  `id`, `product_id`, `label`, `price`, `mrp`, `stock`, `sort_order`\n";
  sql += ") VALUES\n";

  const varValues = allVariants.map((v) => {
    return `  (${sqlEscape(v.id)}, ${sqlEscape(v.product_id)}, ${sqlEscape(v.label)}, ${sqlEscape(v.price)}, ${sqlEscape(v.mrp)}, ${sqlEscape(v.stock)}, ${sqlEscape(v.sort_order)})`;
  });

  sql += varValues.join(",\n");
  sql += "\nON DUPLICATE KEY UPDATE `price` = VALUES(`price`), `mrp` = VALUES(`mrp`), `stock` = VALUES(`stock`);\n\n";
}

// Read current schema file and append
const currentSchema = fs.readFileSync("hostinger_vaidh_bharti_schema.sql", "utf-8");
const withoutForeignCheckEnd = currentSchema.replace("SET FOREIGN_KEY_CHECKS = 1;\n", "");
const updated = withoutForeignCheckEnd + sql + "SET FOREIGN_KEY_CHECKS = 1;\n";
fs.writeFileSync("hostinger_vaidh_bharti_schema.sql", updated);
console.log("Successfully appended products and variants to hostinger_vaidh_bharti_schema.sql!");
console.log("Total products:", products.length, "Total variants:", allVariants.length);
