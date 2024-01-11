// third-party
import { combineReducers } from 'redux';
import { composeWithDevTools } from '@redux-devtools/extension';

// project import
import menu from './slices/menu';
import auth from './slices/auth/authSlice';
import user from './slices/user/userSlice';
import customer from './slices/customer/customerSlice';
import order from './slices/order/orderSlice';
import util from './slices/util/utilSlice';
import brand from './slices/brand/brandSlice';
import category from './slices/category/categorySlice';
import item from './slices/item/itemSlice';
import supplier from './slices/supplier/supplierSlice';
import stock from './slices/stock/stockSlice';
import chanel from './slices/chanel/chanelSlice';
import city from './slices/city/citySlice';
// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers(
  { menu, auth, user, util, order, customer, supplier, item, stock, brand, category, chanel, city },
  composeWithDevTools()
);

export default reducers;
