import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import { PrivateRoute } from 'components/PrivateRoute';
import MainLayout from 'layout/MainLayout/index';

// render - login
const OrderManagement = Loadable(lazy(() => import('pages/order-management')));
const CreateOrder = Loadable(lazy(() => import('pages/create-order')));

// ==============================|| AUTH ROUTING ||============================== //

const OrderRoutes = {
  path: '/order',
  element: <MainLayout />,
  children: [
    {
      path: 'all',
      element: (
        <PrivateRoute>
          <OrderManagement />
        </PrivateRoute>
      )
    },
    {
      path: 'new',
      element: (
        <PrivateRoute>
          <CreateOrder />
        </PrivateRoute>
      )
    }
  ]
};

export default OrderRoutes;