import { motion } from 'motion/react';
import { useGameStore } from '../store/useGameStore';
import { ArrowLeft, BookOpen } from 'lucide-react';

export function CodexScreen() {
  const setScreen = useGameStore((state) => state.setScreen);
  const unlockedPatterns = useGameStore((state) => state.unlockedPatterns);

  const patterns = [
    { id: 'resonance', name: 'Resonance Weave', desc: 'A stable connection that vibrates with magic.' },
    { id: 'echo', name: 'Echo Bridge', desc: 'A phantom thread that supports weight temporarily.' },
    { id: 'void', name: 'Void Snare', desc: 'Pulls nearby loose threads into a central knot.' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 z-30 flex flex-col p-8 pointer-events-auto backdrop-blur-md bg-black/40"
    >
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => setScreen('menu')}
          className="p-3 transition-colors border rounded-full bg-white/5 backdrop-blur-xl border-white/10 text-white/70 hover:text-white hover:bg-white/10"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="flex items-center gap-3 text-xl font-bold tracking-widest uppercase text-cyan-50">
          <BookOpen className="text-cyan-400" size={24} /> Thread Codex
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-w-2xl mx-auto w-full">
        {patterns.map((pattern) => (
          <div 
            key={pattern.id}
            className={`p-6 border rounded-3xl transition-all backdrop-blur-xl ${
              unlockedPatterns.includes(pattern.id) 
                ? 'bg-amber-500/10 border-amber-500/20'
                : 'bg-white/5 border-white/10 opacity-70'
            }`}
          >
            <h3 className={`mb-2 text-sm font-bold tracking-widest uppercase ${unlockedPatterns.includes(pattern.id) ? 'text-amber-400' : 'text-white/40'}`}>
              {unlockedPatterns.includes(pattern.id) ? pattern.name : 'Unknown Pattern'}
            </h3>
            <p className="text-sm leading-relaxed text-white/60">
              {unlockedPatterns.includes(pattern.id) ? pattern.desc : 'Pattern not yet witnessed in the labyrinth. Pull threads carefully.'}
            </p>
            {unlockedPatterns.includes(pattern.id) && (
               <button className="w-full mt-4 py-3 rounded-xl border border-amber-400/40 text-amber-400 text-xs font-bold uppercase hover:bg-amber-400/10 transition-colors">
                  View Weave Structure
               </button>
            )}
          </div>
        ))}
        
        {unlockedPatterns.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
            <div className="w-16 h-16 border rounded-full border-[var(--color-thread-cyan)] opacity-20 mb-4 animate-pulse" />
            <p className="tracking-widest uppercase text-white/50">No patterns discovered</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
