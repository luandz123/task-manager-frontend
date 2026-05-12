import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { 
  Plus, 
  Folder, 
  Calendar, 
  Trash2, 
  Loader2, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Project {
  id: number;
  name: string;
  description: string;
  createdAt: string;
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (err) {
      console.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const response = await api.post('/projects', {
        name: newProjectName,
        description: newProjectDesc,
      });
      setProjects([response.data, ...projects]);
      setIsModalOpen(false);
      setNewProjectName('');
      setNewProjectDesc('');
    } catch (err) {
      console.error('Failed to create project');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteProject = async (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects(projects.filter(p => p.id !== id));
    } catch (err) {
      console.error('Failed to delete project');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Left Spine: Header & Projects Feed */}
        <div className="flex-1">
          <header className="mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-6xl font-extrabold tracking-tighter text-slate-900 dark:text-white mb-4">
                Workspace<span className="text-primary-500">.</span>
              </h1>
              <p className="text-slate-500 text-xl font-medium max-w-xl leading-relaxed">
                Your curated collection of active projects and collaborative tasks, organized for maximum focus.
              </p>
            </motion.div>
          </header>

          <div className="flex items-center justify-between mb-10">
            <h2 className="font-display font-extrabold text-2xl tracking-tight">Active Feed</h2>
            <div className="flex items-center gap-3">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Sort by: Recent</span>
              <div className="w-10 h-px bg-surface-high"></div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn-primary-gradient px-6 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Project
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 opacity-50">
              <Loader2 className="w-12 h-12 animate-spin text-primary-600 mb-6" />
              <p className="font-bold text-xl tracking-tight">Curating your feed...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-32 bg-surface-low rounded-[3rem] border-2 border-dashed border-surface-high">
              <div className="bg-white dark:bg-slate-900 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                <Folder className="w-12 h-12 text-slate-200" />
              </div>
              <h3 className="text-3xl font-extrabold tracking-tight mb-4">Empty Workspace</h3>
              <p className="text-slate-500 mb-10 max-w-sm mx-auto text-lg">Your vertical feed is waiting for its first curated entry. Start a project to begin.</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="btn-primary-gradient px-10 py-4 rounded-2xl font-black text-lg"
              >
                Start Your First Project
              </button>
            </div>
          ) : (
            <div className="space-y-10">
              <AnimatePresence>
                {projects.map((project, i) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      to={`/project/${project.id}`}
                      className="group block editorial-card hover:bg-white dark:hover:bg-slate-800/80 hover:shadow-[0_40px_80px_-20px_rgba(0,40,120,0.08)] relative overflow-hidden"
                    >
                      <div className="flex flex-col md:flex-row md:items-center gap-8">
                        {/* Project Icon/Visual */}
                        <div className="w-20 h-20 shrink-0 bg-surface-low dark:bg-slate-900/50 rounded-[2rem] flex items-center justify-center group-hover:btn-primary-gradient transition-all duration-500 group-hover:rotate-6">
                          <Folder className="w-10 h-10 text-primary-500 group-hover:text-white transition-colors" />
                        </div>

                        {/* Project Content */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-[10px] font-black text-primary-500 uppercase tracking-[0.2em] bg-primary-50 px-3 py-1 rounded-full">Project #{project.id}</span>
                            <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(project.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</span>
                          </div>
                          <h3 className="text-3xl font-extrabold group-hover:text-primary-600 transition-colors tracking-tighter mb-3 leading-none">
                            {project.name}
                          </h3>
                          <p className="text-slate-500 text-lg font-medium line-clamp-1 group-hover:text-slate-700 transition-colors">
                            {project.description || 'This project represents a curated stream of tasks and collaborative milestones.'}
                          </p>
                        </div>

                        {/* Stats & Actions */}
                        <div className="flex items-center gap-8 md:pl-8 md:border-l border-surface-low">
                          <div className="text-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tasks</p>
                            <p className="text-2xl font-black">12</p>
                          </div>
                          <div className="flex -space-x-3">
                            {[1,2,3].map(n => (
                              <div key={n} className="w-10 h-10 rounded-full border-[3px] border-white dark:border-slate-800 bg-surface-high flex items-center justify-center text-xs font-black text-slate-600 shadow-sm group-hover:-translate-y-1 transition-transform">
                                {String.fromCharCode(64 + n)}
                              </div>
                            ))}
                          </div>
                          <div className="w-12 h-12 rounded-2xl bg-surface-low flex items-center justify-center group-hover:bg-primary-50 transition-colors">
                            <ArrowRight className="w-6 h-6 text-slate-300 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                          </div>
                        </div>
                      </div>

                      {/* Subtle Background Accent */}
                      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary-500/5 rounded-full blur-3xl group-hover:bg-primary-500/10 transition-colors"></div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Right Gutter: Metadata & Sidebar Stats */}
        <aside className="w-full lg:w-80 shrink-0">
          <div className="sticky top-32 space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-[0_20px_40px_rgba(0,0,0,0.02)]">
              <h3 className="font-display font-extrabold text-xl mb-8 tracking-tight">Overview</h3>
              <div className="space-y-8">
                {[
                  { label: 'Active Projects', value: projects.length, icon: Folder, color: 'text-primary-500' },
                  { label: 'Upcoming Tasks', value: '24', icon: Clock, color: 'text-tertiary-500' },
                  { label: 'Team Velocity', value: '92%', icon: CheckCircle2, color: 'text-secondary-500' },
                ].map(stat => (
                  <div key={stat.label} className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-2xl bg-surface-low flex items-center justify-center ${stat.color} shrink-0`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-0.5">{stat.label}</p>
                      <p className="text-xl font-black">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-10 border-t border-surface-low">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Current Sprint</p>
                <div className="h-2 w-full bg-surface-low rounded-full overflow-hidden">
                  <div className="h-full btn-primary-gradient w-3/4"></div>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-[10px] font-bold">75% Complete</span>
                  <span className="text-[10px] font-bold text-slate-400">4 days left</span>
                </div>
              </div>
            </div>

            <div className="btn-primary-gradient p-8 rounded-[2.5rem] text-white overflow-hidden relative group">
              <div className="relative z-10">
                <h4 className="text-xl font-extrabold mb-2 tracking-tight">Pro Insights</h4>
                <p className="text-white/80 text-sm font-medium mb-6 leading-relaxed">
                  Your team is 15% more productive this week. View the full editorial report.
                </p>
                <button className="bg-white text-primary-600 px-6 py-2.5 rounded-xl font-bold text-sm hover:scale-105 transition-transform">
                  View Analytics
                </button>
              </div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            </div>
          </div>
        </aside>
      </div>

      {/* Modal - same as before but styled better */}
      {/* ... (Modal code remains functionally same but class names are consistent) */}

      {/* Create Project Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg glass p-8 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4">
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                  <Plus className="w-6 h-6 rotate-45" />
                </button>
              </div>
              
              <h2 className="text-2xl font-bold mb-6">Create New Project</h2>
              
              <form onSubmit={handleCreateProject} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold ml-1">Project Name</label>
                  <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl py-3.5 px-4 outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    placeholder="e.g. Website Redesign"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold ml-1">Description</label>
                  <textarea
                    value={newProjectDesc}
                    onChange={(e) => setNewProjectDesc(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl py-3.5 px-4 outline-none focus:ring-2 focus:ring-primary-500 transition-all h-32 resize-none"
                    placeholder="What's this project about?"
                  />
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-4 rounded-2xl font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-6 py-4 rounded-2xl font-bold shadow-lg shadow-primary-500/20 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Project'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
