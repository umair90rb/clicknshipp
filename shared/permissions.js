const permissions = {
  admin: {
    view_dashboard: 'view-admin-dashboard',
    view_reporting: 'view-reporting',
  },
  orders: {
    view_all: 'view-all-orders',
    view: 'view-orders',
    create: 'create-order',
    create_bulk: 'create-bulk-order',
    update: 'update-order',
    delete: 'delete-order',
    bulk_delete: 'bulk-order-delete',
    bulk_booking: 'bulk-order-booking',
    assign: 'assign-orders',
  },
  items: {
    view: 'view-items',
    create: 'create-item',
    update: 'update-item',
    delete: 'delete-item',
    bulk_create: 'bulk-create-items',
  },
  stock: {
    view: 'view-stock',
    view_history: 'view-stock-history',
    receive: 'receive-stock',
    receive_return: 'receive-stock-return',
    add_damage: 'add-stock-damage',
  },
  categories: {
    view: 'view-categories-and-brands',
    create: 'create-category',
    update: 'update-category',
    delete: 'delete-category',
  },
  brands: {
    create: 'create-brand',
    update: 'update-brand',
    delete: 'delete-brand',
  },
  suppliers: {
    view: 'view-suppliers',
    create: 'create-supplier',
    update: 'update-supplier',
    delete: 'delete-supplier',
  },
  customers: {
    view: 'view-customers',
    create: 'create-customer',
    update: 'update-customer',
    delete: 'delete-customer',
  },
  sales_channel: {
    view: 'view-sales-channel',
    create: 'create-sales-channel',
    update: 'update-sales-channel',
    delete: 'delete-sales-channel',
  },
  users: {
    view: 'view-users',
    create: 'create-user',
    update: 'update-user',
    delete: 'delete-user',
  },
  roles: {
    create: 'create-role',
    update: 'update-role',
  },
  delivery_accounts: {
    view: 'view-delivery-accounts',
    create: 'create-delivery-accounts',
    update: 'update-delivery-accounts',
    delete: 'delete-delivery-accounts',
  },
  locations: {
    view: 'view-locations',
    create: 'create-location',
    update: 'update-location',
    delete: 'delete-location',
  },
  unit_of_measure: {
    view: 'view-unit-of-measures',
    create: 'create-unit-of-measure',
    update: 'update-unit-of-measure',
    delete: 'delete-unit-of-measure',
  },
  raw_materials: {
    view: 'view-raw-materials',
    create: 'create-raw-material',
    update: 'update-raw-material',
    delete: 'delete-raw-material',
  },
  batches: {
    view: 'view-batches',
    create: 'create-batch',
    update: 'update-batch',
    delete: 'delete-batch',
  },
  materials: {
    read: 'read-material',
    write: 'write-material',
  },
  bom: {
    read: 'read-bom',
    write: 'write-bom',
  },
  sales_orders: {
    read: 'read-sales-order',
    write: 'write-sales-order',
  },
  return_management: 'return-management',
};

export default permissions;
