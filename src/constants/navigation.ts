import {
  Home,
  PlusCircle,
  Settings,
  Users,
} from 'lucide-react';
import { ROUTES } from '../constants/routes';

export const SIDEBAR_NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    route: ROUTES.DASHBOARD,
  },
  {
    id: 'all-leads',
    label: 'All Leads',
    icon: Users,
    route: ROUTES.LEADS,
  },
  {
    id: 'add-lead',
    label: 'Add Lead',
    icon: PlusCircle,
    route: ROUTES.ADD_LEAD,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    route: ROUTES.SETTINGS,
  },
] as const;
