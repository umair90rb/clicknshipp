// assets
import { DashboardOutlined, UsergroupAddOutlined } from '@ant-design/icons';

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
    },
    {
      id: 'users',
      title: 'Users',
      type: 'item',
      url: '/users',
      icon: UsergroupAddOutlined,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
