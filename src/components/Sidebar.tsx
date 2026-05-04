/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LayoutDashboard, BrainCircuit, History, Settings, Plus } from 'lucide-react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

export default function Sidebar({ currentView, setCurrentView }: SidebarProps) {
  const navItems = [
    { id: 'brain-dump', label: 'Brain Dump', icon: BrainCircuit },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'archives', label: 'Archives', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <aside className="w-64 fixed left-0 top-0 h-full bg-white border-r-4 border-black z-40 hidden md:flex flex-col font-display uppercase font-black overflow-y-auto">
      <div className="p-6 border-b-4 border-black">
        <h1 className="text-4xl font-black tracking-tighter leading-none">Brain Dump</h1>
        <p className="text-[10px] tracking-widest text-black/60 mt-1 uppercase">Mental Compiler v1.0.4</p>
      </div>

      <nav className="flex-1 p-4 space-y-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id || (item.id === 'dashboard' && currentView === 'detail');
          
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as any)}
              className={`w-full flex items-center gap-3 p-3 border-4 transition-all active:translate-x-0 active:translate-y-0 active:shadow-none ${
                isActive 
                  ? 'bg-brand-yellow border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]' 
                  : 'border-transparent hover:bg-brand-yellow hover:border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
              }`}
            >
              <Icon size={20} strokeWidth={3} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 mt-auto space-y-4">
        <div className="bg-black text-brand-yellow p-4 text-center font-black text-[10px] tracking-widest">
          LOCAL STORAGE ACTIVE
        </div>
        
        <div className="pt-4 border-t-4 border-black flex items-center gap-3">
          <div className="w-10 h-10 border-4 border-black bg-brand-cyan"></div>
          <div className="flex flex-col">
            <span className="text-xs font-black">USER_01</span>
            <span className="text-[10px] uppercase font-bold text-black/50">Premium Raw</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
