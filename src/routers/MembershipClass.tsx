import { lazy } from 'react';
import { Outlet, RouteObject } from 'react-router-dom';
import Loadable from './Loadable';

const MembershipList = Loadable(lazy(() => import('views/Membership-class')));
const CreateMembershipClass = Loadable(
  lazy(() => import('views/Membership-class/Create'))
);
const DetailsMembershipClass = Loadable(
  lazy(() => import('views/Membership-class/Details'))
);
const UpdateMembershipClass = Loadable(
  lazy(() => import('views/Membership-class/Edit'))
);

const MembershipClassRoutes: RouteObject = {
  path: 'membershipClass',
  element: <Outlet />,
  children: [
    {
      path: 'list',
      children: [
        { index: true, element: <MembershipList /> },
        { path: 'create', element: <CreateMembershipClass /> },
        { path: ':id', element: <DetailsMembershipClass /> },
        { path: ':id/edit', element: <UpdateMembershipClass /> },
      ],
    },
  ],
};

export default MembershipClassRoutes;
