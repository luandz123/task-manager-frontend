import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { 
  Plus, 
  Trash2, 
  Loader2, 
  ChevronLeft, 
  MoreHorizontal, 
  User as UserIcon,
  Clock,
  Layout,
  Filter,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

interface Project {
  id: number;
  name: string;
  description: string;
  tasks: Task[];
}

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddingTask, setIsAddingTask] = useState<'TODO' | 'IN_PROGRESS' | 'DONE' | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await api.get(`/projects/${id}`);
      setProject(response.data);
    } catch (err) {
      console.error('Failed to fetch project');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (status: 'TODO' | 'IN_PROGRESS' | 'DONE') => {
    if (!newTaskTitle.trim()) return;
    try {
      const response = await api.post(`/tasks`, {
        title: newTaskTitle,
        description: '',
        status,
        priority: 'MEDIUM',
        projectId: Number(id),
      });
      if (project) {
        setProject({
          ...project,
          tasks: [...project.tasks, response.data],
        });
      }
      setNewTaskTitle('');
      setIsAddingTask(null);
    } catch (err) {
      console.error('Failed to add task');
    }
  };

  const updateTaskStatus = async (taskId: number, status: 'TODO' | 'IN_PROGRESS' | 'DONE') => {
    try {
      await api.patch(`/tasks/${taskId}`, { status });
      if (project) {
        setProject({
          ...project,
          tasks: project.tasks.map(t => t.id === taskId ? { ...t, status } : t),
        });
      }
    } catch (err) {
      console.error('Failed to update task status');
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      if (project) {
        setProject({
          ...project,
          tasks: project.tasks.filter(t => t.id !== taskId),
        });
      }
    } catch (err) {
      console.error('Failed to delete task');
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
      <Loader2 className="w-10 h-10 animate-spin text-primary-600 mb-4" />
      <p className="font-medium">Loading project board...</p>
    </div>
  );

  if (!project) return null;

  const columns = [
    { id: 'TODO' as const, label: 'To Do', color: 'bg-slate-200' },
    { id: 'IN_PROGRESS' as const, label: 'In Progress', color: 'bg-blue-500' },
    { id: 'DONE' as const, label: 'Completed', color: 'bg-emerald-500' },
  ];

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-surface px-12 py-10">
        <div className="flex flex-col md:flex-row md:items-end gap-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-4 mb-3">
              <Link to="/" className="p-2.5 bg-surface-low hover:bg-surface-high rounded-xl transition-all hover:-translate-x-1">
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-extrabold tracking-tighter text-text-main">{project.name}</h1>
                <span className="bg-primary-50 dark:bg-primary-900/20 text-primary-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ring-1 ring-primary-100">Project Active</span>
              </div>
            </div>
            <p className="text-text-muted text-lg font-medium max-w-2xl">{project.description || 'This project is currently being curated.'}</p>
          </div>
          
          <div className="flex items-center gap-5 ml-auto">
            <div className="flex -space-x-3 items-center mr-6">
               {[1,2,3,4].map(n => (
                  <div key={n} className="w-10 h-10 rounded-full border-[3px] border-white dark:border-slate-900 bg-surface-high flex items-center justify-center text-xs font-black text-slate-600 shadow-sm">
                    {String.fromCharCode(64 + n)}
                  </div>
                ))}
                <button className="w-10 h-10 rounded-full border-[3px] border-white dark:border-slate-900 btn-primary-gradient flex items-center justify-center text-xs font-bold hover:scale-110 transition-transform shadow-lg shadow-primary-500/20">
                  <Plus className="w-5 h-5" />
                </button>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 rounded-2xl text-sm font-bold shadow-sm hover:shadow-md transition-all">
              <Filter className="w-4 h-4" />
              Filter Board
            </button>
            <button className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all text-slate-500">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto bg-surface-low px-12 py-8">
        <div className="flex gap-10 h-full min-w-max">
          {columns.map(column => (
            <div key={column.id} className="w-[400px] flex flex-col h-full">
              <div className="flex items-center justify-between mb-6 px-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${column.color.replace('bg-', 'bg-opacity-80 bg-')}`} />
                  <h3 className="font-display font-extrabold text-xl tracking-tight text-text-main">{column.label}</h3>
                  <span className="text-[10px] font-black text-text-muted bg-white/50 dark:bg-slate-800 px-3 py-1 rounded-full shadow-sm">
                    {project.tasks.filter(t => t.status === column.id).length}
                  </span>
                </div>
                <button 
                  onClick={() => setIsAddingTask(column.id)}
                  className="p-2 bg-white/50 dark:bg-slate-800 rounded-xl text-slate-500 hover:text-primary-600 hover:bg-white transition-all shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 kanban-column overflow-y-auto custom-scrollbar">
                <AnimatePresence>
                  {isAddingTask === column.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-2xl ring-2 ring-primary-500/20"
                    >
                      <input
                        autoFocus
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddTask(column.id)}
                        onBlur={() => !newTaskTitle && setIsAddingTask(null)}
                        className="w-full bg-transparent outline-none text-base font-bold mb-4 placeholder:text-text-faint text-text-main"
                        placeholder="Define a new task..."
                      />
                      <div className="flex justify-end gap-3">
                        <button onClick={() => setIsAddingTask(null)} className="text-xs font-bold text-slate-400 hover:text-slate-600 px-4 py-2 transition-colors">Cancel</button>
                        <button onClick={() => handleAddTask(column.id)} className="btn-primary-gradient text-xs font-black px-5 py-2.5 rounded-xl">Add Task</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {project.tasks
                  .filter(t => t.status === column.id)
                  .map(task => (
                    <motion.div
                      key={task.id}
                      layoutId={String(task.id)}
                      className="task-card group relative"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${
                          task.priority === 'HIGH' ? 'bg-red-50 text-red-600 ring-1 ring-red-100' : 
                          task.priority === 'MEDIUM' ? 'bg-orange-50 text-tertiary-500 ring-1 ring-orange-100' : 'bg-primary-50 text-primary-600 ring-1 ring-primary-100'
                        }`}>
                          {task.priority} Priority
                        </span>
                        <button 
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-1.5 text-slate-300 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <h4 className="text-lg font-bold mb-3 group-hover:text-primary-600 transition-colors leading-snug text-text-main">{task.title}</h4>
                      
                      <div className="flex items-center gap-4 mt-6 pt-5 border-t border-surface-low">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-text-faint uppercase tracking-wider">
                          <Clock className="w-3.5 h-3.5" />
                          Curated Oct 12
                        </div>
                        <div className="ml-auto flex -space-x-2">
                           <div className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-800 bg-surface-high flex items-center justify-center text-[8px] font-black text-slate-500">JD</div>
                           <div className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-800 btn-primary-gradient flex items-center justify-center text-[8px] font-black">+2</div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-5 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                        {columns.filter(c => c.id !== column.id).map(c => (
                          <button
                            key={c.id}
                            onClick={() => updateTaskStatus(task.id, c.id)}
                            className="flex-1 py-2 px-3 rounded-xl bg-surface-low text-[9px] font-black text-slate-500 hover:bg-primary-500 hover:text-white transition-all uppercase tracking-widest"
                          >
                            Move to {c.label.split(' ')[0]}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          ))}
          
          <button className="w-[400px] h-full border-2 border-dashed border-surface-high rounded-[2rem] flex flex-col items-center justify-center text-slate-300 hover:bg-white hover:border-primary-500/30 hover:text-primary-600 transition-all group min-h-[600px] shadow-sm hover:shadow-xl">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl mb-5 shadow-sm group-hover:scale-110 transition-transform duration-500">
              <Plus className="w-8 h-8" />
            </div>
            <span className="font-display font-extrabold text-lg">Add Collection</span>
          </button>
        </div>
      </div>
    </div>
  );
}
