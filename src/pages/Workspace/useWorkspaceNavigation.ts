import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { WORKSPACE_ROUTE_BY_ID } from '../../constants/workspace';
import { authService } from '../../services/auth.service';
import type { WorkspaceId } from '../../types/workspace.types';

export function useWorkspaceNavigation() {
  const navigate = useNavigate();

  const navigateToWorkspace = useCallback(
    (workspaceId: WorkspaceId) => {
      authService.setWorkspaceRole(workspaceId === 'doctor' ? 'doctor' : 'receptionist');
      const route = WORKSPACE_ROUTE_BY_ID[workspaceId];
      navigate(route);
    },
    [navigate],
  );

  const navigateToReception = useCallback(() => {
    navigate(ROUTES.DASHBOARD);
  }, [navigate]);

  const navigateToDoctor = useCallback(() => {
    navigate(ROUTES.DOCTOR_DASHBOARD);
  }, [navigate]);

  return {
    navigateToWorkspace,
    navigateToReception,
    navigateToDoctor,
  };
}
