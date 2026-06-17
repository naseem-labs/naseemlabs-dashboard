import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { LoginPage } from '../pages/Login/LoginPage';
import { DashboardPage } from '../pages/Dashboard/DashboardPage';
import { DoctorDashboardPage } from '../pages/Doctor/DoctorDashboardPage';
import { WorkspacePage } from '../pages/Workspace/WorkspacePage';
import { LeadsPage } from '../pages/Leads/LeadsPage';
import { LeadDetailPage } from '../pages/Leads/LeadDetailPage';
import { AddLeadPage } from '../pages/Leads/AddLeadPage';
import { SettingsPage } from '../pages/Settings/SettingsPage';
import { ProfilePage } from '../pages/Profile/ProfilePage';
import { NotificationsPage } from '../pages/Notifications/NotificationsPage';
import { ProtectedRoute } from './ProtectedRoute';

function protectedRoute(element: React.ReactNode) {
  return <ProtectedRoute>{element}</ProtectedRoute>;
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.WORKSPACE} element={protectedRoute(<WorkspacePage />)} />
        <Route path={ROUTES.DASHBOARD} element={protectedRoute(<DashboardPage />)} />
        <Route path={ROUTES.PROFILE} element={protectedRoute(<ProfilePage />)} />
        <Route path={ROUTES.NOTIFICATIONS} element={protectedRoute(<NotificationsPage />)} />
        <Route path={ROUTES.LEADS} element={protectedRoute(<LeadsPage />)} />
        <Route path={ROUTES.ADD_LEAD} element={protectedRoute(<AddLeadPage />)} />
        <Route path={ROUTES.LEAD_DETAIL} element={protectedRoute(<LeadDetailPage />)} />
        <Route path={ROUTES.SETTINGS} element={protectedRoute(<SettingsPage />)} />
        <Route
          path={ROUTES.DOCTOR_DASHBOARD}
          element={protectedRoute(<DoctorDashboardPage />)}
        />
        <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
        <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
