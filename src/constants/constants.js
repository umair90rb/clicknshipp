export const PERMISSIONS = {
  PERMISSION_VIEW_ADMIN_DASHBOARD: "view-admin-dashboard",
  PERMISSION_VIEW_REPORTING: "view-reporting",

  PERMISSION_VIEW_ALL_ORDERS: "view-all-orders",
  PERMISSION_VIEW_ORDERS: "view-orders",
  PERMISSION_CREATE_ORDER: "create-order",
  PERMISSION_CREATE_BULK_ORDER: "create-bulk-order",
  PERMISSION_UPDATE_ORDER: "update-order",
  PERMISSION_DELETE_ORDER: "delete-order",
  PERMISSION_BULK_ORDER_DELETE: "bulk-order-delete",
  PERMISSION_ASSIGN_ORDERS: "assign-orders",

  PERMISSION_VIEW_ITEMS: "view-items",
  PERMISSION_CREATE_ITEM: "create-item",
  PERMISSION_UPDATE_ITEM: "update-item",
  PERMISSION_DELETE_ITEM: "delete-item",
  PERMISSION_BULK_CREATE_ITEMS: "bulk-create-items",

  PERMISSION_VIEW_STOCK: "view-stock",
  PERMISSION_VIEW_STOCK_HISTORY: "view-stock-history",
  PERMISSION_RECEIVE_STOCK: "receive-stock",

  PERMISSION_VIEW_CATEGORIES_AND_BRANDS: "view-categories-and-brands",

  PERMISSION_CREATE_CATEGORY: "create-category",
  PERMISSION_UPDATE_CATEGORY: "update-category",
  PERMISSION_DELETE_CATEGORY: "delete-category",

  PERMISSION_CREATE_BRAND: "create-brand",
  PERMISSION_UPDATE_BRAND: "update-brand",
  PERMISSION_DELETE_BRAND: "delete-brand",

  PERMISSION_VIEW_SUPPLIERS: "view-suppliers",
  PERMISSION_CREATE_SUPPLIER: "create-supplier",
  PERMISSION_UPDATE_SUPPLIER: "update-supplier",
  PERMISSION_DELETE_SUPPLIER: "delete-supplier",

  PERMISSION_VIEW_CUSTOMERS: "view-customers",
  PERMISSION_CREATE_CUSTOMER: "create-customer",
  PERMISSION_UPDATE_CUSTOMER: "update-customer",
  PERMISSION_DELETE_CUSTOMER: "delete-customer",

  PERMISSION_VIEW_SALES_CHANEL: "view-sales-channel",
  PERMISSION_CREATE_SALES_CHANEL: "create-sales-channel",
  PERMISSION_UPDATE_SALES_CHANEL: "update-sales-channel",
  PERMISSION_DELETE_SALES_CHANEL: "delete-sales-channel",

  PERMISSION_VIEW_USERS: "view-users",
  PERMISSION_CREATE_USER: "create-user",
  PERMISSION_UPDATE_USER: "update-user",
  PERMISSION_DELETE_USER: "delete-user",

  PERMISSION_CREATE_ROLE: "create-role",
  PERMISSION_UPDATE_ROLE: "update-role",

  PERMISSION_VIEW_DELIVERY_ACCOUNTS: "view-delivery-accounts",
  PERMISSION_CREATE_DELIVERY_ACCOUNTS: "create-delivery-accounts",
  PERMISSION_UPDATE_DELIVERY_ACCOUNTS: "update-delivery-accounts",
  PERMISSION_DELETE_DELIVERY_ACCOUNTS: "delete-delivery-accounts",
};

export const ROLES = {
  ROLE_SUPER_ADMIN: "Super Admin",
};

export const order_data_keys = [
  "order_number",
  "total_price",
  "total_tax",
  "subtotal_price",
  "total_price",
  "total_discounts",
  "created_at",
];
export const address_data_keys = [
  "address1",
  "city",
  "zip",
  "name",
  "phone",
  "province",
  "country",
  "address2",
  "company",
  "latitude",
  "longitude",
  "country_code",
  "province_code",
];

export const customer_data_keys = [
  "id",
  "email",
  "first_name",
  "last_name",
  "note",
  "phone",
];

export const item_data_keys = [
  "name",
  "price",
  "grams",
  "quantity",
  "product_id",
  "variant_id",
  "sku",
  "total_discount",
];

export const FILTER_COLUMNS = {
  order_number: "order_number",
  status: "status",
  tags: "tags",
  customer: "$customer.first_name$",
  phone: "$customer.phone$",
  agent: "user_id",
  address: "$address.address1$",
  city: "$address.city$",
  total_price: "total_price",
  total_tax: "total_tax",
  total_discounts: "total_discounts",
  createdAt: "createdAt",
  assignedAt: "assignedAt",
  chanel: "$chanel.name$",
};
