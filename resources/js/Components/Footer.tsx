import { Separator } from "@/Components/ui/separator";
import { cn } from "@/lib/utils";

const socialLinkClass = cn(
  "rounded-sm text-footer-muted transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
);

export default function Footer() {
  return (
    <footer className="relative mt-auto border-t border-footer-border bg-footer text-footer-foreground shadow-[inset_0_1px_0_0_hsl(0_0%_100%_/0.06)] dark:shadow-[inset_0_1px_0_0_hsl(0_0%_100%_/0.04)]">
      <div className="mx-auto max-w-7xl px-4 py-14 pb-[max(3.5rem,env(safe-area-inset-bottom))] sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[minmax(0,280px)_1fr] md:items-start">
          <div className="mx-auto text-center md:mx-0 md:text-left">
            <a
              href="/"
              className="inline-flex items-center justify-center md:justify-start"
            >
              <img
                src="/images/logotipo-blanco.svg"
                alt="Destino Binacional"
                className="h-12 w-auto max-w-[220px] object-contain object-left"
                width={220}
                height={80}
                loading="lazy"
                decoding="async"
              />
            </a>
            <p className="mt-3 text-sm text-footer-muted">
              Descubrí tu destino!
            </p>
            <div className="mt-5 flex justify-center gap-4 md:justify-start">
              <a href="#" className={socialLinkClass} aria-label="Facebook">
                <svg
                  fill="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
              <a href="#" className={socialLinkClass} aria-label="Twitter">
                <svg
                  fill="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                >
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </a>
              <a href="#" className={socialLinkClass} aria-label="Instagram">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01" />
                </svg>
              </a>
              <a href="#" className={socialLinkClass} aria-label="LinkedIn">
                <svg
                  fill="currentColor"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="0"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="none"
                    d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
                  />
                  <circle cx="4" cy="4" r="2" stroke="none" />
                </svg>
              </a>
            </div>
          </div>

          <div className="text-center md:text-left">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-footer-muted">
              Contacto
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href="mailto:mesadestinorivera@gmail.com"
                  className="inline-flex items-center justify-center gap-2 text-footer-foreground/90 transition-colors hover:text-primary md:justify-start"
                >
                  <i className="fa-solid fa-envelope text-footer-muted" />
                  mesadestinorivera@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/59892933740"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 text-footer-foreground/90 transition-colors hover:text-primary md:justify-start"
                >
                  <i className="fa-brands fa-whatsapp text-footer-muted" />
                  +598 92 933 740
                </a>
              </li>
              <li>
                <a
                  href="tel:+59892933740"
                  className="inline-flex items-center justify-center gap-2 text-footer-foreground/90 transition-colors hover:text-primary md:justify-start"
                >
                  <i className="fa-solid fa-phone text-footer-muted" />
                  +598 92 933 740
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Separator className="bg-footer-border" />

      <div className="border-t border-footer-border/60 bg-black/10">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-footer-muted">
            © {new Date().getFullYear()} Destino Binacional · Todos los derechos
            reservados · Developed by{" "}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://www.linkedin.com/in/kevin-maciel-medeiros-602b66159/"
              className="font-medium text-footer-foreground/90 underline-offset-4 transition-colors hover:text-primary hover:underline"
            >
              Los Carpincho
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
