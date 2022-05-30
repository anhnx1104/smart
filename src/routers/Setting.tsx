import { Outlet, RouteObject } from 'react-router-dom';
import Loadable from './Loadable';
import { lazy } from 'react';

const CompanyProfile = Loadable(lazy(() => import('views/Setting/Company')));
const Identity = Loadable(lazy(() => import('views/Setting/BrandIdentity')));
const Member = Loadable(lazy(() => import('views/Setting/Member')));
const Point = Loadable(lazy(() => import('views/Setting/Point')));

const SettingRoutes: RouteObject = {
  path: 'settings',
  element: <Outlet />,
  children: [
    { path: 'company/:id/edit', element: <CompanyProfile /> },
    { path: 'company/:id/identity', element: <Identity /> },
    { path: 'company/:id/member', element: <Member /> },
    { path: 'company/point', element: <Point /> },
  ],
};

export default SettingRoutes;
