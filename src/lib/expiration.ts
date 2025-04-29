export type ExpirationOption = '6h' | '1d' | '3d' | '7d';

export const expirationOptions: { label: string; value: ExpirationOption }[] = [
  { label: '6 hours', value: '6h' },
  { label: '1 day', value: '1d' },
  { label: '3 days', value: '3d' },
  { label: '7 days', value: '7d' },
];

export function getExpirationDate(option: ExpirationOption): Date {
  const now = new Date();
  const hours = {
    '6h': 6,
    '1d': 24,
    '3d': 72,
    '7d': 168,
  }[option];

  return new Date(now.getTime() + hours * 60 * 60 * 1000);
}

export function isPasteExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt;
}
