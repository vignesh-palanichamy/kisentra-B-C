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
    link: '/home',
    submenu: [
      { id: 11, title: 'SEO Agency', link: '/home' },
      { id: 12, title: 'It Services', link: '/home-2' },
      { id: 13, title: 'AI & Data Solutions', link: '/home-3' },
      { id: 14, title: 'Cyber Security', link: '/home-4' },
      { id: 15, title: 'Cloud and Devops', link: '/home-5' },
      { id: 16, title: 'Help desk SaaS', link: '/home-6' },
    ],
  },
  {
    id: 3,
    title: 'Pages',
    link: '/about',
    submenu: [
      { id: 31, title: 'About Us', link: '/about' },
      { id: 3222, title: 'Our Pricing', link: '/pricing' },
      { id: 322, title: 'Our team', link: '/team' },
      { id: 345, title: 'Services', link: '/service' },
      { id: 3454, title: 'Service Details', link: '/service-single' },
      { id: 3455, title: 'Casestudy', link: '/casestudy' },
      { id: 3456, title: 'Casestudy Details', link: '/casestudy-details' },
      { id: 3457, title: 'Career', link: '/career' },
      { id: 3458, title: 'Career details', link: '/career-details' },
      { id: 3459, title: 'Terms & Conditions', link: '/terms-conditions' },
      { id: 3460, title: 'Privacy Policy', link: '/privacy-policy' },
    ],
  },
  {
    id: 5,
    title: 'Services',
    link: '/service',
    submenu: [
      { id: 51, title: 'Services', link: '/service' },
      { id: 52, title: 'Service Details', link: '/service-single' },
    ],
  },
  {
    id: 7,
    title: 'Casestudy',
    link: '/casestudy',
    submenu: [
      { id: 71, title: 'Casestudy', link: '/casestudy' },
      { id: 72, title: 'Casestudy Details', link: '/casestudy-details' },
    ],
  },
  {
    id: 6,
    title: 'Blog',
    link: '/blog',
    submenu: [
      { id: 61, title: 'Blog', link: '/blog' },
      { id: 62, title: 'Blog Details', link: '/blog-single' },
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
