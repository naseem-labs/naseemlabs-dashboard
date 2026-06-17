export const TABLE_LAYOUT = {
  ROW_HEIGHT: 72,
  HEADER_HEIGHT: 44,
  PAGINATION_HEIGHT: 72,
  MIN_ROWS: 4,
  MAX_ROWS: 12,
  MOBILE_PAGE_SIZE: 5,
  DESKTOP_BREAKPOINT: 1024,
} as const;

export function calculateDesktopPageSize(availableHeight: number): number {
  const bodyHeight =
    availableHeight - TABLE_LAYOUT.HEADER_HEIGHT - TABLE_LAYOUT.PAGINATION_HEIGHT;

  if (bodyHeight <= 0) {
    return TABLE_LAYOUT.MIN_ROWS;
  }

  const calculated = Math.floor(bodyHeight / TABLE_LAYOUT.ROW_HEIGHT);

  return Math.max(
    TABLE_LAYOUT.MIN_ROWS,
    Math.min(TABLE_LAYOUT.MAX_ROWS, calculated),
  );
}
