import { ApartmentOutlined, UserSwitchOutlined, AppstoreOutlined, DeploymentUnitOutlined } from '@ant-design/icons';
import { PERMISSIONS } from 'constants/permissions-and-roles';

const store = {
  id: 'group-store',
  title: 'Store',
  type: 'group',
  children: [
    {
      id: 'items',
      title: 'Items',
      type: 'item',
      url: '/items',
      permission: PERMISSIONS.PERMISSION_VIEW_ITEMS,
      icon: AppstoreOutlined,
      breadcrumbs: false
    },
    {
      id: 'stock',
      title: 'Stock',
      type: 'item',
      url: '/stock',
      permission: PERMISSIONS.PERMISSION_VIEW_STOCK,
      icon: DeploymentUnitOutlined,
      breadcrumbs: false
    },
    {
      id: 'category',
      title: 'Categories & Brands',
      type: 'item',
      url: '/categories-and-brands',
      permission: PERMISSIONS.PERMISSION_VIEW_CATEGORIES_AND_BRANDS,
      icon: ApartmentOutlined,
      breadcrumbs: false
    },
    {
      id: 'suppliers',
      title: 'Suppliers',
      type: 'item',
      url: '/suppliers',
      permission: PERMISSIONS.PERMISSION_VIEW_SUPPLIERS,
      icon: UserSwitchOutlined,
      breadcrumbs: false
    }
  ]
};

export default store;
