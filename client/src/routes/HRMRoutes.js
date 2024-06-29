import { lazy } from 'react';

import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import { PrivateRoute } from 'components/PrivateRoute';
import { PERMISSIONS } from 'constants/permissions-and-roles';

const EmployeeManagement = Loadable(lazy(() => import('pages/employee-management')));
const HRMRoutes = {
  path: '/employees',
  element: <MainLayout />,
  children: [
    {
      path: '',
      element: (
        <PrivateRoute permission={PERMISSIONS.PERMISSION_VIEW_USERS}>
          <EmployeeManagement />
        </PrivateRoute>
      )
    }
  ]
};

export default HRMRoutes;
