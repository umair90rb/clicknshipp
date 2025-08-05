import AssignmentReturnOutlinedIcon from '@mui/icons-material/AssignmentReturnOutlined';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import DescriptionIcon from '@mui/icons-material/Description';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { PERMISSIONS } from 'constants/permissions-and-roles';

const order = {
  id: 'order-dashboard',
  title: 'Order Management',
  type: 'group',
  children: [
    {
      id: 'order/logs',
      title: 'Order Logs',
      type: 'item',
      url: '/order/logs',
      permission: PERMISSIONS.PERMISSION_VIEW_ORDERS_LOGS,
      icon: DescriptionIcon,
      breadcrumbs: false
    },
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
      id: 'order/delivered',
      title: 'Delivered',
      type: 'item',
      url: '/order/delivered',
      permission: PERMISSIONS.PERMISSION_VIEW_ORDERS,
      icon: CheckBoxOutlinedIcon,
      breadcrumbs: false
    },
    {
      id: 'order/return',
      title: 'Return',
      type: 'item',
      url: '/order/return',
      permission: PERMISSIONS.PERMISSION_RETURN_MANAGEMENT,
      icon: AssignmentReturnOutlinedIcon,
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
