export const PERMISSIONS = {
  PERMISSIONS_GET_AGENT_REPORT: 'get-agent-report',
  PERMISSIONS_GET_PRODUCT_REPORT: 'get-product-report',
  PERMISSIONS_GET_BOOKING_REPORT: 'get-booking-report',
  PERMISSIONS_GET_FOC_REPORT: 'get-foc-report',
  PERMISSIONS_GET_CHANNEL_REPORT: 'get-channel-report',
  PERMISSIONS_GET_INCENTIVE_REPORT: 'get-incentive-report',
  PERMISSIONS_GET_COURIER_DELIVERY_REPORT: 'get-courier-delivery-report',
  PERMISSIONS_GET_STOCK_REPORT: 'get-stock-report',
  PERMISSIONS_GET_STOCK_DAMAGE_REPORT: 'get-stock-damage-report',

  PERMISSION_VIEW_ADMIN_DASHBOARD: 'view-admin-dashboard',
  PERMISSION_VIEW_REPORTING: 'view-reporting',

  PERMISSION_VIEW_ALL_ORDERS: 'view-all-orders',
  PERMISSION_VIEW_ORDERS: 'view-orders',
  PERMISSION_CREATE_ORDER: 'create-order',
  PERMISSION_CREATE_BULK_ORDER: 'create-bulk-order',
  PERMISSION_UPDATE_ORDER: 'update-order',
  PERMISSION_DELETE_ORDER: 'delete-order',
  PERMISSION_BULK_ORDER_DELETE: 'bulk-order-delete',
  PERMISSION_BULK_ORDER_BOOKING: 'bulk-order-booking',
  PERMISSION_ASSIGN_ORDERS: 'assign-orders',
  PERMISSION_EXPORT_ORDERS: 'export-orders',

  PERMISSION_VIEW_ITEMS: 'view-items',
  PERMISSION_CREATE_ITEM: 'create-item',
  PERMISSION_UPDATE_ITEM: 'update-item',
  PERMISSION_DELETE_ITEM: 'delete-item',
  PERMISSION_BULK_CREATE_ITEMS: 'bulk-create-items',
  PERMISSION_EXPORT_ITEMS: 'export-items',

  PERMISSION_VIEW_STOCK: 'view-stock',
  PERMISSION_VIEW_STOCK_HISTORY: 'view-stock-history',
  PERMISSION_EXPORT_STOCK: 'export-stock',
  PERMISSION_RECEIVE_STOCK: 'receive-stock',
  PERMISSION_RECEIVE_STOCK_RETURN: 'receive-stock-return',
  PERMISSION_ADD_STOCK_DAMAGE: 'add-stock-damage',

  PERMISSION_VIEW_CATEGORIES_AND_BRANDS: 'view-categories-and-brands',

  PERMISSION_CREATE_CATEGORY: 'create-category',
  PERMISSION_UPDATE_CATEGORY: 'update-category',
  PERMISSION_DELETE_CATEGORY: 'delete-category',

  PERMISSION_CREATE_BRAND: 'create-brand',
  PERMISSION_UPDATE_BRAND: 'update-brand',
  PERMISSION_DELETE_BRAND: 'delete-brand',

  PERMISSION_VIEW_SUPPLIERS: 'view-suppliers',
  PERMISSION_EXPORT_SUPPLIER: 'export-supplier',
  PERMISSION_CREATE_SUPPLIER: 'create-supplier',
  PERMISSION_UPDATE_SUPPLIER: 'update-supplier',
  PERMISSION_DELETE_SUPPLIER: 'delete-supplier',

  PERMISSION_VIEW_CUSTOMERS: 'view-customers',
  PERMISSION_CREATE_CUSTOMER: 'create-customer',
  PERMISSION_UPDATE_CUSTOMER: 'update-customer',
  PERMISSION_DELETE_CUSTOMER: 'delete-customer',
  PERMISSION_EXPORT_CUSTOMER: 'export-customer',

  PERMISSION_VIEW_SALES_CHANEL: 'view-sales-channel',
  PERMISSION_EXPORT_SALES_CHANEL: 'export-sales-channel',
  PERMISSION_CREATE_SALES_CHANEL: 'create-sales-channel',
  PERMISSION_UPDATE_SALES_CHANEL: 'update-sales-channel',
  PERMISSION_DELETE_SALES_CHANEL: 'delete-sales-channel',

  PERMISSION_VIEW_USERS: 'view-users',
  PERMISSION_CREATE_USER: 'create-user',
  PERMISSION_UPDATE_USER: 'update-user',
  PERMISSION_DELETE_USER: 'delete-user',
  PERMISSION_EXPORT_USER: 'export-user',

  PERMISSION_CREATE_ROLE: 'create-role',
  PERMISSION_UPDATE_ROLE: 'update-role',

  PERMISSION_VIEW_DELIVERY_ACCOUNTS: 'view-delivery-accounts',
  PERMISSION_CREATE_DELIVERY_ACCOUNTS: 'create-delivery-accounts',
  PERMISSION_UPDATE_DELIVERY_ACCOUNTS: 'update-delivery-accounts',
  PERMISSION_DELETE_DELIVERY_ACCOUNTS: 'delete-delivery-accounts',
  PERMISSION_EXPORT_DELIVERY_ACCOUNT: 'export-delivery-account',

  PERMISSION_VIEW_LOCATIONS: 'view-locations',
  PERMISSION_CREATE_LOCATION: 'create-location',
  PERMISSION_UPDATE_LOCATION: 'update-location',
  PERMISSION_DELETE_LOCATION: 'delete-location',

  PERMISSION_VIEW_UNIT_OF_MEASURES: 'view-unit-of-measures',
  PERMISSION_CREATE_UNIT_OF_MEASURE: 'create-unit-of-measure',
  PERMISSION_UPDATE_UNIT_OF_MEASURE: 'update-unit-of-measure',
  PERMISSION_DELETE_UNIT_OF_MEASURE: 'delete-unit-of-measure',

  PERMISSION_VIEW_RAW_MATERIALS: 'view-raw-materials',
  PERMISSION_CREATE_RAW_MATERIAL: 'create-raw-material',
  PERMISSION_UPDATE_RAW_MATERIAL: 'update-raw-material',
  PERMISSION_DELETE_RAW_MATERIAL: 'delete-raw-material',
  PERMISSION_EXPORT_RAW_MATERIAL: 'export-raw-material',

  PERMISSION_VIEW_BATCHES: 'view-batches',
  PERMISSION_CREATE_BATCH: 'create-batch',
  PERMISSION_UPDATE_BATCH: 'update-batch',
  PERMISSION_DELETE_BATCH: 'delete-batch',

  PERMISSION_READ_MATERIAL: 'read-material',
  PERMISSION_WRITE_MATERIAL: 'write-material',

  PERMISSION_READ_BOM: 'read-bom',
  PERMISSION_WRITE_BOM: 'write-bom',

  PERMISSION_READ_SALES_ORDER: 'read-sales-order',
  PERMISSION_WRITE_SALES_ORDER: 'write-sales-order',

  PERMISSION_READ_SUPPLIER: 'read-supplier',
  PERMISSION_WRITE_SUPPLIER: 'write-supplier',

  PERMISSION_RETURN_MANAGEMENT: 'return-management',
};

