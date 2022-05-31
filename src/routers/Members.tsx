import { Outlet, RouteObject } from 'react-router-dom';
import Loadable from './Loadable';
import { lazy } from 'react';
import DetailsMembershipClassForm from '../views/Membership-class/Details/DetailsMembershipClassForm';
import MemberDetail from '../views/Members/MeberDetail';

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
      path: ':memberId/edit/:id',
      element: <EditMember />,
    },{
      path: ':memberId/:id',
      element: <MemberDetail/>,
    },

    {
      path: ':create',
      element: <CreateMember />,
    },
  ],
};

export default MembersRoute;
