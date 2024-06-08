import { PERMISSIONS } from 'constants/permissions-and-roles';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';

const order = {
  id: 'order-dashboard',
  title: 'Order Management',
  type: 'group',
  children: [
    {
      id: 'order/all',
      title: 'Orders',
      type: 'item',
      url: '/order/all',
      permission: PERMISSIONS.PERMISSION_VIEW_ORDERS,
      icon: ShoppingCartOutlinedIcon,
      breadcrumbs: false
    },
    {
      id: 'create-order',
      title: 'Whatsapp Order',
      type: 'item',
      url: '/order/new',
      permission: PERMISSIONS.PERMISSION_CREATE_ORDER,
      icon: WhatsAppIcon,
      breadcrumbs: false
    },
    {
      id: 'customer/all',
      title: 'Customers',
      type: 'item',
      url: '/customer/all',
      permission: PERMISSIONS.PERMISSION_VIEW_CUSTOMERS,
      icon: PersonOutlinedIcon,
      breadcrumbs: false
    }
  ]
};

export default order;
