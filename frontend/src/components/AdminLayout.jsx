import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function AdminLayout() {
  return (
    <div className="app">
      <Sidebar />
      <main className="app__main">
        <div className="app__content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
