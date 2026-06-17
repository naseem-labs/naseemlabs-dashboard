export const SIDEBAR_STORAGE_KEY = 'naseemlabs-sidebar-collapsed';

/** Matches Tailwind `lg` — desktop sidebar vs mobile overlay */
export const SIDEBAR_DESKTOP_BREAKPOINT = 1024;

export const SIDEBAR_WIDTH_COLLAPSED = '5rem'; // 80px
export const SIDEBAR_WIDTH_EXPANDED = '16rem'; // 256px

export function isLeadDetailPath(pathname: string): boolean {
  const match = pathname.match(/^\/leads\/([^/]+)$/);
  if (!match) {
    return false;
  }

  return match[1] !== 'new';
}

export function readSidebarCollapsedPreference(): boolean {
  try {
    const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    if (stored === null) {
      return true;
    }

    return stored === 'true';
  } catch {
    return true;
  }
}

export function writeSidebarCollapsedPreference(collapsed: boolean): void {
  try {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, String(collapsed));
  } catch {
    // Ignore storage errors (private browsing, quota, etc.)
  }
}
