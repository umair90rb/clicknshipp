// assets
import { UsergroupAddOutlined } from '@ant-design/icons';

const user = {
  id: 'group-user',
  title: 'Users',
  type: 'group',
  children: [
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

export default user;
