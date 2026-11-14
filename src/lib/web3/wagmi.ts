import { http, webSocket, fallback, createConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import { coinbaseWallet, injected } from 'wagmi/connectors';

export const BASE_DENIM_CHAIN_ID = base.id; // 8453 (Base Mainnet)
export const DENIM_BLOCK_TIME_MS = 200;
export const GM_RECIPIENT_ADDRESS = '0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3' as const;

const DEFAULT_BASE_RPC_URL = 'https://mainnet.base.org';
const customRpcUrl = import.meta.env.VITE_BASE_RPC_URL?.trim();
const customWsUrl = import.meta.env.VITE_BASE_WS_URL?.trim();

// Reject retired Flashblocks WebSocket endpoints on Denim
const isRetiredFlashblocksWs = (url?: string) =>
  Boolean(url && /flashblocks\.base\.org/i.test(url));

const BASE_RPC_URL = customRpcUrl || DEFAULT_BASE_RPC_URL;
const BASE_WS_URL =
  customWsUrl && !isRetiredFlashblocksWs(customWsUrl) ? customWsUrl : undefined;

/**
 * Base Mainnet (Denim): 200ms canonical blocks, Flashblocks retired.
 * All state reads and receipt polling target canonical 200ms blocks.
 */
export const baseDenim = {
  ...base,
  blockTime: DENIM_BLOCK_TIME_MS,
  rpcUrls: {
    default: {
      http: [BASE_RPC_URL],
      ...(BASE_WS_URL ? { webSocket: [BASE_WS_URL] } : {}),
    },
  },
};

const baseTransport = BASE_WS_URL
  ? fallback([webSocket(BASE_WS_URL), http(BASE_RPC_URL)])
  : http(BASE_RPC_URL);

export const wagmiConfig = createConfig({
  chains: [baseDenim],
  connectors: [
    coinbaseWallet({ appName: 'Thread Labyrinth' }),
    injected(),
  ],
  pollingInterval: DENIM_BLOCK_TIME_MS,
  transports: {
    [baseDenim.id]: baseTransport,
  },
});

