import type { ProductDTO } from "@/lib/catalog.functions";

/**
 * Wellness discovery groups. These are browsing aids only — they describe the
 * traditional area of use, never a medical claim or a promise of cure.
 */
export const healthGroups = [
  { slug: "digestive", label: "Digestive Wellness", words: ["digest", "stomach", "pachan", "acidity", "liver", "appetite", "constipat", "gut", "pit shanti", "panch liv", "panch fresh", "uder"] },
  { slug: "joint", label: "Joint & Muscle Wellness", words: ["joint", "muscle", "knee", "back", "pain", "arthr", "sandhi", "body ache", "panch vat", "vat"] },
  { slug: "hair", label: "Hair & Scalp Care", words: ["hair", "scalp", "dandruff", "kesh", "onion"] },
  { slug: "skin", label: "Skin Care", words: ["skin", "face", "glow", "twak", "complexion", "acne", "saffron"] },
  { slug: "immunity", label: "General & Metabolic Wellness", words: ["immun", "energy", "strength", "wellness", "vitality", "rasayan", "stamina", "daily", "fat panch", "weight", "medohar", "nabhi"] },
  { slug: "mens", label: "Men's Vitality", words: ["men", "male", "shilajit", "vigour", "vigor", "shahi", "gold", "swarna", "stamina"] },
  { slug: "womens", label: "Women's Wellness", words: ["women", "female", "menstru", "mother", "postnatal", "luko", "leukorrh", "pradar", "safed pani"] },
  { slug: "mind", label: "Mind & Sleep", words: ["sleep", "stress", "calm", "mind", "anxiety", "brahmi", "relax"] },
] as const;

export type HealthGroup = (typeof healthGroups)[number];

export function healthTagsFor(p: ProductDTO): string[] {
  const hay = [
    p.name,
    p.short_description ?? "",
    p.description ?? "",
    p.ingredients ?? "",
    p.usage_instructions ?? "",
    p.category?.name ?? "",
    ...p.benefits,
  ]
    .join(" ")
    .toLowerCase();
  const tags = healthGroups.filter((g) => g.words.some((w) => hay.includes(w))).map((g) => g.slug);
  return tags.length ? tags : ["immunity"];
}
