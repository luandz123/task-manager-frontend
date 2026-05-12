import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Layout, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.access_token, response.data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-surface relative overflow-hidden">
      {/* Editorial Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[480px] z-10"
      >
        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            className="inline-flex btn-primary-gradient p-4 rounded-[2rem] shadow-2xl shadow-primary-500/30 mb-8"
          >
            <Layout className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-5xl font-extrabold tracking-tighter text-slate-900 dark:text-white mb-4 font-display">
            Curator Access<span className="text-primary-500">.</span>
          </h1>
          <p className="text-slate-500 text-lg font-medium">Continue your editorial journey in task management.</p>
        </div>

        <div className="glass p-10 md:p-12 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] relative">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100 flex items-center gap-3"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></div>
                {error}
              </motion.div>
            )}

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Identity</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-low border-none rounded-[1.5rem] py-4.5 pl-14 pr-6 outline-none focus:ring-2 focus:ring-primary-500/20 transition-all font-medium placeholder:text-slate-300"
                  placeholder="name@agency.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Security Key</label>
                <a href="#" className="text-[10px] font-black text-primary-600 hover:text-primary-400 uppercase tracking-widest transition-colors">Forgot?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-low border-none rounded-[1.5rem] py-4.5 pl-14 pr-6 outline-none focus:ring-2 focus:ring-primary-500/20 transition-all font-medium placeholder:text-slate-300"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary-gradient text-white font-black py-5 rounded-[1.5rem] transition-all shadow-xl shadow-primary-500/20 flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95"
            >
              {isSubmitting ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <span className="tracking-tight text-lg">Sign In</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-surface-low text-center">
            <p className="text-slate-400 font-medium">
              New curator?{' '}
              <Link to="/register" className="text-primary-600 font-black hover:text-primary-400 transition-colors">Apply for access</Link>
            </p>
          </div>
        </div>
        
        {/* Subtle Footer */}
        <p className="text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mt-12">
          DevTask Editorial System v1.0
        </p>
      </motion.div>
    </div>
  );
}
