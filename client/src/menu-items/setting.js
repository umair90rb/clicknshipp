import { PERMISSIONS } from 'constants/permissions-and-roles';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
const setting = {
  id: 'chanel-dashboard',
  title: 'Setting',
  type: 'group',
  children: [
    {
      id: 'category',
      title: 'Categories & Brands',
      type: 'item',
      url: '/categories-and-brands',
      permission: PERMISSIONS.PERMISSION_VIEW_CATEGORIES_AND_BRANDS,
      icon: CategoryOutlinedIcon,
      breadcrumbs: false
    },
    {
      id: 'chanel',
      title: 'Sales Chanel',
      type: 'item',
      url: '/chanel',
      permission: PERMISSIONS.PERMISSION_VIEW_SALES_CHANEL,
      icon: StorefrontOutlinedIcon,
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
