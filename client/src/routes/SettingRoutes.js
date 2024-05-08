import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import { PrivateRoute } from 'components/PrivateRoute';
import MainLayout from 'layout/MainLayout/index';
import { PERMISSIONS } from 'constants/permissions-and-roles';

// render - login
const ChanelManagement = Loadable(lazy(() => import('pages/chanel-management')));
const DeliveryServiceAccountsManagement = Loadable(lazy(() => import('pages/delivery-service-accounts/index')));

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
    },
    {
      path: '/delivery-service-accounts',
      element: (
        <PrivateRoute permission={PERMISSIONS.PERMISSION_VIEW_DELIVERY_ACCOUNTS}>
          <DeliveryServiceAccountsManagement />
        </PrivateRoute>
      )
    }
  ]
};

export default SettingRoutes;
