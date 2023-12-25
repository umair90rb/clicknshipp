import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import { PrivateRoute } from 'components/PrivateRoute';
import MainLayout from 'layout/MainLayout/index';

// render - login
const ChanelManagement = Loadable(lazy(() => import('pages/chanel-management')));

// ==============================|| AUTH ROUTING ||============================== //

const SettingRoutes = {
  element: <MainLayout />,
  children: [
    {
      path: '/chanel',
      element: (
        <PrivateRoute>
          <ChanelManagement />
        </PrivateRoute>
      )
    }
  ]
};

export default SettingRoutes;
