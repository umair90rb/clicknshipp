import { useRoutes } from 'react-router-dom';

// project import
import LoginRoutes from './LoginRoutes';
import MainRoutes from './MainRoutes';
import OrderRoutes from './OrderRoutes';
import CustomerRoutes from './CustomerRoutes';
import useAuth from 'hooks/useAuth';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  return useRoutes([MainRoutes, LoginRoutes, OrderRoutes, CustomerRoutes]);
}
