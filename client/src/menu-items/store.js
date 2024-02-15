import { ApartmentOutlined, DingdingOutlined, UserSwitchOutlined, AppstoreOutlined, DeploymentUnitOutlined } from '@ant-design/icons';
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
      icon: AppstoreOutlined,
      breadcrumbs: false
    },
    {
      id: 'stock',
      title: 'Stock',
      type: 'item',
      url: '/stock',
      icon: DeploymentUnitOutlined,
      breadcrumbs: false
    },
    {
      id: 'category',
      title: 'Categories & Brands',
      type: 'item',
      url: '/categories-and-brands',
      icon: ApartmentOutlined,
      breadcrumbs: false
    },
    {
      id: 'suppliers',
      title: 'Suppliers',
      type: 'item',
      url: '/suppliers',
      icon: UserSwitchOutlined,
      breadcrumbs: false
    }
  ]
};

export default store;