export const ROLES = {
  ROLE_SUPER_ADMIN: 'Super Admin',
};

export const order_data_keys = [
  'order_number',
  'total_price',
  'total_tax',
  'subtotal_price',
  'total_price',
  'total_discounts',
  'created_at',
];
export const address_data_keys = [
  'address1',
  'city',
  'zip',
  'name',
  'phone',
  'province',
  'country',
  'address2',
  'company',
  'latitude',
  'longitude',
  'country_code',
  'province_code',
];

export const customer_data_keys = [
  'id',
  'email',
  'first_name',
  'last_name',
  'note',
  'phone',
];

export const item_data_keys = [
  'name',
  'price',
  'grams',
  'quantity',
  'product_id',
  'variant_id',
  'sku',
  'total_discount',
];

export const FILTER_COLUMNS = {
  order_number: 'order_number',
  status: 'status',
  tags: 'tags',
  customer: '$customer.first_name$',
  phone: '$customer.phone$',
  items: '$items.name$',
  agent: 'user_id',
  address: '$address.address1$',
  city: '$address.city$',
  total_price: 'total_price',
  total_tax: 'total_tax',
  total_discounts: 'total_discounts',
  createdAt: 'createdAt',
  assignedAt: 'assignedAt',
  chanel: '$chanel.name$',
  chanel_id: 'chanel_id',
  brand_id: 'brand_id',
};
