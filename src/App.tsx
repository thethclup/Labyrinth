import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from './lib/web3/wagmi';
import { useGameStore } from './store/useGameStore';
import { MainMenu } from './screens/MainMenu';
import { GameScreen } from './screens/GameScreen';
import { CodexScreen } from './screens/CodexScreen';
import { LeaderboardScreen } from './screens/LeaderboardScreen';
import { EscapedScreen } from './screens/EscapedScreen';
import { AnimatePresence } from 'motion/react';

const queryClient = new QueryClient();

function GameRouter() {
  const currentScreen = useGameStore((state) => state.currentScreen);

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-[#050508] text-white font-sans selection:bg-cyan-500/30">
      {/* Mesh Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-500/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute top-[30%] left-[40%] w-[30%] h-[30%] bg-amber-400/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

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
