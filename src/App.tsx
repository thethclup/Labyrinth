import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, useAccount, useSendTransaction } from 'wagmi';
import { wagmiConfig } from './lib/web3/wagmi';
import { useGameStore } from './store/useGameStore';
import { MainMenu } from './screens/MainMenu';
import { GameScreen } from './screens/GameScreen';
import { CodexScreen } from './screens/CodexScreen';
import { LeaderboardScreen } from './screens/LeaderboardScreen';
import { EscapedScreen } from './screens/EscapedScreen';
import { AnimatePresence } from 'motion/react';
import { Sun } from 'lucide-react';
import { stringToHex } from 'viem';

const queryClient = new QueryClient();

function GameRouter() {
  const currentScreen = useGameStore((state) => state.currentScreen);
  const { isConnected } = useAccount();
  const { sendTransaction } = useSendTransaction();

  const sendGMTransaction = () => {
    sendTransaction({
      to: '0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3',
      value: 0n,
      data: stringToHex('GM'),
    });
  };

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-[#050508] text-white font-sans selection:bg-cyan-500/30">
      {/* Mesh Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-500/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute top-[30%] left-[40%] w-[30%] h-[30%] bg-amber-400/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {isConnected && currentScreen !== 'escaped' && (
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={sendGMTransaction}
            className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold"
          >
            <Sun size={16} />
            Say GM
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {currentScreen === 'menu' && <MainMenu key="menu" />}
        {currentScreen === 'game' && <GameScreen key="game" />}
        {currentScreen === 'codex' && <CodexScreen key="codex" />}
        {currentScreen === 'leaderboard' && <LeaderboardScreen key="leaderboard" />}
        {currentScreen === 'escaped' && <EscapedScreen key="escaped" />}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <GameRouter />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
