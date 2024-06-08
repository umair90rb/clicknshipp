import { PERMISSIONS } from 'constants/permissions-and-roles';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';

const store = {
  id: 'group-store',
  title: 'Store',
  type: 'group',
  children: [
    {
      id: 'items',
      title: 'Items',
      type: 'item',
      url: '/items',
      permission: PERMISSIONS.PERMISSION_VIEW_ITEMS,
      icon: Inventory2OutlinedIcon,
      breadcrumbs: false
    },
    {
      id: 'stock',
      title: 'Stock',
      type: 'item',
      url: '/stock',
      permission: PERMISSIONS.PERMISSION_VIEW_STOCK,
      icon: InventoryOutlinedIcon,
      breadcrumbs: false
    },

    {
      id: 'suppliers',
      title: 'Suppliers',
      type: 'item',
      url: '/suppliers',
      permission: PERMISSIONS.PERMISSION_VIEW_SUPPLIERS,
      icon: BusinessCenterOutlinedIcon,
      breadcrumbs: false
    }
  ]
};

export default store;
