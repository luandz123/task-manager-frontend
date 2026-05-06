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
    <div className="h-[calc(100vh-64px)] flex flex-col">
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 py-6">
        <div className="flex items-center gap-4 mb-4">
          <Link to="/" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{project.name}</h1>
              <span className="bg-primary-50 dark:bg-primary-900/20 text-primary-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Active</span>
            </div>
            <p className="text-slate-500 text-sm mt-0.5">{project.description || 'No description'}</p>
          </div>
          
          <div className="flex items-center gap-3 ml-auto">
            <div className="flex -space-x-3 items-center mr-4">
               {[1,2,3,4].map(n => (
                  <div key={n} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold ring-1 ring-slate-200 dark:ring-slate-800">
                    {String.fromCharCode(64 + n)}
                  </div>
                ))}
                <button className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-primary-600 text-white flex items-center justify-center text-xs font-bold hover:bg-primary-700 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-500">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto bg-slate-50 dark:bg-slate-950 p-8">
        <div className="flex gap-8 h-full min-w-max">
          {columns.map(column => (
            <div key={column.id} className="w-96 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${column.color}`} />
                  <h3 className="font-bold text-slate-700 dark:text-slate-300">{column.label}</h3>
                  <span className="text-xs font-bold text-slate-400 bg-slate-200/50 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                    {project.tasks.filter(t => t.status === column.id).length}
                  </span>
                </div>
                <button 
                  onClick={() => setIsAddingTask(column.id)}
                  className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 kanban-column overflow-y-auto custom-scrollbar">
                <AnimatePresence>
                  {isAddingTask === column.id && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-slate-800 p-4 rounded-xl border-2 border-primary-500/30 shadow-lg"
                    >
                      <input
                        autoFocus
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddTask(column.id)}
                        onBlur={() => !newTaskTitle && setIsAddingTask(null)}
                        className="w-full bg-transparent outline-none text-sm font-medium mb-3"
                        placeholder="What needs to be done?"
                      />
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setIsAddingTask(null)} className="text-xs font-bold text-slate-500 hover:text-slate-700 px-3 py-1.5">Cancel</button>
                        <button onClick={() => handleAddTask(column.id)} className="bg-primary-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-primary-700 transition-colors">Add Task</button>
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
                      className="task-card group"
                      whileHover={{ y: -2, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${
                          task.priority === 'HIGH' ? 'bg-rose-50 text-rose-600' : 
                          task.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {task.priority}
                        </span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button 
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-1 text-slate-400 hover:text-red-600"
                           >
                            <Trash2 className="w-3.5 h-3.5" />
                           </button>
                        </div>
                      </div>
                      <h4 className="text-sm font-semibold mb-2 group-hover:text-primary-600 transition-colors">{task.title}</h4>
                      
                      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-50 dark:border-slate-700/50">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                          <Clock className="w-3 h-3" />
                          Oct 12
                        </div>
                        <div className="ml-auto flex items-center gap-1">
                           <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-[8px] font-bold">JD</div>
                        </div>
                      </div>
                      
                      <div className="flex gap-1 mt-4">
                        {columns.filter(c => c.id !== column.id).map(c => (
                          <button
                            key={c.id}
                            onClick={() => updateTaskStatus(task.id, c.id)}
                            className="flex-1 py-1 px-2 rounded bg-slate-100 dark:bg-slate-800 text-[9px] font-bold text-slate-500 hover:bg-primary-50 hover:text-primary-600 transition-colors"
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
          
          <button className="w-96 h-full border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-900/50 hover:text-primary-600 transition-all group min-h-[500px]">
            <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl mb-4 shadow-sm group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6" />
            </div>
            <span className="font-bold">Add New Column</span>
          </button>
        </div>
      </div>
    </div>
  );
}
