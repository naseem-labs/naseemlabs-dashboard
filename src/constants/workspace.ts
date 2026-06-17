import { Stethoscope, UserRound } from 'lucide-react';
import { ROUTES } from './routes';
import type { WorkspaceId, WorkspaceOption } from '../types/workspace.types';

export const WORKSPACE_OPTIONS: WorkspaceOption[] = [
  {
    id: 'reception',
    title: 'Reception Desk',
    description: 'Manage leads, follow ups and patient conversations',
    accent: 'purple',
    route: ROUTES.DASHBOARD,
    icon: UserRound,
  },
  {
    id: 'doctor',
    title: 'Doctor Review',
    description: 'Review patient summaries, information and give your opinion',
    accent: 'green',
    route: ROUTES.DOCTOR_DASHBOARD,
    icon: Stethoscope,
  },
];

export const WORKSPACE_ROUTE_BY_ID: Record<WorkspaceId, string> = {
  reception: ROUTES.DASHBOARD,
  doctor: ROUTES.DOCTOR_DASHBOARD,
};
