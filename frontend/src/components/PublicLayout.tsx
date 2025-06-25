import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-8">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default PublicLayout;
