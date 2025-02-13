import { PERMISSIONS } from 'constants/permissions-and-roles';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import DeviceHubOutlinedIcon from '@mui/icons-material/DeviceHubOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import WarehouseOutlinedIcon from '@mui/icons-material/WarehouseOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';

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
      id: 'raw-material',
      title: 'Materials',
      type: 'item',
      url: '/raw-material',
      permission: PERMISSIONS.PERMISSION_READ_MATERIAL,
      icon: DeviceHubOutlinedIcon,
      breadcrumbs: false
    },
    {
      id: 'bom',
      title: 'Bill of Material',
      type: 'item',
      url: '/bom',
      permission: PERMISSIONS.PERMISSION_READ_BOM,
      icon: ReceiptOutlinedIcon,
      breadcrumbs: false
    },
    {
      id: 'sales-order',
      title: 'Sales Order',
      type: 'item',
      url: '/sales-order',
      permission: PERMISSIONS.PERMISSION_READ_SALES_ORDER,
      icon: AttachMoneyOutlinedIcon,
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
    },
    {
      id: 'locations-and-units',
      title: 'Locations & Units',
      type: 'item',
      url: '/locations-and-units',
      permission: PERMISSIONS.PERMISSION_READ_LOCATION_AND_UNITS,
      icon: WarehouseOutlinedIcon,
      breadcrumbs: false
    }
  ]
};

export default store;
