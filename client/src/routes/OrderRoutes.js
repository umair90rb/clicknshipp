import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import { PrivateRoute } from 'components/PrivateRoute';
import MainLayout from 'layout/MainLayout/index';
import { PERMISSIONS } from 'constants/permissions-and-roles';

// render - login
const OrderManagement = Loadable(lazy(() => import('pages/order-management')));
const CreateOrder = Loadable(lazy(() => import('pages/create-order')));
const OrderView = Loadable(lazy(() => import('pages/order-view')));
const BookingManagement = Loadable(lazy(() => import('pages/booking-management')));

// ==============================|| AUTH ROUTING ||============================== //

const OrderRoutes = {
  path: '/order',
  element: <MainLayout />,
  children: [
    {
      path: 'all',
      element: (
        <PrivateRoute permission={PERMISSIONS.PERMISSION_VIEW_ORDERS}>
          <OrderManagement />
        </PrivateRoute>
      )
    },
    {
      path: 'new',
      element: (
        <PrivateRoute permission={PERMISSIONS.PERMISSION_CREATE_ORDER}>
          <CreateOrder />
        </PrivateRoute>
      )
    },
    {
      path: 'booking',
      element: (
        <PrivateRoute>
          <BookingManagement />
        </PrivateRoute>
      )
    },
    {
      path: ':orderId',
      element: (
        <PrivateRoute permission={PERMISSIONS.PERMISSION_VIEW_ORDERS}>
          <OrderView />
        </PrivateRoute>
      )
    }
  ]
};

export default OrderRoutes;
