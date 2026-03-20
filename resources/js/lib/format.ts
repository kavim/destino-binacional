export function formatCurrencyCents(
  cents: number | null | undefined,
  currency: string | null | undefined
): string {
  const code = currency === "UYU" || currency === "BRL" ? currency : "BRL";
  const n =
    typeof cents === "number" && !Number.isNaN(cents) ? cents / 100 : 0;
  const locale = code === "UYU" ? "es-UY" : "pt-BR";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: code,
  }).format(n);
}
