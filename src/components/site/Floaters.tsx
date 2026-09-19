import { Link } from "@tanstack/react-router";
import { CalendarCheck, Phone } from "lucide-react";
import { telHref, whatsappHref } from "@/lib/site";
import { WhatsAppIcon } from "@/components/site/icons";

export function WhatsAppFab() {
  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Panchsheel Aarogya Dhaam on WhatsApp"
      className="fixed bottom-24 right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#1f8a4c] text-white shadow-[0_18px_40px_-14px_rgba(0,0,0,0.5)] transition-transform hover:scale-105 md:bottom-6 md:right-6"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}

export function MobileBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
      <a href={telHref} className="flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-primary">
        <Phone className="h-4 w-4" />
        Call
      </a>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-14 flex-col items-center justify-center gap-1 border-x border-border text-[11px] font-semibold uppercase tracking-[0.1em] text-primary"
      >
        <WhatsAppIcon className="h-4 w-4" />
        WhatsApp
      </a>
      <Link
        to="/contact"
        className="flex min-h-14 flex-col items-center justify-center gap-1 bg-primary text-[11px] font-semibold uppercase tracking-[0.1em] text-primary-foreground"
      >
        <CalendarCheck className="h-4 w-4" />
        Book
      </Link>
    </div>
  );
}
