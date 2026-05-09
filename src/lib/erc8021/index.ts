import { Address, stringToHex, pad } from 'viem';

export const ATTRIBUTION_CODE = 'bc_36gp9c0x';

/**
 * ERC-8021 Transaction Attribution Utilities
 * Formats attribution calldata to append to transactions.
 */
export function generateAttributionPayload(builderCode: string = ATTRIBUTION_CODE): `0x${string}` {
  // Simplified implementation for ERC-8021 payload generation
  const hexCode = stringToHex(builderCode);
  return pad(hexCode, { size: 32 });
}
