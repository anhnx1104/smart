import { Outlet, RouteObject } from 'react-router-dom';
import Loadable from './Loadable';
import { lazy } from 'react';

// User Profile
const Members = Loadable(lazy(() => import('views/Members')));
const EditMember = Loadable(lazy(() => import('views/Members/EditMember')));
const CreateMember = Loadable(lazy(() => import('views/Members/CreateMember')));

const MembersRoute: RouteObject = {
  path: 'members',
  element: <Outlet />,
  children: [
    {
      index: true,
      element: <Members />,
    },
    {
      path: ':memberId/edit',
      element: <EditMember />,
    },
    {
      path: ':create',
      element: <CreateMember />,
    },
  ],
};

export default MembersRoute;
