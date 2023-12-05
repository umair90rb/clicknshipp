// assets
import { DashboardOutlined } from '@ant-design/icons';

const dashboard = {
  id: 'group-dashboard',
  title: 'Main',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard',
      icon: DashboardOutlined,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
