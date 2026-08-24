import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, ShoppingBag, Phone } from "lucide-react";
import logo from "@/assets/logo.png.asset.json";
import { BRAND, NAV, btn, cx } from "@/lib/brand";
import { useCart } from "@/lib/cart";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count } = useCart();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (to: string) =>
    to === "/" ? pathname === "/" : pathname.startsWith(to);

  return (
    <header
      className={cx(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border/70 bg-background/92 backdrop-blur-md shadow-soft"
          : "bg-background/80 backdrop-blur-sm",
      )}
    >
      <div className="container-vb flex items-center justify-between gap-4 py-3">
        <Link to="/" className="flex shrink-0 items-center" aria-label={`${BRAND.name} — home`}>
          <img
            src={logo.url}
            alt={`${BRAND.name} — ${BRAND.tagline}`}
            width={168}
            height={112}
            className="h-11 w-auto md:h-14"
            fetchPriority="high"
          />
        </Link>

        <nav aria-label="Primary" className="hidden xl:block">
          <ul className="flex items-center gap-7">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  aria-current={isActive(item.to) ? "page" : undefined}
                  className={cx(
                    "relative text-sm tracking-wide transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-px after:bg-gold after:transition-all after:duration-300",
                    isActive(item.to)
                      ? "text-primary after:w-full"
                      : "text-foreground/75 hover:text-primary after:w-0 hover:after:w-full",
                  )}
                >
                  {item.label === "Panchsheel Aarogya Dhaam"
                    ? "Panchsheel"
                    : item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={BRAND.phoneHref}
            aria-label={`Call ${BRAND.phone}`}
            className="hidden h-11 w-11 items-center justify-center rounded-md text-foreground/70 transition-colors hover:bg-muted hover:text-primary md:inline-flex"
          >
            <Phone className="h-[18px] w-[18px]" aria-hidden="true" />
          </a>
          <Link
            to="/cart"
            aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-md text-foreground/70 transition-colors hover:bg-muted hover:text-primary"
          >
            <ShoppingBag className="h-[18px] w-[18px]" aria-hidden="true" />
            {count > 0 ? (
              <span className="absolute right-1 top-1 min-w-4 rounded-full bg-gold px-1 text-[10px] font-semibold leading-4 text-primary-foreground">
                {count}
              </span>
            ) : null}
          </Link>
          <Link
            to="/consultation"
            className={cx(btn.base, btn.primary, "hidden lg:inline-flex")}
          >
            Book Consultation
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted xl:hidden"
          >
            {open ? <Menu className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-background xl:hidden">
          <div className="container-vb flex items-center justify-between py-3">
            <img src={logo.url} alt="" width={140} height={94} className="h-11 w-auto" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-md hover:bg-muted"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <nav aria-label="Mobile" className="container-vb flex-1 overflow-y-auto pb-10 pt-4">
            <ul className="flex flex-col divide-y divide-border">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={cx(
                      "block py-4 font-display text-2xl",
                      isActive(item.to) ? "text-primary" : "text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3">
              <Link to="/consultation" className={cx(btn.base, btn.primary, "w-full")}>
                Book Consultation
              </Link>
              <a href={BRAND.whatsapp} className={cx(btn.base, btn.outline, "w-full")}>
                WhatsApp {BRAND.phone}
              </a>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
