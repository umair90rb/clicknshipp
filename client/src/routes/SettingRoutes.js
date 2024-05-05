import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import { PrivateRoute } from 'components/PrivateRoute';
import MainLayout from 'layout/MainLayout/index';
import { PERMISSIONS } from 'constants/permissions-and-roles';

// render - login
const ChanelManagement = Loadable(lazy(() => import('pages/chanel-management')));

// ==============================|| AUTH ROUTING ||============================== //

const SettingRoutes = {
  element: <MainLayout />,
  children: [
    {
      path: '/chanel',
      element: (
        <PrivateRoute permission={PERMISSIONS.PERMISSION_VIEW_SALES_CHANEL}>
          <ChanelManagement />
        </PrivateRoute>
      )
    }
  ]
};

export default SettingRoutes;
