import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import { PERMISSIONS } from 'constants/permissions-and-roles';

const hrm = {
  id: 'group-hrm',
  title: 'HRM',
  type: 'group',
  children: [
    {
      id: 'employee',
      title: 'Employees',
      type: 'item',
      url: '/employee/all',
      permission: PERMISSIONS.PERMISSION_VIEW_USERS,
      icon: BadgeOutlinedIcon,
      breadcrumbs: false
    }
  ]
};

export default hrm;
