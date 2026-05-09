import { motion } from 'motion/react';
import { useGameStore } from '../store/useGameStore';
import { useAccount, useConnect, useDisconnect, useSendTransaction } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { stringToHex, pad } from 'viem';

export function MainMenu() {
  const setScreen = useGameStore((state) => state.setScreen);
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { sendTransaction, isPending } = useSendTransaction();

  const handleSayGM = () => {
    if (!address) return;
    sendTransaction({
      to: address,
      value: 0n,
      data: stringToHex('GM Thread Labyrinth'),
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
    >
      <div className="relative z-10 flex flex-col items-center max-w-md w-full gap-12">
        <div className="flex flex-col gap-4">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="text-5xl md:text-7xl font-bold tracking-widest text-cyan-50 uppercase leading-tight"
          >
            Thread<br />
            <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-fuchsia-400 to-cyan-400">Labyrinth</span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="flex flex-col items-center gap-2"
          >
            <p className="text-sm tracking-widest text-white/50 uppercase">
              A Web3 Puzzle Adventure
            </p>
            <div className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 rounded-full">
              BUILDER: bc_36gp9c0x
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex flex-col w-full gap-4 p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10"
        >
          <button
            onClick={() => setScreen('game')}
            className="w-full py-4 rounded-2xl bg-cyan-500 text-black font-black uppercase text-sm tracking-widest active:scale-95 transition-transform"
          >
            Enter Labyrinth
          </button>

          <button
            onClick={() => setScreen('codex')}
            className="w-full mt-2 py-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm text-white/70 hover:bg-white/10 hover:text-white transition-all text-xs font-bold uppercase tracking-widest"
          >
            Thread Codex
          </button>
          
          <button
            onClick={() => setScreen('leaderboard')}
            className="w-full py-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm text-white/70 hover:bg-white/10 hover:text-white transition-all text-xs font-bold uppercase tracking-widest"
          >
            Leaderboard
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-8 left-0 right-0 flex flex-col items-center justify-center pointer-events-none"
        >
          {isConnected ? (
            <div className="flex flex-col items-center gap-4 bg-white/5 backdrop-blur-lg border border-white/10 px-6 py-4 rounded-3xl pointer-events-auto">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-xs font-semibold uppercase tracking-widest text-white/70">Base Mainnet</span>
                <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-mono">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
              </div>
              <div className="flex items-center gap-4 w-full">
                <button 
                  onClick={handleSayGM}
                  disabled={isPending}
                  className="flex-1 py-2 rounded-xl bg-cyan-500/20 text-cyan-400 font-bold uppercase text-xs tracking-widest active:scale-95 transition-transform disabled:opacity-50 border border-cyan-500/30"
                >
                  {isPending ? 'Sending...' : 'Say GM'}
                </button>
                <button 
                  onClick={() => disconnect()}
                  className="flex-1 py-2 rounded-xl border border-white/10 text-white/40 hover:text-white hover:bg-white/5 uppercase text-xs font-bold tracking-widest transition-colors"
                >
                  Disconnect
                </button>
              </div>
            </div>
          ) : (
             <div className="pointer-events-auto">
                <button
                  onClick={() => connect({ connector: injected() })}
                  className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-sm font-bold tracking-widest uppercase hover:bg-white/20 transition-colors flex items-center gap-3"
                >
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  Connect Base Wallet
                </button>
             </div>
          )}

          <div className="mt-8 text-[10px] font-mono text-white/30 uppercase tracking-widest pointer-events-auto text-center">
            ERC-8004 Trustless Agent Compatible
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
