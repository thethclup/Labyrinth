import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useGameStore } from '../store/useGameStore';
import { ThreadPhysicsEngine } from '../game/ThreadPhysicsEngine';
import { ArrowLeft, Maximize2 } from 'lucide-react';

export function GameScreen() {
  const setScreen = useGameStore((state) => state.setScreen);
  const level = useGameStore((state) => state.level);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<ThreadPhysicsEngine | null>(null);
  const [tension, setTension] = useState(0);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Initialize Game Engine
    engineRef.current = new ThreadPhysicsEngine(canvasRef.current, {
      onTensionChange: setTension,
      onLevelComplete: () => setScreen('escaped'),
    });
    
    engineRef.current.start(level);

    return () => {
      engineRef.current?.destroy();
    };
  }, [level, setScreen]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="absolute inset-0 flex flex-col bg-black/40 backdrop-blur-sm z-10"
    >
      <div className="absolute top-0 inset-x-0 z-20 flex justify-between items-start p-8 pointer-events-none">
        <button 
          onClick={() => setScreen('menu')}
          className="pointer-events-auto p-3 rounded-full bg-black/60 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all backdrop-blur-md focus:outline-none"
        >
          <ArrowLeft size={20} />
        </button>
        
        <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 min-w-[200px] pointer-events-auto">
          <h3 className="text-xs font-bold text-white/40 uppercase mb-4 tracking-widest flex justify-between items-center">
            Tension <span className="text-[10px] text-amber-400 font-serif italic">Level {level}</span>
          </h3>
          <div className="relative h-16 flex items-end justify-between gap-1 overflow-hidden">
            {[...Array(6)].map((_, i) => (
               <div 
                 key={i} 
                 className="w-full rounded-t transition-all duration-300" 
                 style={{ 
                    height: `${Math.max(10, tension - (i * 15))}%`,
                    backgroundColor: tension > 80 ? 'rgba(245, 158, 11, 0.7)' : 'rgba(6, 182, 212, 0.5)'
                 }}
               ></div>
            ))}
          </div>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-2xl font-bold">{Math.round(tension)}%</span>
            {tension > 80 && <span className="text-[10px] text-amber-400 font-bold uppercase tracking-tighter">CRITICAL</span>}
          </div>
        </div>
      </div>

      <canvas 
        ref={canvasRef} 
        className="w-full h-full touch-none cursor-crosshair relative z-10"
      />

      <div className="absolute bottom-8 inset-x-0 flex justify-center pointer-events-none z-20 px-8">
        <div className="px-6 py-3 rounded-full bg-black/60 backdrop-blur-md border border-cyan-400/30 text-cyan-400 text-xs font-mono uppercase tracking-widest">
            SECTOR: VOID WEAVE
        </div>
      </div>
    </motion.div>
  );
}
