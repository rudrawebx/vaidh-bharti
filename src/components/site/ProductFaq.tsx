import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { ProductDTO } from "@/lib/catalog.functions";
import { site, whatsappHref } from "@/lib/site";

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
    <section className="mt-16 border-t border-border pt-16">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">Ayurvedic Guidance & FAQ</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">Common Questions About {product.name}</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Ayurveda emphasizes individualized care based on your Prakriti (body constitution) and Agni (digestive fire).
            Here are common questions regarding this formulation.
          </p>

          <div className="mt-8 rounded-sm border border-gold/30 bg-card p-6">
            <h4 className="font-display text-lg text-foreground">Need Personalised Advice?</h4>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              If you have chronic symptoms or are currently on prescription medication, our Vaidya at Panchsheel Aarogya Dhaam can guide you on the exact dosage.
            </p>
            <div className="mt-5 flex flex-col gap-2.5">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground transition-colors hover:bg-forest-deep"
              >
                Chat on WhatsApp
              </a>
              <a
                href={`tel:${site.phone}`}
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-border px-4 py-2 text-xs font-medium uppercase tracking-wider text-foreground transition-colors hover:border-gold hover:text-gold"
              >
                Call {site.phoneDisplay}
              </a>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`faq-${i}`} className="rounded-sm border border-border bg-card px-5 transition-colors">
                <AccordionTrigger className="text-left font-display text-base hover:text-gold sm:text-lg">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
