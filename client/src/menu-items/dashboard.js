import { DashboardOutlined, FileSearchOutlined } from '@ant-design/icons';

const dashboard = {
  id: 'group-dashboard',
  title: 'Reproting',
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
      id: 'reporting',
      title: 'Reporting',
      type: 'item',
      url: '/dashboard',
      icon: FileSearchOutlined,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
