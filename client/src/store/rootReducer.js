import { combineReducers } from 'redux';
import { composeWithDevTools } from '@redux-devtools/extension';
import menu from './slices/menu';
import auth from './slices/auth/authSlice';
import user from './slices/user/userSlice';
import customer from './slices/customer/customerSlice';
import order from './slices/order/orderSlice';
import util from './slices/util/utilSlice';
import brand from './slices/brand/brandSlice';
import department from './slices/department/departmentSlice';
import designation from './slices/designation/designationSlice';
import allowance from './slices/allowance/allowanceSlice';
import employee from './slices/employee/employeeSlice';
import acl from './slices/acl/aclSlice';
import category from './slices/category/categorySlice';
import item from './slices/item/itemSlice';
import supplier from './slices/supplier/supplierSlice';
import stock from './slices/stock/stockSlice';
import chanel from './slices/chanel/chanelSlice';
import city from './slices/city/citySlice';
import dashboard from './slices/dashboard/dashboardSlice';
import deliveryServiceAccounts from './slices/deliveryServicesAccounts/deliveryServicesAccountsSlice';
import search from './slices/search/searchSlice';
import report from './slices/report/reportSlice';
import location from './slices/location/locationSlice';
import unitOfMeasure from './slices/unitOfMeasure/unitOfMeasureSlice';
import rawMaterial from './slices/rawMaterial/rawMaterialSlice';
import billOfMaterial from './slices/billOfMaterial/billOfMaterialSlice';
import salesOrder from './slices/salesOrder/salesOrderSlice';

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
    salesOrder
  },
  composeWithDevTools()
);

export default reducers;
