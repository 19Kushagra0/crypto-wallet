import { ethers } from "ethers";

// ── CoinGecko Token ID map ──────────────────────────────────────────────────
// Maps token symbols → CoinGecko coin IDs for price lookup
const COINGECKO_IDS = {
  ETH:   "ethereum",
  WETH:  "weth",
  USDC:  "usd-coin",
  USDT:  "tether",
  DAI:   "dai",
  UNI:   "uniswap",
  LINK:  "chainlink",
  WBTC:  "wrapped-bitcoin",
  MATIC: "matic-network",
};

// Stablecoin symbols that are pegged ~$1
const STABLECOINS = new Set(["USDC", "USDT", "DAI", "BUSD", "FRAX", "LUSD"]);

/**
 * Fetch live swap quote using CoinGecko prices.
 * Works on any network (mainnet or testnet) since it uses off-chain price data.
 *
 * @param {string} symbolIn  - e.g. "ETH"
 * @param {string} symbolOut - e.g. "USDC"
 * @param {string|number} amountIn - human-readable input amount (e.g. "0.1")
 * @returns {Promise<{amountOut: string, rate: string, source: string}>}
 */
export async function getSwapQuote(symbolIn, symbolOut, amountIn) {
  const coinIdIn  = COINGECKO_IDS[symbolIn?.toUpperCase()];
  const coinIdOut = COINGECKO_IDS[symbolOut?.toUpperCase()];

  // Determine which IDs we need to fetch
  const idsToFetch = new Set();
  if (!STABLECOINS.has(symbolIn?.toUpperCase()))  idsToFetch.add(coinIdIn);
  if (!STABLECOINS.has(symbolOut?.toUpperCase())) idsToFetch.add(coinIdOut);

  let priceIn  = 1; // USD value per 1 token
  let priceOut = 1;

  if (idsToFetch.size > 0) {
    const ids = Array.from(idsToFetch).filter(Boolean).join(",");
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`;
    const res  = await fetch(url);
    if (!res.ok) throw new Error("Price feed unavailable");
    const data = await res.json();

    if (coinIdIn  && data[coinIdIn])  priceIn  = data[coinIdIn].usd;
    if (coinIdOut && data[coinIdOut]) priceOut = data[coinIdOut].usd;
  }

  const usdValue  = parseFloat(amountIn) * priceIn;
  const amountOut = usdValue / priceOut;

  if (!amountOut || !isFinite(amountOut)) {
    throw new Error(`Price unavailable for ${symbolIn}/${symbolOut}`);
  }

  const rate = (priceIn / priceOut).toFixed(6);
  return {
    amountOut: amountOut.toFixed(6),
    rate,
    source: "CoinGecko",
  };
}

// ── ERC-20 ABI ────────────────────────────────────────────────────────────────
export const ERC20_ABI = [
  "function decimals() view returns (uint8)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)"
];
