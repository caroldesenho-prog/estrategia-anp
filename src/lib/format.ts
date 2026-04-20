export const formatBRL = (value: number): string => {
  if (!value && value !== 0) return "—";
  const abs = Math.abs(value);
  if (abs >= 1e9) return `R$ ${(value / 1e9).toFixed(1).replace(".", ",")} bi`;
  if (abs >= 1e6) return `R$ ${(value / 1e6).toFixed(0)} mi`;
  if (abs >= 1e3) return `R$ ${(value / 1e3).toFixed(0)} mil`;
  return `R$ ${value.toFixed(0)}`;
};

export const formatBRLFull = (value: number): string =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);

export const formatNumber = (n: number): string => new Intl.NumberFormat("pt-BR").format(n);

export const formatPct = (n: number, digits = 1): string =>
  `${n.toFixed(digits).replace(".", ",")}%`;
