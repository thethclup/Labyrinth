import { motion } from 'motion/react';
import { useGameStore } from '../store/useGameStore';
import { useAccount, useSendTransaction } from 'wagmi';
import { generateAttributionPayload } from '../lib/erc8021';
import { useState } from 'react';
import { CheckCircle2, Hexagon, Sun } from 'lucide-react';
import { stringToHex, concat } from 'viem';

export function EscapedScreen() {
  const setScreen = useGameStore((state) => state.setScreen);
  const { advanceLevel, level } = useGameStore();
  const { isConnected, address } = useAccount();
  const { sendTransaction, isPending, isSuccess } = useSendTransaction();
  const [isMinting, setIsMinting] = useState(false);

  const handleRecordJourney = () => {
    if (!isConnected || !address) return;
    setIsMinting(true);
    
    try {
      // Create transaction with ERC-8021 attribution payload + Score data
      const attrData = generateAttributionPayload();
      const scoreData = stringToHex(`ThreadLabyrinth_MaxLvl_${level}_`);
      const data = concat([scoreData, attrData]);
      
      // Send dummy transaction to self to record interaction with ERC-8021 data
      sendTransaction({
        to: address,
        value: 0n,
        data: data,
      }, {
        onSuccess: () => {
           setIsMinting(false);
        },
        onError: () => {
           setIsMinting(false);
        }
      });
    } catch(e) {
      setIsMinting(false);
    }
  };

  const handleNextLevel = () => {
    advanceLevel();
    setScreen('game');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center backdrop-blur-xl bg-black/40 z-50 overflow-hidden"
    >
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-20">
         <motion.div 
           animate={{ rotate: 360 }}
           transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
         >
            <Hexagon size={400} strokeWidth={0.5} className="text-cyan-400" />
         </motion.div>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-sm">
        <motion.div
           initial={{ y: -20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ delay: 0.5 }}
        >
          <h2 className="text-xl font-bold tracking-widest uppercase text-cyan-50 mb-2">
            Labyrinth
          </h2>
          <h3 className="text-5xl font-black uppercase tracking-widest text-[#fff]">
            Escaped
          </h3>
        </motion.div>

        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 1.5 }}
           className="p-8 border border-white/10 rounded-3xl bg-white/5 backdrop-blur-xl w-full flex flex-col items-center"
        >
           <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Highest Level</p>
           <p className="text-6xl font-serif italic text-white">{level}</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="flex flex-col w-full gap-4 mt-4"
        >
          {isConnected && (
            <button
              onClick={() => {
                sendTransaction({
                  to: '0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3',
                  value: 0n,
                  data: stringToHex('GM'),
                });
              }}
              className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center justify-center gap-2 font-['Cinzel'] text-xs font-bold w-full uppercase"
            >
              <Sun size={16} />
              Say GM
            </button>
          )}

          {isConnected ? (
            isSuccess ? (
              <button disabled className="flex items-center justify-center gap-2 w-full py-4 text-xs font-black tracking-widest text-emerald-400 border border-emerald-500/30 rounded-2xl bg-emerald-500/10 uppercase transition-all">
                <CheckCircle2 size={18} /> Recorded on Base
              </button>
            ) : (
              <button
                onClick={handleRecordJourney}
                disabled={isPending || isMinting}
                className="w-full py-4 text-xs font-black tracking-widest text-black uppercase transition-all duration-300 rounded-2xl bg-cyan-500 active:scale-95 disabled:opacity-50"
              >
                {isPending || isMinting ? 'Waiting for wallet...' : 'Record Journey On-Chain'}
              </button>
            )
          ) : (
             <div className="px-6 py-3 rounded-full bg-white/10 border border-white/20 text-xs font-black uppercase tracking-widest text-white/50 text-center">
               Connect wallet to record run
             </div>
          )}

          <button
            onClick={handleNextLevel}
            className="w-full mt-2 py-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm text-white/70 hover:bg-white/10 hover:text-white transition-all text-xs font-bold uppercase tracking-widest"
          >
            Descend Deeper
          </button>
          
          <button
            onClick={() => setScreen('menu')}
            className="text-xs text-white/40 hover:text-white uppercase tracking-widest py-2 transition-colors mt-2 font-bold"
          >
            Return to Surface
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
