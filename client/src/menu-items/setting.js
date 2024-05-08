import { PERMISSIONS } from 'constants/permissions-and-roles';

// assets
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
const setting = {
  id: 'chanel-dashboard',
  title: 'Setting',
  type: 'group',
  children: [
    {
      id: 'chanel',
      title: 'Sales Chanel',
      type: 'item',
      url: '/chanel',
      permission: PERMISSIONS.PERMISSION_VIEW_SALES_CHANEL,
      icon: AccountTreeOutlinedIcon,
      breadcrumbs: false
    },
    {
      id: 'delivery-service-accounts',
      title: 'Delivery Service Accounts',
      type: 'item',
      url: '/delivery-service-accounts',
      permission: PERMISSIONS.PERMISSION_VIEW_DELIVERY_ACCOUNTS,
      icon: LocalShippingOutlinedIcon,
      breadcrumbs: false
    }
  ]
};

export default setting;
