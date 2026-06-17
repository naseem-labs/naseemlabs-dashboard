import { useCallback, useEffect, useState } from 'react';
import type { RefObject } from 'react';
import {
  calculateDesktopPageSize,
  TABLE_LAYOUT,
} from '../constants/table';

interface UseTablePageSizeResult {
  pageSize: number;
  isDesktop: boolean;
}

export function useTablePageSize(
  containerRef: RefObject<HTMLElement | null>,
): UseTablePageSizeResult {
  const [pageSize, setPageSize] = useState<number>(TABLE_LAYOUT.MIN_ROWS);
  const [isDesktop, setIsDesktop] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.innerWidth >= TABLE_LAYOUT.DESKTOP_BREAKPOINT,
  );

  const updatePageSize = useCallback(() => {
    const desktop = window.innerWidth >= TABLE_LAYOUT.DESKTOP_BREAKPOINT;
    setIsDesktop(desktop);

    if (!desktop) {
      setPageSize(TABLE_LAYOUT.MOBILE_PAGE_SIZE);
      return;
    }

    const container = containerRef.current;
    if (!container) {
      return;
    }

    const nextPageSize = calculateDesktopPageSize(container.clientHeight);
    setPageSize((current) => (current === nextPageSize ? current : nextPageSize));
  }, [containerRef]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const resizeObserver = new ResizeObserver(() => {
      updatePageSize();
    });

    resizeObserver.observe(container);
    window.addEventListener('resize', updatePageSize);
    requestAnimationFrame(updatePageSize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updatePageSize);
    };
  }, [containerRef, updatePageSize]);

  return { pageSize, isDesktop };
}
