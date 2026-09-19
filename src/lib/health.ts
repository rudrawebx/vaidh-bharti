import type { ProductDTO } from "@/lib/catalog.functions";

/**
 * Wellness discovery groups. These are browsing aids only — they describe the
 * traditional area of use, never a medical claim or a promise of cure.
 */
export const healthGroups = [
  { slug: "digestive", label: "Digestive Wellness", words: ["digest", "stomach", "pachan", "acidity", "liver", "appetite", "constipat", "gut"] },
  { slug: "joint", label: "Joint & Muscle Wellness", words: ["joint", "muscle", "knee", "back", "pain", "arthr", "sandhi", "body ache"] },
  { slug: "hair", label: "Hair & Scalp Care", words: ["hair", "scalp", "dandruff", "kesh"] },
  { slug: "skin", label: "Skin Care", words: ["skin", "face", "glow", "twak", "complexion", "acne"] },
  { slug: "immunity", label: "General Wellness", words: ["immun", "energy", "strength", "wellness", "vitality", "rasayan", "stamina", "daily"] },
  { slug: "mens", label: "Men's Wellness", words: ["men", "male", "shilajit", "vigour", "vigor"] },
  { slug: "womens", label: "Women's Wellness", words: ["women", "female", "menstru", "mother", "postnatal"] },
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
