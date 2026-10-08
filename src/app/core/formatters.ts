const euroFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 2,
});

export function formatCurrency(value: number): string {
  return euroFormatter.format(value);
}
