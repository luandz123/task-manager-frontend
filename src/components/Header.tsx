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
    <header className="sticky top-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="btn-primary-gradient p-2.5 rounded-xl group-hover:rotate-6 transition-transform duration-300">
                <Layout className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-extrabold text-2xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">DevTask</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm font-semibold text-text-muted hover:text-primary-600 transition-colors">Dashboard</Link>
              <Link to="/projects" className="text-sm font-semibold text-text-muted hover:text-primary-600 transition-colors">Projects</Link>
            </nav>
          </div>

          <div className="flex items-center gap-5">
            <div className="relative hidden lg:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="bg-surface-low border-none rounded-2xl py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-primary-500 w-72 transition-all placeholder:text-text-faint"
              />
            </div>

            <button className="p-2.5 text-slate-500 hover:bg-surface-low rounded-xl transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-3 right-3 w-2 h-2 bg-secondary-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>

            <div className="h-8 w-px bg-surface-high mx-2"></div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-sm font-bold leading-tight text-text-main">{user.name}</span>
                <span className="text-[10px] font-bold text-primary-500 uppercase tracking-widest">Admin Access</span>
              </div>
              <button 
                onClick={handleLogout}
                className="bg-surface-low p-2.5 rounded-xl hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
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
