import { lazy } from 'react';
import Loadable from 'components/Loadable';
import { PrivateRoute } from 'components/PrivateRoute';
import MainLayout from 'layout/MainLayout/index';
import SupplierManagement from 'pages/supplier-management/index';
import StockManagement from 'pages/stock/index';
import { PERMISSIONS } from 'constants/permissions-and-roles';

const CategoriesAndBrands = Loadable(lazy(() => import('pages/categories-and-brands')));
const ItemsManagement = Loadable(lazy(() => import('pages/item-management')));
const StockRoutes = {
  //   path: '',
  element: <MainLayout />,
  children: [
    {
      path: 'categories-and-brands',
      element: (
        <PrivateRoute permission={PERMISSIONS.PERMISSION_VIEW_CATEGORIES_AND_BRANDS}>
          <CategoriesAndBrands />
        </PrivateRoute>
      )
    },
    {
      path: 'stock',
      element: (
        <PrivateRoute permission={PERMISSIONS.PERMISSION_VIEW_STOCK}>
          <StockManagement />
        </PrivateRoute>
      )
    },
    {
      path: 'items',
      element: (
        <PrivateRoute permission={PERMISSIONS.PERMISSION_VIEW_ITEMS}>
          <ItemsManagement />
        </PrivateRoute>
      )
    },
    {
      path: 'suppliers',
      element: (
        <PrivateRoute permission={PERMISSIONS.PERMISSION_VIEW_SUPPLIERS}>
          <SupplierManagement />
        </PrivateRoute>
      )
    }
  ]
};

export default StockRoutes;
