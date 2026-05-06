import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Layout, User as UserIcon, Bell, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <header className="sticky top-0 z-50 glass border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-primary-600 p-2 rounded-lg group-hover:rotate-6 transition-transform">
                <Layout className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight">DevTask</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-sm font-medium hover:text-primary-600 transition-colors">Dashboard</Link>
              <Link to="/projects" className="text-sm font-medium hover:text-primary-600 transition-colors">Projects</Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Quick search..." 
                className="bg-slate-100 dark:bg-slate-800 border-none rounded-full py-1.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary-500 w-64"
              />
            </div>

            <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>

            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>

            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-sm font-semibold">{user.name}</span>
                <span className="text-xs text-slate-500 capitalize">Team Member</span>
              </div>
              <button 
                onClick={handleLogout}
                className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg hover:text-red-600 transition-all"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
