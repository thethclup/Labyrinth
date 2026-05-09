import { motion } from 'motion/react';
import { useGameStore } from '../store/useGameStore';
import { ArrowLeft, Trophy } from 'lucide-react';
import { useAccount } from 'wagmi';

export function LeaderboardScreen() {
  const setScreen = useGameStore((state) => state.setScreen);
  const { isConnected } = useAccount();

  const dummyLeaders = [
    { address: '0x1234...5678', score: 9400, level: 12 },
    { address: '0xabcd...ef01', score: 8200, level: 10 },
    { address: '0x9999...0000', score: 7150, level: 9 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 flex flex-col p-8 pointer-events-auto backdrop-blur-md bg-black/40 z-50"
    >
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => setScreen('menu')}
          className="p-3 transition-colors border rounded-full bg-white/5 backdrop-blur-xl border-white/10 text-white/70 hover:text-white hover:bg-white/10"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="flex items-center gap-3 text-xl font-bold tracking-widest uppercase text-cyan-50">
          <Trophy className="text-amber-400" size={24} /> Greatest Walkers <span className="text-cyan-400 text-xs ml-2">LIVE</span>
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto w-full max-w-2xl mx-auto space-y-6">
        {!isConnected && (
           <div className="p-6 mb-6 text-sm text-center border rounded-3xl bg-cyan-500/10 text-cyan-400 border-cyan-500/20 backdrop-blur-xl">
             Connect your Base wallet to see your global rank.
           </div>
        )}
        
        <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden flex flex-col gap-4">
          {dummyLeaders.map((leader, i) => (
            <div 
              key={i}
              className={`flex items-center justify-between p-4 transition-all rounded-2xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 ${i > 0 ? 'opacity-' + (100 - i * 20) : ''}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex-shrink-0 ${
                   i === 0 ? 'bg-gradient-to-tr from-amber-400 to-orange-500' :
                   i === 1 ? 'bg-gradient-to-tr from-cyan-500 to-blue-600' :
                   'bg-gradient-to-tr from-fuchsia-500 to-purple-600'
                }`}></div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">{leader.address}</span>
                  <span className="text-[10px] text-white/40 uppercase tracking-widest">Level {leader.level}</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-mono text-cyan-400">{leader.score}</span>
                <span className="text-[10px] text-white/40 uppercase tracking-widest">Resonance</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
