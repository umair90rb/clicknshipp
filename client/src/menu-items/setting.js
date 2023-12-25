// assets
import { ForkOutlined } from '@ant-design/icons';
const setting = {
  id: 'chanel-dashboard',
  title: 'Setting',
  type: 'group',
  children: [
    {
      id: 'chanel',
      title: 'Manage Sales Chanel',
      type: 'item',
      url: '/chanel',
      icon: ForkOutlined,
      breadcrumbs: false
    }
  ]
};

export default setting;
