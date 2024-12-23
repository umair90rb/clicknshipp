import { lazy } from 'react';
import Loadable from 'components/Loadable';
import { PrivateRoute } from 'components/PrivateRoute';
import MainLayout from 'layout/MainLayout/index';
import SupplierManagement from 'pages/supplier-management/index';
import StockManagement from 'pages/stock/index';
import LocationsAndUnits from 'pages/locations-and-units';
import { PERMISSIONS } from 'constants/permissions-and-roles';

const CategoriesAndBrands = Loadable(lazy(() => import('pages/categories-and-brands')));
const ItemsManagement = Loadable(lazy(() => import('pages/item-management')));
const RawMaterialManagement = Loadable(lazy(() => import('pages/raw-material-management')));
const BOM = Loadable(lazy(() => import('pages/bill-of-material')));
const SalesOrder = Loadable(lazy(() => import('pages/sales-order')));
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
      path: 'bom',
      element: (
        <PrivateRoute permission={PERMISSIONS.PERMISSION_VIEW_STOCK}>
          <BOM />
        </PrivateRoute>
      )
    },
    {
      path: 'sales-order',
      element: (
        <PrivateRoute permission={PERMISSIONS.PERMISSION_VIEW_STOCK}>
          <SalesOrder />
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
      path: 'raw-material',
      element: (
        <PrivateRoute permission={PERMISSIONS.PERMISSION_VIEW_ITEMS}>
          <RawMaterialManagement />
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
    },

    {
      path: 'locations-and-units',
      element: (
        <PrivateRoute permission={PERMISSIONS.PERMISSION_VIEW_SUPPLIERS}>
          <LocationsAndUnits />
        </PrivateRoute>
      )
    }
  ]
};

export default StockRoutes;
