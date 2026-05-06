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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Workspace</h1>
          <p className="text-slate-500 mt-2">Manage your team's projects and track progress</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary-500/20 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Create Project
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Active Projects', value: projects.length, icon: Folder, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Pending Tasks', value: '12', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Completed', value: '48', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'High Priority', value: '3', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-6 rounded-3xl border border-slate-100 dark:border-slate-800"
          >
            <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        Projects
        <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs py-1 px-2.5 rounded-full">
          {projects.length}
        </span>
      </h2>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 opacity-50">
          <Loader2 className="w-10 h-10 animate-spin text-primary-600 mb-4" />
          <p className="font-medium">Loading your workspace...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 glass rounded-3xl border-dashed border-2 border-slate-200 dark:border-slate-800">
          <div className="bg-slate-50 dark:bg-slate-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Folder className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold">No projects yet</h3>
          <p className="text-slate-500 mt-1 mb-6">Create your first project to get started</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="text-primary-600 font-bold hover:underline"
          >
            Create project now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/project/${project.id}`}
                  className="group block glass p-6 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-primary-500/50 hover:shadow-2xl hover:shadow-primary-500/10 transition-all relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleDeleteProject(project.id, e)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="bg-primary-50 dark:bg-primary-900/20 text-primary-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Folder className="w-6 h-6" />
                  </div>
                  
                  <h3 className="text-xl font-bold group-hover:text-primary-600 transition-colors">{project.name}</h3>
                  <p className="text-slate-500 mt-2 line-clamp-2 text-sm leading-relaxed">
                    {project.description || 'No description provided.'}
                  </p>
                  
                  <div className="flex items-center gap-4 mt-6 pt-6 border-t border-slate-50 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(project.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex -space-x-2 ml-auto">
                      {[1,2,3].map(n => (
                        <div key={n} className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold">
                          {String.fromCharCode(64 + n)}
                        </div>
                      ))}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

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
