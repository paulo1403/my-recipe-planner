import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-1 py-8">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
