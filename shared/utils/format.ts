export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCompactCurrency(amount: number): string {
  if (amount >= 1000) {
    const thousands = amount / 1000;
    const rounded = Number.isInteger(thousands) ? thousands : Number(thousands.toFixed(1));
    return `Rp${rounded}k`;
  }
  return `Rp${amount}`;
}
