// assets
import { PlusCircleOutlined, CodeSandboxOutlined, CustomerServiceOutlined, BorderOutlined } from '@ant-design/icons';
import { PERMISSIONS } from 'constants/permissions-and-roles';

const order = {
  id: 'order-dashboard',
  title: 'Order Mangement',
  type: 'group',
  children: [
    {
      id: 'order/all',
      title: 'Orders',
      type: 'item',
      url: '/order/all',
      permission: PERMISSIONS.PERMISSION_VIEW_ALL_ORDERS,
      icon: CodeSandboxOutlined,
      breadcrumbs: false
    },
    {
      id: 'create-order',
      title: 'Create order',
      type: 'item',
      url: '/order/new',
      permission: PERMISSIONS.PERMISSION_CREATE_ORDER,
      icon: PlusCircleOutlined,
      breadcrumbs: false
    },
    {
      id: 'customer/all',
      title: 'Customers',
      type: 'item',
      url: '/customer/all',
      permission: PERMISSIONS.PERMISSION_VIEW_CUSTOMERS,
      icon: CustomerServiceOutlined,
      breadcrumbs: false
    }
  ]
};

export default order;
