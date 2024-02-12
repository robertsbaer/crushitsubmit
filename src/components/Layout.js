import styles from '../styles/components/Layout.module.css';

import { gql, useQuery } from '@apollo/client';
import { Menu, Transition } from '@headlessui/react';
import {
  ChevronDownIcon,
  HomeIcon,
  LogoutIcon,
  PencilIcon,
  PlusIcon,
  RefreshIcon,
  UserIcon,
  ViewListIcon
} from '@heroicons/react/outline';
import { useSignOut, useUserId } from '@nhost/react';
import { Fragment } from 'react';
import { Link, Outlet } from 'react-router-dom';
import Avatar from './Avatar';


const GET_USER_QUERY = gql`
  query GetUser($id: uuid!) {
    user(id: $id) {
      id
      email
      displayName
      metadata
      avatarUrl
    }
  }
`


const Layout = () => {
  const id = useUserId()
  const { loading, error, data } = useQuery(GET_USER_QUERY, {
    variables: { id },
    skip: !id
  })
  const user = data?.user
  const { signOut } = useSignOut()


  const menuItems = [
    {
      label: 'Dashboard',
      href: '/',
      icon: HomeIcon,
    },
    {
      label: 'Profile',
      href: '/profile',
      icon: UserIcon,
    },
    {
      label: 'Logout',
      onClick: signOut,
      icon: LogoutIcon,
    },
    {
      label: 'FeedBack',
      href: '/feedback',
      icon: PencilIcon,
    },
    {
      label: 'FullList',
      href: '/fulllist',
      icon: ViewListIcon,
    },
    {
      label: 'Add A New Restaurant',
      href: '/addrestaurant',
      icon: PlusIcon,
    },
    {
      label: 'Restaurants Added By User',
      href: '/restaurants',
      icon: RefreshIcon,
    },
    {
      label: 'Corrections',
      href: '/corrections',
      icon: PencilIcon,
    },
    {
      label: 'Events',
      href: '/events',
      icon: PencilIcon,
    },
    {
      label: 'Users',
      href: '/users',
      icon: UserIcon,
    }
  ];

  return (
    <div>
      <header className={styles.header}>
        <div className={styles['header-container']}>
          <Link to="/">
          <img src={process.env.PUBLIC_URL + '/../public/logo192.svg'} alt="logo" />
          </Link>

          <Menu as="div" className={styles.menu}>
            <Menu.Button className={styles['menu-button']}>
              <Avatar src={user?.avatarUrl} alt={user?.displayName} />
              <ChevronDownIcon />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter={styles['menu-transition-enter']}
              enterFrom={styles['menu-transition-enter-from']}
              enterTo={styles['menu-transition-enter-to']}
              leave={styles['menu-transition-leave']}
              leaveFrom={styles['menu-transition-leave-from']}
              leaveTo={styles['menu-transition-leave-to']}
            >
              <Menu.Items className={styles['menu-items-container']}>
                <div className={styles['menu-header']}>
                  <Avatar src={user?.avatarUrl} alt={user?.displayName} />
                  <div className={styles['user-details']}>
                    <span>{user?.displayName}</span>
                    <span className={styles['user-email']}>{user?.email}</span>
                  </div>
                </div>

                <div className={styles['menu-items']}>
                  {menuItems.map(({ label, href, onClick, icon: Icon }) => (
                    <div key={label} className={styles['menu-item']}>
                      <Menu.Item>
                        {href ? (
                          <Link to={href}>
                            <Icon />
                            <span>{label}</span>
                          </Link>
                        ) : (
                          <button onClick={onClick}>
                            <Icon />
                            <span>{label}</span>
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </header>

      <main className={styles.main}>
      <div className={styles['main-container']}>
          {error ? (
            <p>Something went wrong. Try to refresh the page.</p>
          ) : !loading ? (
            <Outlet context={{ user }} />
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default Layout;
