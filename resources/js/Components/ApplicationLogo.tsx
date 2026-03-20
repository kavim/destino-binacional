import { cn } from "@/lib/utils";

/** Ficheiros em `public/images/` → URL `/images/...` */
const LOGO_CLARO = "/images/logotipo-negro.svg";
const LOGO_ESCURO = "/images/logotipo-blanco.svg";

type ApplicationLogoProps = React.HTMLAttributes<HTMLDivElement> & {
  /** `sm` = barra (h-9); `md` = ecrãs login/registo (maior) */
  size?: "sm" | "md";
};

export default function ApplicationLogo({
  className,
  size = "sm",
  ...props
}: ApplicationLogoProps) {
  const imgSize =
    size === "md" ? "h-16 w-auto max-w-[min(100%,20rem)]" : "h-9 w-auto max-w-[min(100%,12rem)]";

  return (
    <div
      className={cn("flex shrink-0 items-center justify-center", className)}
      {...props}
    >
      {/* Tema claro: logo escuro. Tema escuro: logo claro. */}
      <img
        src={LOGO_CLARO}
        alt="Destino Binacional"
        width={280}
        height={102}
        decoding="async"
        className={cn(
          "block object-contain object-left",
          imgSize,
          "dark:hidden"
        )}
      />
      <img
        src={LOGO_ESCURO}
        alt="Destino Binacional"
        width={280}
        height={102}
        decoding="async"
        className={cn(
          "hidden object-contain object-left",
          imgSize,
          "dark:block"
        )}
      />
    </div>
  );
}
