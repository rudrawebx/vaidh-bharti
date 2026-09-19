import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Menu, ShoppingBag, User, X } from "lucide-react";
import { Container } from "@/components/site/primitives";
import logo from "@/assets/logo.png";
import { whatsappHref } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart";
import { useIsAdmin } from "@/hooks/useAuth";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { WhatsAppIcon } from "@/components/site/icons";
import { NavDropdown, servicesLinks, companyLinks, type NavLeaf } from "@/components/site/NavMenu";

function MobileGroup({ label, items, onNavigate }: { label: string; items: NavLeaf[]; onNavigate: () => void }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="border-b border-border/60">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-4 font-display text-xl text-foreground transition-colors hover:text-gold"
      >
        {label}
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} aria-hidden />
      </button>
      {open ? (
        <div className="pb-3">
          {items.map((item) => (
            <Link
              key={item.to}
              to={item.to as never}
              onClick={onNavigate}
              className="block py-2.5 pl-4 text-sm text-muted-foreground transition-colors hover:text-gold"
            >
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function Brand({ compact = false }: { compact?: boolean; inverted?: boolean }) {
  return (
    <Link to="/" className="group flex items-center py-1" aria-label="Vaidh Bharti — Panchsheel Aarogya Dhaam, home">
      <img
        src={logo}
        alt="Vaidh Bharti"
        className={cn(
          "w-auto shrink-0 object-contain transition-all duration-300",
          compact ? "h-10 sm:h-12" : "h-12 sm:h-14 md:h-[68px] lg:h-[72px]",
        )}
      />
    </Link>
  );
}

export function Header() {
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { count, setOpen } = useCart();
  const { isAdmin } = useIsAdmin();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 border-b border-border/80 bg-[#FAF7F2] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.06)] transition-all duration-300"
    >
      <Container>
        <div
          className={cn(
            "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 transition-all duration-300 lg:flex lg:justify-between",
            scrolled ? "h-16 sm:h-18" : "h-20 sm:h-22 md:h-24",
          )}
        >
          <Brand compact={scrolled} />

          <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
            <Link
              to="/"
              activeOptions={{ exact: true }}
              className="text-[14px] font-semibold tracking-wide text-foreground/80 transition-colors hover:text-primary data-[status=active]:text-primary"
            >
              Home
            </Link>
            <NavDropdown label="Services" items={servicesLinks} />
            <NavDropdown label="Company" items={companyLinks} />
            <Link
              to="/products"
              className="text-[14px] font-semibold tracking-wide text-foreground/80 transition-colors hover:text-primary data-[status=active]:text-primary"
            >
              Shop
            </Link>
            <Link
              to="/contact"
              className="text-[14px] font-semibold tracking-wide text-foreground/80 transition-colors hover:text-primary data-[status=active]:text-primary"
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-2.5">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with us on WhatsApp"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border/80 bg-card text-primary transition-colors hover:border-gold hover:text-gold"
            >
              <WhatsAppIcon className="h-[18px] w-[18px]" />
            </a>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
              className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border/80 bg-card text-primary transition-colors hover:border-gold hover:text-gold"
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
              {count > 0 ? (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[10px] font-bold text-forest-deep">
                  {count}
                </span>
              ) : null}
            </button>

            <Link
              to="/account"
              aria-label="My account"
              className="hidden h-10 w-10 shrink-0 place-items-center rounded-full border border-border/80 bg-card text-primary transition-colors hover:border-gold hover:text-gold sm:grid"
            >
              <User className="h-[18px] w-[18px]" />
            </Link>

            {isAdmin ? (
              <Link
                to="/admin"
                className="hidden shrink-0 items-center rounded-md border border-primary/30 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-primary transition-colors hover:border-gold hover:text-gold lg:inline-flex"
              >
                Admin
              </Link>
            ) : null}

            <Link
              to="/book"
              className="hidden shrink-0 items-center rounded-md bg-primary px-6 py-3 text-[12px] font-bold uppercase tracking-[0.14em] text-primary-foreground shadow-sm transition-all hover:bg-forest-deep hover:shadow-md sm:inline-flex"
            >
              Book Consultation
            </Link>

            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  aria-label="Open menu"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border text-primary lg:hidden"
                >
                  <Menu className="h-[18px] w-[18px]" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[86vw] max-w-sm border-l-border bg-background p-0">
                <div className="flex h-16 items-center justify-between border-b border-border px-6">
                  <Brand compact />
                  <button
                    type="button"
                    aria-label="Close menu"
                    onClick={() => setMenuOpen(false)}
                    className="grid h-9 w-9 place-items-center rounded-full border border-border text-primary"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <nav aria-label="Mobile" className="flex max-h-[calc(100vh-13rem)] flex-col overflow-y-auto px-6 py-4">
                  <Link
                    to="/"
                    activeOptions={{ exact: true }}
                    onClick={() => setMenuOpen(false)}
                    className="border-b border-border/60 py-4 font-display text-xl text-foreground transition-colors hover:text-gold"
                  >
                    Home
                  </Link>
                  <MobileGroup label="Services" items={servicesLinks} onNavigate={() => setMenuOpen(false)} />
                  <MobileGroup label="Company" items={companyLinks} onNavigate={() => setMenuOpen(false)} />
                  <Link
                    to="/products"
                    onClick={() => setMenuOpen(false)}
                    className="border-b border-border/60 py-4 font-display text-xl text-foreground transition-colors hover:text-gold"
                  >
                    Shop
                  </Link>
                  <Link
                    to="/contact"
                    onClick={() => setMenuOpen(false)}
                    className="border-b border-border/60 py-4 font-display text-xl text-foreground transition-colors hover:text-gold"
                  >
                    Contact
                  </Link>
                </nav>
                <div className="px-6 pb-8">
                  <Link
                    to="/account"
                    onClick={() => setMenuOpen(false)}
                    className="mb-3 flex items-center justify-center rounded-sm border border-border px-5 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary"
                  >
                    My Account
                  </Link>
                  <Link
                    to="/book"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center rounded-sm bg-primary px-5 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-primary-foreground"
                  >
                    Book Consultation
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </Container>
    </header>
  );
}
