import { MessageCircle, Phone } from "lucide-react";
import { BRAND } from "@/lib/brand";

export function FloatingContact() {
  return (
    <div className="fixed bottom-5 right-4 z-40 flex flex-col gap-3 print:hidden">
      <a
        href={BRAND.whatsapp}
        target="_blank"
        rel="noreferrer noopener"
        aria-label="Chat with us on WhatsApp"
        className="inline-flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-card transition-transform duration-300 hover:scale-105"
      >
        <MessageCircle className="size-5" aria-hidden="true" />
      </a>
      <a
        href={BRAND.phoneHref}
        aria-label={`Call ${BRAND.phone}`}
        className="inline-flex size-12 items-center justify-center rounded-full bg-card text-primary shadow-card ring-1 ring-border transition-transform duration-300 hover:scale-105 sm:hidden"
      >
        <Phone className="size-5" aria-hidden="true" />
      </a>
    </div>
  );
}
