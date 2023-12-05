// third-party
import { combineReducers } from 'redux';
import { composeWithDevTools } from '@redux-devtools/extension';

// project import
import menu from './slices/menu';
import auth from './slices/auth/authSlice';
import user from './slices/user/userSlice';
import order from './slices/order/orderSlice';
import util from './slices/util/utilSlice';
// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({ menu, auth, user, util, order }, composeWithDevTools());

export default reducers;
