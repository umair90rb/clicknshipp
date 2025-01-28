import { PERMISSIONS } from 'constants/permissions-and-roles';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import EqualizerOutlinedIcon from '@mui/icons-material/EqualizerOutlined';

const dashboard = {
  id: 'group-dashboard',
  title: 'Analytics',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard',
      permission: PERMISSIONS.PERMISSION_VIEW_ADMIN_DASHBOARD,
      icon: DashboardOutlinedIcon,
      breadcrumbs: false
    },
    {
      id: 'reporting',
      title: 'Reporting',
      type: 'item',
      url: '/reporting',
      permission: PERMISSIONS.PERMISSION_VIEW_REPORTING,
      icon: EqualizerOutlinedIcon,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
