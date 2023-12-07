import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import { PrivateRoute } from 'components/PrivateRoute';
import MainLayout from 'layout/MainLayout/index';

// render - login
const CustomerManagment = Loadable(lazy(() => import('pages/customer-management')));

// ==============================|| AUTH ROUTING ||============================== //

const CustomerRoutes = {
  path: '/customer',
  element: <MainLayout />,
  children: [
    {
      path: 'all',
      element: (
        <PrivateRoute>
          <CustomerManagment />
        </PrivateRoute>
      )
    }
  ]
};

export default CustomerRoutes;
