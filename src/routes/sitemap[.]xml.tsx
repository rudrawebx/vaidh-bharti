import { createFileRoute } from "@tanstack/react-router";
import { products } from "@/lib/site";

const paths = [
  "/",
  "/about",
  "/ayurveda",
  "/treatments",
  "/treatments/nadi-pariksha",
  "/treatments/panchakarma",
  "/treatments/ayurvedic-consultation",
  "/products",
  "/categories",
  "/category/powders",
  "/category/oils",
  "/category/shilajit",
  "/category/capsules",
  "/category/teas",
  "/book",
  "/testimonials",
  "/gallery",
  "/contact",
  "/faq",
  ...products.map((p) => `/product/${p.slug}`),
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const origin = new URL(request.url).origin;
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${origin}${p}</loc></url>`).join("\n")}
</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml" } });
      },
    },
  },
});
