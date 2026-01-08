'use client';

import React, { Fragment, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Collapse from '@mui/material/Collapse';
import Link from 'next/link';

interface SubmenuItem {
  id: number;
  title: string;
  link: string;
}

interface MenuItem {
  id: number;
  title: string;
  link: string;
  submenu?: SubmenuItem[];
}

const menus: MenuItem[] = [
  {
    id: 1,
    title: 'Home',
    link: '/',
  },
  {
    id: 9,
    title: 'Shop',
    link: '/products',
    submenu: [
      { id: 91, title: 'All Products', link: '/products' },
      { id: 92, title: 'Shopping Cart', link: '/cart' },
    ],
  },
  {
    id: 88,
    title: 'Contact',
    link: '/contact',
  },
];

const MobileMenu: React.FC = () => {
  const [openId, setOpenId] = useState<number | null>(null);

  const handleToggle = (id: number) => {
    setOpenId(prevId => (prevId === id ? null : id));
  };

  return (
    <ul className="xb-menu-primary clearfix">
      {menus.map(menu => (
        <ListItem key={menu.id} className={openId === menu.id ? 'active' : ''}>
          {menu.submenu ? (
            <Fragment>
              <p onClick={() => handleToggle(menu.id)}>
                {menu.title}
                <i className={`fa ${openId === menu.id ? 'fa-angle-up' : 'fa-angle-down'}`}></i>
              </p>
              <Collapse in={openId === menu.id} timeout="auto" unmountOnExit>
                <List className="menu-item menu-item-has-children active">
                  {menu.submenu.map(sub => (
                    <ListItem key={sub.id}>
                      <Link href={sub.link} className="active">
                        {sub.title}
                      </Link>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </Fragment>
          ) : (
            <Link href={menu.link} className="active">
              {menu.title}
            </Link>
          )}
        </ListItem>
      ))}
    </ul>
  );
};

export default MobileMenu;
