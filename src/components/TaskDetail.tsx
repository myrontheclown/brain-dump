/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Task, Priority, RecurrenceType } from '../types';
import { ArrowLeft, Save, Trash2, Calendar, StickyNote, Repeat, Tag } from 'lucide-react';

interface TaskDetailProps {
  task: Task;
  onSave: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

const CATEGORIES = ['College', 'Home', 'Groceries', 'Work', 'Personal', 'Uncategorized'];

export default function TaskDetail({ task, onSave, onDelete, onBack }: TaskDetailProps) {
  const [title, setTitle] = useState(task.title);
  const [priority, setPriority] = useState(task.priority);
  const [category, setCategory] = useState(task.category);
  const [deadline, setDeadline] = useState(task.deadline || '');
  const [notes, setNotes] = useState(task.notes || '');
  const [isRecurring, setIsRecurring] = useState(task.isRecurring);
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>(task.recurrenceType || 'daily');

  const handleSave = () => {
    onSave(task.id, { title, priority, category, deadline, notes, isRecurring, recurrenceType });
    onBack();
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-0">
      <div className="flex items-center gap-4 mb-10">
        <button 
          onClick={onBack}
          className="p-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:scale-95"
        >
          <ArrowLeft size={24} strokeWidth={3} />
        </button>
        <h2 className="text-3xl font-display font-black uppercase tracking-tighter italic">Brain Dump → Edit</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-8 space-y-8">
          <section className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <label className="block text-xs font-black uppercase tracking-widest text-black/40 mb-2">Task Title</label>
            <input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-4xl font-display font-black uppercase border-none p-0 focus:ring-0 placeholder:text-zinc-200 leading-none"
              placeholder="What needs to be done?"
            />
          </section>

          <section className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-2 mb-4">
              <Tag size={16} strokeWidth={3} className="text-black/40" />
              <label className="text-xs font-black uppercase tracking-widest text-black/40">Category</label>
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 border-4 border-black font-black uppercase text-[10px] transition-all ${
                    category === cat 
                      ? 'bg-brand-cyan shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]' 
                      : 'bg-white hover:bg-zinc-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>

          <section className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <label className="block text-xs font-black uppercase tracking-widest text-black/40 mb-4">Set Priority</label>
            <div className="flex gap-4">
              {[
                { id: Priority.HIGH, label: 'High', color: 'bg-brand-red text-white' },
                { id: Priority.MEDIUM, label: 'Mid', color: 'bg-brand-yellow text-black' },
                { id: Priority.LOW, label: 'Low', color: 'bg-brand-cyan text-black' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPriority(p.id as Priority)}
                  className={`flex-1 py-4 border-4 border-black font-display font-black uppercase transition-all ${
                    priority === p.id 
                      ? `${p.color} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]` 
                      : 'bg-white hover:bg-zinc-50'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </section>

          <section className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-4">
              <label className="text-xs font-black uppercase tracking-widest text-black/40">Extended Notes</label>
              <StickyNote size={16} strokeWidth={3} />
            </div>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={8}
              className="w-full border-4 border-black p-4 font-medium focus:outline-none placeholder:text-zinc-200 resize-none bg-zinc-50 focus:bg-white transition-colors"
              placeholder="Add additional details, links, or context here..."
            />
          </section>
        </div>

        <div className="md:col-span-4 space-y-8">
          <section className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <label className="block text-xs font-black uppercase tracking-widest text-black/40 mb-4">Deadline</label>
            <div className="relative">
              <input 
                type="text" 
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                placeholder="e.g. Tomorrow"
                className="w-full border-4 border-black p-4 font-display font-black uppercase"
              />
              <Calendar size={20} strokeWidth={3} className="absolute right-4 top-1/2 -translate-y-1/2 text-black/20" />
            </div>
          </section>

          <section className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-4">
              <label className="text-xs font-black uppercase tracking-widest text-black/40">Routine Task</label>
              <Repeat size={16} strokeWidth={3} className={isRecurring ? 'text-brand-green' : 'text-black/20'} />
            </div>
            <div className="space-y-4">
              <button
                onClick={() => setIsRecurring(!isRecurring)}
                className={`w-full py-4 border-4 border-black font-black uppercase text-xs transition-all ${
                  isRecurring 
                    ? 'bg-brand-green shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]' 
                    : 'bg-white hover:bg-zinc-50'
                }`}
              >
                {isRecurring ? 'Recurring: ON' : 'Make Recurring'}
              </button>
              
              {isRecurring && (
                <div className="grid grid-cols-2 gap-2">
                  {(['daily', 'weekly'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setRecurrenceType(type)}
                      className={`py-2 border-4 border-black font-black uppercase text-[10px] transition-all ${
                        recurrenceType === type 
                          ? 'bg-black text-white' 
                          : 'bg-zinc-100 hover:bg-zinc-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>

          <div className="space-y-4 pt-4">
            <button 
              onClick={handleSave}
              className="w-full brutalist-button bg-brand-green text-black text-xl py-6 flex items-center justify-center gap-3"
            >
              <Save size={24} strokeWidth={3} />
              <span>Save Changes</span>
            </button>
            <button 
              onClick={() => {
                if (confirm('Are you sure you want to delete this task?')) {
                  onDelete(task.id);
                  onBack();
                }
              }}
              className="w-full border-4 border-black text-brand-red py-4 px-6 font-display font-black uppercase hover:bg-brand-red/5 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              <Trash2 size={20} strokeWidth={3} />
              <span>Delete Task</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
