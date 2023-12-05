import { lazy } from 'react';

import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import { PrivateRoute } from 'components/PrivateRoute';

const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));
const UserDefault = Loadable(lazy(() => import('pages/user-management')));
const OrderManagement = Loadable(lazy(() => import('pages/order-management')));

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: (
        <PrivateRoute>
          <DashboardDefault />
        </PrivateRoute>
      )
    },
    {
      path: 'dashboard',
      element: (
        <PrivateRoute>
          <DashboardDefault />
        </PrivateRoute>
      )
    },
    {
      path: 'users',
      element: (
        <PrivateRoute>
          <UserDefault />
        </PrivateRoute>
      )
    }
  ]
};

export default MainRoutes;
