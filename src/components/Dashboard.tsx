/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Task, Priority } from '../types';
import { CheckCircle2, Circle, Clock, Trash2, Edit2, TrendingUp, Award, Repeat, Filter } from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export default function Dashboard({ tasks, onToggle, onDelete, onEdit }: DashboardProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  const categories = ['All', ...Array.from(new Set(tasks.map(t => t.category))).filter(c => c !== 'Uncategorized'), 'Uncategorized'];

  const filteredTasks = activeCategory === 'All' 
    ? tasks 
    : tasks.filter(t => t.category === activeCategory);

  const completedCount = filteredTasks.filter(t => t.completed).length;
  const pendingCount = filteredTasks.length - completedCount;

  // Grouping tasks
  const today = filteredTasks.filter(t => {
    const d = new Date(t.createdAt);
    const now = new Date();
    return d.toDateString() === now.toDateString() && !t.completed;
  });

  const older = filteredTasks.filter(t => {
    const d = new Date(t.createdAt);
    const now = new Date();
    return d.toDateString() !== now.toDateString() && !t.completed;
  });

  const completed = filteredTasks.filter(t => t.completed);

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.HIGH: return 'bg-brand-red';
      case Priority.MEDIUM: return 'bg-brand-yellow';
      case Priority.LOW: return 'bg-brand-cyan';
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-0 space-y-12">
      {/* Category Pills */}
      <div className="flex items-center gap-4 overflow-x-auto pb-4 no-scrollbar">
        <div className="p-2 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <Filter size={16} strokeWidth={3} />
        </div>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2 border-4 border-black font-black uppercase text-xs transition-all whitespace-nowrap ${
              activeCategory === cat 
                ? 'bg-brand-cyan shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]' 
                : 'bg-white hover:bg-zinc-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Statistics Section (Column 3 style) */}
        <div className="md:col-span-4 space-y-8 order-2 md:order-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-4 h-4 bg-black rounded-full"></div>
            <h2 className="text-2xl font-black italic uppercase">03. Analytics</h2>
          </div>

          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-6xl font-black leading-none">
              {tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0}%
            </div>
            <div className="text-xs font-black uppercase mt-1">Completion Rate</div>
            <div className="w-full bg-black h-4 mt-4 border-2 border-black overflow-hidden relative">
              <div 
                className="bg-brand-green h-full transition-all duration-1000" 
                style={{ width: `${tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="text-3xl font-black">{pendingCount}</div>
              <div className="text-[10px] font-black uppercase leading-none mt-1">Pending</div>
            </div>
            <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="text-3xl font-black">{tasks.length}</div>
              <div className="text-[10px] font-black uppercase leading-none mt-1">Total Items</div>
            </div>
          </div>

          <div className="bg-black text-brand-yellow p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-4">
            <h3 className="text-xl font-black uppercase tracking-tighter leading-none italic">Power Level: High</h3>
            <p className="text-[10px] font-bold leading-tight">YOU ARE IN THE TOP 5% OF PRODUCTIVITY THIS WEEK. MAINTAIN MOMENTUM!</p>
          </div>
        </div>

        {/* Task Sorting Section (Column 2 style) */}
        <div className="md:col-span-8 space-y-10 order-1 md:order-2">
          <Section title="Current Queue" tasks={today.concat(older)} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} priorityColor={getPriorityColor} />
          <Section title="Archive" tasks={completed} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} priorityColor={getPriorityColor} isCompleted />
          
          {tasks.length === 0 && (
            <div className="bg-white/30 border-4 border-black border-dashed p-12 text-center">
              <p className="text-2xl font-black opacity-20 uppercase italic">Your queue is empty</p>
              <p className="text-xs font-bold opacity-30 mt-2">DUMP SOME THOUGHTS TO BEGIN</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

interface SectionProps {
  title: string;
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  priorityColor: (p: Priority) => string;
  isCompleted?: boolean;
}

function Section({ title, tasks, onToggle, onDelete, onEdit, priorityColor, isCompleted }: SectionProps) {
  if (tasks.length === 0) return null;

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'College': return 'bg-purple-100 text-purple-700';
      case 'Home': return 'bg-orange-100 text-orange-700';
      case 'Groceries': return 'bg-green-100 text-green-700';
      case 'Work': return 'bg-blue-100 text-blue-700';
      case 'Personal': return 'bg-pink-100 text-pink-700';
      default: return 'bg-zinc-100 text-zinc-700';
    }
  };

  return (
    <section>
      <div className="flex items-center gap-4 mb-6">
        <h3 className={`text-2xl font-display font-black uppercase ${isCompleted ? 'bg-zinc-400' : 'bg-black'} text-white px-4 py-1`}>
          {title}
        </h3>
        <div className="flex-1 h-1 bg-black/10"></div>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <motion.div 
            key={task.id}
            layout
            className={`brutalist-border bg-white p-4 flex items-center justify-between gap-4 group hover:translate-x-1 transition-all ${task.completed ? 'opacity-60 grayscale' : 'brutalist-shadow'}`}
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <button 
                onClick={() => onToggle(task.id)}
                className={`w-8 h-8 brutalist-border flex items-center justify-center transition-colors ${task.completed ? 'bg-brand-green' : 'hover:bg-zinc-100'}`}
              >
                {task.completed && <CheckCircle2 size={18} strokeWidth={3} />}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 border-2 border-black font-black uppercase text-[8px] ${getCategoryColor(task.category)}`}>
                    {task.category}
                  </span>
                  {task.isRecurring && (
                    <div className="flex items-center gap-1 text-[8px] font-black uppercase text-black/40">
                      <Repeat size={10} strokeWidth={3} />
                      {task.recurrenceType}
                    </div>
                  )}
                </div>
                <h4 className={`text-lg font-display font-black uppercase truncate leading-none ${task.completed ? 'line-through' : ''}`}>
                  {task.title}
                </h4>
                <div className="flex items-center gap-2 mt-2">
                  <div className={`w-3 h-3 brutalist-border ${priorityColor(task.priority)}`}></div>
                  {task.deadline && (
                    <span className="text-[10px] font-display font-black uppercase text-black/40">
                      {task.deadline}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => onEdit(task)} className="p-2 border-2 border-black hover:bg-zinc-100"><Edit2 size={16} strokeWidth={3} /></button>
              <button onClick={() => onDelete(task.id)} className="p-2 border-2 border-black hover:bg-brand-red hover:text-white"><Trash2 size={16} strokeWidth={3} /></button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
