import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { ProductDTO } from "@/lib/catalog.functions";
import { site } from "@/lib/site";

export type CustomFaq = { question: string; answer: string };

export function productFaqs(product: ProductDTO, custom: CustomFaq[] = []) {
  const items: { q: string; a: string }[] = custom.map((f) => ({ q: f.question, a: f.answer }));

  items.push({
    q: `How should I take ${product.name}?`,
    a:
      product.usage_instructions?.trim() ||
      "Follow the directions printed on the pack, or the dosage advised for you during your consultation at Panchsheel Aarogya Dhaam.",
  });

  if (product.ingredients?.trim()) {
    items.push({ q: `What is ${product.name} made of?`, a: product.ingredients.trim() });
  }

  if (product.net_quantity) {
    items.push({
      q: "What pack size will I receive?",
      a: `Each pack contains ${product.net_quantity}${
        product.variants.length > 1 ? ", and other sizes are listed above where available." : "."
      }`,
    });
  }

  items.push({
    q: "Is it safe to take alongside my other medicines?",
    a: "Ayurvedic preparations are generally well tolerated, but if you are pregnant, nursing, managing a long-term condition or already on prescribed medication, please speak to a qualified practitioner before starting. You are welcome to book a consultation with us.",
  });

  items.push({
    q: "How long does delivery take?",
    a: "Orders are dispatched from Hansi, Haryana and usually reach most parts of India within 3–7 working days. You can follow your parcel any time from the Track Order page.",
  });

  items.push({
    q: "Can I speak to someone before ordering?",
    a: `Yes. Call us on ${site.phoneDisplay} or message us on WhatsApp and we will help you choose what suits you.`,
  });

  return items;
}

export function ProductFaq({ product, custom = [] }: { product: ProductDTO; custom?: CustomFaq[] }) {
  const faqs = productFaqs(product, custom);

  return (
    <section className="mt-16 border-t border-border pt-12">
      <h2 className="font-display text-3xl">Questions about {product.name}</h2>
      <Accordion type="single" collapsible className="mt-6 max-w-3xl">
        {faqs.map((f, i) => (
          <AccordionItem key={f.q} value={`faq-${i}`}>
            <AccordionTrigger className="text-left font-display text-lg">{f.q}</AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
