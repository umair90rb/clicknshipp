import { PERMISSIONS } from 'constants/permissions-and-roles';

// assets
import { ForkOutlined } from '@ant-design/icons';
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
      icon: ForkOutlined,
      breadcrumbs: false
    }
  ]
};

export default setting;
