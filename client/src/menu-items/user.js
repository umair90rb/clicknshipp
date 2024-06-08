import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
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
      icon: PeopleOutlineIcon,
      breadcrumbs: false
    }
  ]
};

export default user;
