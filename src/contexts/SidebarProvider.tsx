import type { ReactNode } from 'react';
import { SidebarContext, useSidebarState } from './sidebar-context';

export function SidebarProvider({ children }: { children: ReactNode }) {
  const value = useSidebarState();

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}
