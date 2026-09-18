export function formatNextAction(value: string | null | undefined): string {
  const trimmedValue = value?.trim();
  return !trimmedValue || trimmedValue.toLowerCase() === 'null'
    ? 'No Action Pending'
    : trimmedValue;
}
