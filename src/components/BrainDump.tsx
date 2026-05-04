/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Sparkles, Keyboard } from 'lucide-react';
import { motion } from 'motion/react';

interface BrainDumpProps {
  onProcess: (input: string) => void;
}

export default function BrainDump({ onProcess }: BrainDumpProps) {
  const [input, setInput] = useState('');

  const handleProcess = () => {
    if (input.trim()) {
      onProcess(input);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-0 flex flex-col items-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full mb-12 flex items-center gap-4"
      >
        <div className="w-6 h-6 bg-black rounded-full"></div>
        <h2 className="text-4xl font-black italic uppercase">01. Input Thoughts</h2>
      </motion.div>

      <div className="w-full bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col group relative">
        <label className="text-xs font-black uppercase mb-4 tracking-widest opacity-40">Raw Fragment Input</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Finish the landing page mockup by tomorrow, email Sarah about the budget asap, buy coffee beans, fix the header bug today..."
          className="w-full h-80 text-2xl font-medium focus:outline-none placeholder:text-zinc-200 resize-none bg-transparent"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              handleProcess();
            }
          }}
        />
        <button
          onClick={handleProcess}
          disabled={!input.trim()}
          className={`mt-6 w-full brutalist-button text-2xl h-18 flex items-center justify-center gap-3 transition-all ${
            input.trim() ? 'bg-brand-cyan hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none' : 'bg-zinc-200 opacity-50 cursor-not-allowed'
          }`}
        >
          <span>Compile Tasks</span>
          <Sparkles size={24} strokeWidth={3} />
        </button>
      </div>

      <div className="mt-8 flex items-center gap-2 text-xs font-black uppercase text-black/40">
        <Keyboard size={14} strokeWidth={3} />
        <span>Press CMD + ENTER TO PROCESS</span>
      </div>
    </div>
  );
}
