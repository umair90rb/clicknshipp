// assets
import { UsergroupAddOutlined } from '@ant-design/icons';
import { PERMISSIONS } from 'constants/permissions-and-roles';

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
      permission: PERMISSIONS.PERMISSION_VIEW_USERS,
      icon: UsergroupAddOutlined,
      breadcrumbs: false
    }
  ]
};

export default user;
