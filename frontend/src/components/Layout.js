// components/Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';  // This is where child components will render
import NavBar from './NavBar';

const Layout = ({ userInfo,balance,user,setBalance }) => {
  return (
    <div>
      <NavBar balance={balance} setBalance={setBalance}/> {/* Always render the header */}
      <main>
        <Outlet />  {/* The page content will be rendered here */}
      </main>
    </div>
  );
};

export default Layout;
