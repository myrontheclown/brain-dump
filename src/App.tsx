/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import BrainDump from './components/BrainDump';
import Output from './components/Output';
import TaskDetail from './components/TaskDetail';
import { useTasks } from './hooks/useTasks';
import { View, Task, ParseResult } from './types';
import { parseBrainDump } from './lib/parser';
import { User, Settings as SettingsIcon, Menu } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<View>('brain-dump');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentParsedResults, setCurrentParsedResults] = useState<ParseResult[]>([]);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  
  const { tasks, addTask, updateTask, deleteTask, toggleTask } = useTasks();

  const handleProcess = (input: string) => {
    const results = parseBrainDump(input);
    setCurrentParsedResults(results);
    setView('output');
  };

  const handleSaveParsed = (parsedTasks: ParseResult[]) => {
    parsedTasks.forEach(task => {
      addTask({
        title: task.title,
        priority: task.priority,
        category: task.category,
        deadline: task.deadline,
        isRecurring: task.isRecurring,
        recurrenceType: task.recurrenceType,
        notes: '',
      });
    });
    setView('dashboard');
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setView('detail');
  };

  const renderView = () => {
    switch (view) {
      case 'dashboard':
      case 'archives': // For MVP, treat archives same as dashboard or empty
        return (
          <Dashboard 
            tasks={tasks} 
            onToggle={toggleTask} 
            onDelete={deleteTask} 
            onEdit={handleEditTask} 
          />
        );
      case 'brain-dump':
        return <BrainDump onProcess={handleProcess} />;
      case 'output':
        return (
          <Output 
            results={currentParsedResults} 
            onSave={handleSaveParsed} 
            onCancel={() => setView('brain-dump')} 
          />
        );
      case 'detail':
        return taskToEdit ? (
          <TaskDetail 
            task={taskToEdit} 
            onSave={updateTask} 
            onDelete={deleteTask} 
            onBack={() => setView('dashboard')} 
          />
        ) : <Dashboard tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} onEdit={handleEditTask} />;
      default:
        return <Dashboard tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} onEdit={handleEditTask} />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-yellow flex flex-col md:flex-row">
      <Sidebar currentView={view} setCurrentView={setView} />
      
      {/* Mobile Header */}
      <header className="md:hidden flex justify-between items-center px-6 py-4 bg-white border-b-4 border-black sticky top-0 z-50">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <Menu size={24} />
        </button>
        <span className="font-display font-black uppercase tracking-tighter text-xl">Brain Dump</span>
        <div className="flex gap-4">
          <User size={20} />
          <SettingsIcon size={20} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 min-h-screen relative overflow-x-hidden p-6">
        {/* Desktop Header */}
        <header className="hidden md:flex justify-between items-end border-b-4 border-black pb-6 mb-12">
          <div>
            <h1 className="text-7xl font-black tracking-tighter leading-none">
              BRAIN DUMP <span className="text-4xl">→</span> TASK SORTER
            </h1>
            <p className="font-bold uppercase tracking-wider text-sm mt-2">Mental Compiler v1.0.4 // Zero Friction Productivity</p>
          </div>
          <div className="flex gap-4">
            <div className="border-4 border-black bg-white px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black uppercase text-xs">
              SAVED: {tasks.length}
            </div>
            <div className="border-4 border-black bg-brand-green px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black uppercase text-xs">
              V.SYNC
            </div>
          </div>
        </header>

        <div className="pb-20">
          {renderView()}
        </div>
      </main>

      {/* Mobile Navigation Drawer Overlay (Simulated) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        >
          <div className="w-64 h-full bg-white border-r-4 border-black" onClick={e => e.stopPropagation()}>
            <Sidebar currentView={view} setCurrentView={(v) => { setView(v); setIsSidebarOpen(false); }} />
          </div>
        </div>
      )}
    </div>
  );
}

