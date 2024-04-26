import { DashboardOutlined, FileSearchOutlined } from '@ant-design/icons';
import { permissions } from 'constants/roleAndPermissions';

const dashboard = {
  id: 'group-dashboard',
  title: 'Reporting',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard',
      permission: permissions.viewAdminDashboard,
      icon: DashboardOutlined,
      breadcrumbs: false
    }
    // {
    //   id: 'reporting',
    //   title: 'Reporting',
    //   type: 'item',
    //   url: '/reporting',
    //   permission: permissions.viewReporting,
    //   icon: FileSearchOutlined,
    //   breadcrumbs: false
    // }
  ]
};

export default dashboard;
