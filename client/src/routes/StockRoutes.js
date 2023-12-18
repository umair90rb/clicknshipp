import { lazy } from 'react';
import Loadable from 'components/Loadable';
import { PrivateRoute } from 'components/PrivateRoute';
import MainLayout from 'layout/MainLayout/index';
import SupplierManagement from 'pages/supplier-management/index';
import StockManamgement from 'pages/stock/index';

const CategoriesAndBrands = Loadable(lazy(() => import('pages/categories-and-brands')));
const ItemsManagement = Loadable(lazy(() => import('pages/item-management')));
const StockRoutes = {
  //   path: '',
  element: <MainLayout />,
  children: [
    {
      path: 'categories-and-brands',
      element: (
        <PrivateRoute>
          <CategoriesAndBrands />
        </PrivateRoute>
      )
    },
    {
      path: 'stock',
      element: (
        <PrivateRoute>
          <StockManamgement />
        </PrivateRoute>
      )
    },
    {
      path: 'items',
      element: (
        <PrivateRoute>
          <ItemsManagement />
        </PrivateRoute>
      )
    },
    {
      path: 'suppliers',
      element: (
        <PrivateRoute>
          <SupplierManagement />
        </PrivateRoute>
      )
    }
  ]
};

export default StockRoutes;
