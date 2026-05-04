/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Check, Trash2, Edit2, Save, ArrowRight, Repeat, Tag } from 'lucide-react';
import { ParseResult, Priority } from '../types';
import { motion } from 'motion/react';

interface OutputProps {
  results: ParseResult[];
  onSave: (tasks: ParseResult[]) => void;
  onCancel: () => void;
}

const CATEGORIES = ['College', 'Home', 'Groceries', 'Work', 'Personal', 'Uncategorized'];

export default function Output({ results, onSave, onCancel }: OutputProps) {
  const [editableResults, setEditableResults] = useState<ParseResult[]>(results);

  const updateResult = (index: number, updates: Partial<ParseResult>) => {
    setEditableResults(prev => prev.map((r, i) => i === index ? { ...r, ...updates } : r));
  };

  const removeResult = (index: number) => {
    setEditableResults(prev => prev.filter((_, i) => i !== index));
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.HIGH: return 'bg-brand-red text-white';
      case Priority.MEDIUM: return 'bg-brand-yellow text-black';
      case Priority.LOW: return 'bg-brand-cyan text-black';
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-0">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-6 h-6 bg-black rounded-full"></div>
        <h2 className="text-4xl font-black italic uppercase">02. Compiled Output</h2>
      </div>

      <div className="space-y-6">
        {editableResults.map((result, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 flex flex-col gap-4 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <select 
                  value={result.priority}
                  onChange={(e) => updateResult(idx, { priority: e.target.value as Priority })}
                  className={`${getPriorityColor(result.priority)} border-2 border-black px-3 py-1 font-display font-black uppercase text-[10px] focus:outline-none cursor-pointer`}
                >
                  <option value={Priority.HIGH}>High Priority</option>
                  <option value={Priority.MEDIUM}>Medium Priority</option>
                  <option value={Priority.LOW}>Low Priority</option>
                </select>

                <select 
                  value={result.category}
                  onChange={(e) => updateResult(idx, { category: e.target.value })}
                  className="bg-white border-2 border-black px-3 py-1 font-display font-black uppercase text-[10px] focus:outline-none cursor-pointer"
                >
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>

                {result.isRecurring && (
                  <div className="flex items-center gap-1 bg-brand-green border-2 border-black px-3 py-1 font-display font-black uppercase text-[10px]">
                    <Repeat size={10} strokeWidth={3} />
                    <span>{result.recurrenceType}</span>
                  </div>
                )}

                {result.deadline && (
                  <span className="font-mono text-[10px] font-black uppercase text-black/40">
                    DUE: {result.deadline}
                  </span>
                )}
              </div>
              <button 
                onClick={() => removeResult(idx)}
                className="p-2 border-2 border-black hover:bg-brand-red transition-colors opacity-0 group-hover:opacity-100"
                title="Discard"
              >
                <Trash2 size={16} strokeWidth={3} />
              </button>
            </div>

            <input 
              value={result.title}
              onChange={(e) => updateResult(idx, { title: e.target.value })}
              className="w-full text-2xl font-display font-black uppercase bg-transparent border-none p-0 focus:ring-0 placeholder:text-zinc-300 leading-none"
              placeholder="Task title..."
            />
          </motion.div>
        ))}
      </div>

      {editableResults.length === 0 && (
        <div className="text-center py-20 border-4 border-black bg-white/50 italic text-black/30 font-black uppercase">
          No tasks compiled. Try again.
        </div>
      )}

      <div className="fixed bottom-0 left-0 md:left-64 right-0 p-6 bg-brand-yellow/80 backdrop-blur-md border-t-4 border-black z-50 flex justify-center">
        <div className="max-w-4xl w-full flex gap-6">
          <button 
            onClick={onCancel}
            className="flex-1 brutalist-button bg-white text-black"
          >
            Cancel
          </button>
          <button 
            onClick={() => onSave(editableResults)}
            disabled={editableResults.length === 0}
            className="flex-[2] brutalist-button bg-brand-cyan text-black flex items-center justify-center gap-3"
          >
            <span>Save Tasks 💾</span>
            <ArrowRight size={20} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
}
