export function formatCurrency(amount: number, symbol = '$'): string {
  return `${symbol}${amount.toFixed(2)}`;
}

export function formatDate(iso: string, locale = 'en-US'): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return iso;
  }
}

export function formatRelativeDate(iso: string): string {
  try {
    const diffMs = Date.now() - new Date(iso).getTime();
    const days = Math.floor(diffMs / 86400000);
    if (days <= 0) return 'today';
    if (days === 1) return '1 day ago';
    if (days < 30) return `${days} days ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
    const y = Math.floor(months / 12);
    return `${y} year${y > 1 ? 's' : ''} ago`;
  } catch {
    return '';
  }
}

export function luhnCheck(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 13) return false;
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

export function detectCardBrand(num: string): string {
  const n = num.replace(/\D/g, '');
  if (/^4/.test(n)) return 'Visa';
  if (/^(5[1-5]|2[2-7])/.test(n)) return 'Mastercard';
  if (/^3[47]/.test(n)) return 'Amex';
  if (/^(6011|65|64[4-9])/.test(n)) return 'Discover';
  return 'Card';
}

export function maskCard(num: string): string {
  const n = num.replace(/\D/g, '');
  return n.length >= 4 ? n.slice(-4) : n;
}

export function uid(prefix = 'id'): string {
  return `${prefix}-${Date.now().toString(36).slice(-4)}${Math.random().toString(36).slice(2, 7)}`;
}
