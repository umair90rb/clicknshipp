import { composeWithDevTools } from '@redux-devtools/extension';
import { combineReducers } from 'redux';
import acl from './slices/acl/aclSlice';
import allowance from './slices/allowance/allowanceSlice';
import auth from './slices/auth/authSlice';
import billOfMaterial from './slices/billOfMaterial/billOfMaterialSlice';
import brand from './slices/brand/brandSlice';
import category from './slices/category/categorySlice';
import chanel from './slices/chanel/chanelSlice';
import city from './slices/city/citySlice';
import customer from './slices/customer/customerSlice';
import dashboard from './slices/dashboard/dashboardSlice';
import deliveryServiceAccounts from './slices/deliveryServicesAccounts/deliveryServicesAccountsSlice';
import department from './slices/department/departmentSlice';
import designation from './slices/designation/designationSlice';
import employee from './slices/employee/employeeSlice';
import item from './slices/item/itemSlice';
import location from './slices/location/locationSlice';
import log from './slices/log/logSlice';
import menu from './slices/menu';
import notification from './slices/notification/notificationSlice';
import order from './slices/order/orderSlice';
import rawMaterial from './slices/rawMaterial/rawMaterialSlice';
import report from './slices/report/reportSlice';
import salesOrder from './slices/salesOrder/salesOrderSlice';
import search from './slices/search/searchSlice';
import stock from './slices/stock/stockSlice';
import supplier from './slices/supplier/supplierSlice';
import unitOfMeasure from './slices/unitOfMeasure/unitOfMeasureSlice';
import user from './slices/user/userSlice';
import util from './slices/util/utilSlice';

const reducers = combineReducers(
  {
    auth,
    user,
    acl,
    order,
    customer,
    supplier,
    item,
    stock,
    location,
    unitOfMeasure,
    rawMaterial,
    brand,
    category,
    chanel,
    city,
    dashboard,
    deliveryServiceAccounts,
    search,
    report,
    department,
    designation,
    allowance,
    employee,
    menu,
    util,
    billOfMaterial,
    salesOrder,
    notification,
    log
  },
  composeWithDevTools()
);

export default reducers;
