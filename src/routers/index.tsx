import PrivateRoute from 'components/common/PrivateRoute';
import PublicRoute from 'components/common/PublicRoute';
import TokenRoute from 'components/common/TokenRoute';
import DashboardLayout from 'layouts/Dashboard';
import MainLayout from 'layouts/Main';
import { lazy } from 'react';
import { Navigate, RouteObject, useRoutes } from 'react-router-dom';
import CRUDRoutes from './CRUDExample';
import Loadable from './Loadable';
import UserRoutes from './User';
import SettingRoutes from './Setting';
import MembershipClassRoutes from './MembershipClass';
import MembersRoute from './Members';

// Authentication
const Login = Loadable(lazy(() => import('views/Login')));
const ForgotPassword = Loadable(lazy(() => import('views/ForgotPassword')));
const ResetPassword = Loadable(lazy(() => import('views/RenewPassword')));

const Home = Loadable(lazy(() => import('views/Home')));

const routes: RouteObject[] = [
  {
    path: 'login',
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: 'forgot-password',
    element: (
      <PublicRoute>
        <ForgotPassword />
      </PublicRoute>
    ),
  },
  {
    path: 'reset-password',
    element: (
      <TokenRoute>
        <ResetPassword />
      </TokenRoute>
    ),
  },
  /* if has other public route, */
  /* pust it in PublicRoute component look like login route */

  /*if route need dashboard or header layout, push it in PrivateRote */
  {
    path: '/',
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <Home /> },
      CRUDRoutes,
      UserRoutes,
      SettingRoutes,
      MembershipClassRoutes,
      MembersRoute,
      //if has other Routes, push it in here
    ],
  },

  //every route not defined
  {
    path: '*',
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/" /> },
      { path: '*', element: <Navigate to="/" /> },
    ],
  },
];

const Router = () => {
  const element = useRoutes(routes);
  return element;
};

export default Router;
