import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SettingsIcon from '@mui/icons-material/Settings';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import LogoutConfirmDialog from 'components/common/LogoutConfirmDialog';
import useAuth from 'hooks/useAuth';
import useMounted from 'hooks/useMounted';
import { ReactNode, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import type { Role } from 'types/common';
import sleep from 'utils/sleep';
import SidebarItem from './SidebarItem';

interface SectionItem {
  title: string;
  children?: SectionItem[];
  info?: () => JSX.Element | null;
  icon?: ReactNode;
  path?: string;
  roles?: Role[];
}

const getSections = (): SectionItem[] => [
  // {
  //   title: 'Example',
  //   path: '/example', //path need to be the same as route to be highlighted
  //   icon: <PersonIcon />,
  //   roles: ['user', 'admin'], //role user and admin can see this menu
  //   children: [
  //     {
  //       title: 'Form',
  //       path: '/example/form',
  //       children: [
  //         {
  //           title: 'Create',
  //           path: '/example/form/create',
  //         },
  //         {
  //           title: 'Update',
  //           path: '/example/form/update',
  //         },
  //         {
  //           title: 'Details',
  //           path: '/example/form/details',
  //         },
  //       ],
  //     },
  //     {
  //       title: 'Example CRUD',
  //       path: '/example/crud',
  //     },

  //     {
  //       title: 'Tab',
  //       path: '/tab',
  //     },
  //   ],
  // },
  {
    title: 'Cài đặt chung',
    path: '/settings',
    icon: <SettingsIcon />,
    roles: ['user', 'admin'],
    children: [
      {
        title: 'Thông tin doanh nghiệp',
        path: '/settings/company/3a03e36e-50d4-d78c-56cb-881332972c54/edit',
      },
      {
        title: 'Nhận diện thương hiệu',
        path: '/settings/company/3a03e36e-50d4-d78c-56cb-881332972c54/identity',
      },
      {
        title: 'Hội viên',
        path: '/settings/company/3a03e36e-50d4-d78c-56cb-881332972c54/member',
      },
      {
        title: 'Cài đặt điểm',
        path: '/settings/company/3a03e36e-50d4-d78c-56cb-881332972c54/point',
      },
    ],
  },
  {
    title: 'Người dùng',
    path: '/user', //path need to be the same as route to be highlighted
    icon: <PersonIcon />,
    roles: ['user', 'admin'], //role user and admin can see this menu
    children: [
      {
        title: 'Thông tin người dùng',
        path: '/user/profile',
      },
    ],
  },

  {
    title: 'Hội Viên',
    path: '/members', //path need to be the same as route to be highlighted
    icon: <PersonIcon />,
    roles: ['user', 'admin'], //role user and admin can see this menu
  },

  {
    title: 'Quản trị hạng hội viên',
    path: '/membershipClass/list', //path need to be the same as route to be highlighted
    icon: <PersonIcon />,
    roles: ['user', 'admin'], //role user and admin can see this menu
    // children: [
    //   {
    //     title: 'Thông tin người dùng',
    //     path: '/membershipClass',
    //   },
    // ],
  },
];

interface NavItemsProps {
  items: SectionItem[];
  pathname: string;
  depth?: number;
  role: Role;
}

const renderNavSectionItems = (props: NavItemsProps): JSX.Element => {
  const { depth = 0, items, role, pathname } = props;

  const itemsFiltered =
    depth === 0
      ? items.filter((item) => item.roles && item.roles.includes(role))
      : items;

  return (
    <List disablePadding>
      {itemsFiltered.reduce((acc: JSX.Element[], item) => {
        const { children, icon, info, path, title } = item;
        const key = `${title}-${depth}`;
        const partialMatch = pathname.startsWith(String(path));
        // const exactMatch = pathname === item.path;
        if (children) {
          const items = children.filter((item) => {
            const { roles } = item;
            return !roles || (roles && roles.includes(role));
          });
          acc.push(
            <SidebarItem
              key={key}
              icon={icon}
              info={info}
              path={path}
              title={title}
              depth={depth}
              open={partialMatch}
              active={partialMatch}
            >
              {renderNavSectionItems({
                depth: depth + 1,
                items,
                pathname,
                role,
              })}
            </SidebarItem>
          );
        } else {
          acc.push(
            <SidebarItem
              key={key}
              icon={icon}
              info={info}
              path={path}
              title={title}
              depth={depth}
              active={partialMatch}
            />
          );
        }

        return acc;
      }, [])}
    </List>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [openLogoutDialog, setOpenLogoutDialog] = useState<boolean>(false);
  const mounted = useMounted();

  const handleOpenLogoutDialog = () => {
    setOpenLogoutDialog(true);
  };

  const handleCloseLogoutDialog = () => {
    if (mounted.current) {
      setOpenLogoutDialog(false);
    }
  };

  const handleLogout = async () => {
    await sleep(350);
    logout();
  };

  const sections = useMemo(() => getSections(), []);

  // const role: Role = user ? user.userRole.code : 'user';
  const role: Role = user ? 'user' : 'user';

  return (
    <Box sx={{ flexGrow: 1 }}>
      {renderNavSectionItems({
        items: sections,
        pathname: location.pathname,
        role,
      })}
      <List disablePadding>
        <ListItem disableGutters disablePadding>
          <Button
            variant="text"
            startIcon={<LogoutIcon />}
            onClick={handleOpenLogoutDialog}
            sx={{
              color: 'text.secondary',
              justifyContent: 'flex-start',
              p: 1.5,
              pl: 3,
              textAlign: 'left',
              width: '100%',
              fontWeight: 'medium',
            }}
          >
            Đăng xuất
          </Button>
        </ListItem>
      </List>
      <LogoutConfirmDialog
        open={openLogoutDialog}
        onClose={handleCloseLogoutDialog}
        onSubmit={handleLogout}
        content={{
          label: 'Đăng xuất',
          description: 'Bạn chắc chắn muốn đăng xuất?',
          icon: LogoutIcon,
        }}
      />
    </Box>
  );
};

export default Sidebar;
