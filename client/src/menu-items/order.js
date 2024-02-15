// assets
import { PlusCircleOutlined, CodeSandboxOutlined, CustomerServiceOutlined, BorderOutlined } from '@ant-design/icons';

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
      icon: CodeSandboxOutlined,
      breadcrumbs: false
    },
    {
      id: 'create-order',
      title: 'Create order',
      type: 'item',
      url: '/order/new',
      icon: PlusCircleOutlined,
      breadcrumbs: false
    },
    {
      id: 'customer/all',
      title: 'Customers',
      type: 'item',
      url: '/customer/all',
      icon: CustomerServiceOutlined,
      breadcrumbs: false
    }
  ]
};

export default order;
