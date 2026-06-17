const DEFAULT_COUNTRY_CODE = '91';

export function normalizePhone(phone: string, countryCode = DEFAULT_COUNTRY_CODE): string {
  const digits = phone.replace(/\D/g, '');

  if (digits.length === 10) {
    return `${countryCode}${digits}`;
  }

  if (digits.startsWith(countryCode) && digits.length >= 12) {
    return digits;
  }

  return digits;
}

export function formatPhoneForDisplay(phone: string): string {
  const normalized = normalizePhone(phone);

  if (normalized.length === 12 && normalized.startsWith('91')) {
    return `+91 ${normalized.slice(2, 7)} ${normalized.slice(7)}`;
  }

  return phone;
}
