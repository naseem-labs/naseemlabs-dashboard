import type { LucideIcon } from 'lucide-react';
import type { AppRoute } from '../constants/routes';

export type WorkspaceId = 'reception' | 'doctor';

export type WorkspaceAccent = 'purple' | 'green';

export interface WorkspaceOption {
  id: WorkspaceId;
  title: string;
  description: string;
  accent: WorkspaceAccent;
  route: AppRoute;
  icon: LucideIcon;
}
