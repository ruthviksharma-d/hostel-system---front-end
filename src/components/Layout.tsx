import React from 'react';
    import { Link, useLocation, useNavigate } from 'react-router-dom';
    import { 
      LayoutDashboard, 
      ClipboardList, 
      History, 
      LogOut, 
      User,
      Bell,
      Wrench
    } from 'lucide-react';

    interface LayoutProps {
      children: React.ReactNode;
      role: 'tenant' | 'maintenance';
    }

    const Layout: React.FC<LayoutProps> = ({ children, role }) => {
      const location = useLocation();
      const navigate = useNavigate();

      const tenantNav = [
        { name: 'Dashboard', path: '/tenant/dashboard', icon: LayoutDashboard },
        { name: 'My Requests', path: '/tenant/requests', icon: ClipboardList },
        { name: 'History', path: '/tenant/history', icon: History },
      ];

      const maintenanceNav = [
        { name: 'Dashboard', path: '/maintenance/dashboard', icon: LayoutDashboard },
        { name: 'All Requests', path: '/maintenance/all-requests', icon: ClipboardList },
      ];

      const navItems = role === 'tenant' ? tenantNav : maintenanceNav;

      return (
        <div className="flex min-h-screen bg-slate-50">
          {/* Sidebar */}
          <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col sticky top-0 h-screen">
            <div className="p-6 flex items-center gap-3 border-b border-slate-100">
              <div className="bg-primary p-2 rounded-lg">
                <Wrench size={24} className="text-white" />
              </div>
              <span className="font-serif text-xl font-bold text-slate-900">HostelFix</span>
            </div>
            
            <nav className="flex-1 p-4 space-y-1 mt-4">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-slate-900 text-white shadow-md' 
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-100">
              <button 
                onClick={() => navigate('/login')}
                className="flex items-center gap-3 px-4 py-3 w-full text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0">
            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
              <h2 className="text-lg font-semibold text-slate-800">
                {navItems.find(n => n.path === location.pathname)?.name || 'Overview'}
              </h2>
              
              <div className="flex items-center gap-4">
                <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                  <Bell size={20} />
                </button>
                <div className="h-8 w-px bg-slate-200 mx-2" />
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold text-slate-900">John Doe</p>
                    <p className="text-xs text-slate-500 capitalize">{role}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
                    <User size={20} />
                  </div>
                </div>
              </div>
            </header>

            <main className="p-8 max-w-7xl mx-auto w-full">
              {children}
            </main>
          </div>
        </div>
      );
    };

    export default Layout;