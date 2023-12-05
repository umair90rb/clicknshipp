// assets
import { PlusCircleOutlined, CodeSandboxOutlined } from '@ant-design/icons';
const order = {
  id: 'order-dashboard',
  title: 'Order Mangement',
  type: 'group',
  children: [
    {
      id: 'order/all',
      title: 'All Orders',
      type: 'item',
      url: '/order/all',
      icon: CodeSandboxOutlined,
      breadcrumbs: false
    },
    {
      id: 'create-order',
      title: 'Create New Order',
      type: 'item',
      url: '/order/new',
      icon: PlusCircleOutlined,
      breadcrumbs: false
    }
  ]
};

export default order;
