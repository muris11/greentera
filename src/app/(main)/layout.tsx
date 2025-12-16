'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session } = useSession();

  // Get user data from session
  const user = {
    name: session?.user?.name || 'Guest',
    email: session?.user?.email || '',
    image: session?.user?.image || undefined,
  };

  return (
    <div className="min-h-screen bg-gradient-eco">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="main-content min-h-screen flex flex-col md:ml-72 transition-all duration-300">
        {/* Navbar */}
        <Navbar 
          onMenuClick={() => setSidebarOpen(true)}
          user={user}
        />

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full animate-fade-in-up">
          {children}
        </main>
      </div>
    </div>
  );
}
