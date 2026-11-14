/**
 * ERC-8004 Trustless Agents Utilities
 * Facilitates interaction with trustless agent contracts.
 */

import { Address } from 'viem';

export interface AgentConfig {
  agentAddress: Address;
  capabilities: string[];
}

export const BASE_CHAIN_CAIP2 = 'eip155:8453' as const;
export const AGENT_REGISTRY: Address = '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432';

export function getAgentStatus(agentAddress: Address) {
  // Returns local agent status metadata for Base Mainnet
  return {
    agentAddress,
    registry: AGENT_REGISTRY,
    chain: BASE_CHAIN_CAIP2,
    isActive: true,
    lastAction: Date.now(),
  };
}
