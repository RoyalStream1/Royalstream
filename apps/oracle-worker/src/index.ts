import cron from 'node-cron';
import { ManualSubmissionSource, SpotifyRevenueSource } from './adapters';
import { RoyaltyVaultClient, TESTNET_CONFIG } from '@royalstream/stellar-sdk';

console.log('[Oracle Worker] Starting RoyalStream Revenue Ingestion & On-Chain Attestation Service...');

const vaultClient = new RoyaltyVaultClient(TESTNET_CONFIG);
const manualAdapter = new ManualSubmissionSource();
const spotifyAdapter = new SpotifyRevenueSource();

const oracleAddress = process.env.ORACLE_ADDRESS || 'GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCC5E7';

async function processRevenueAttestations() {
  console.log(`\n--- [Oracle Cron Job ${new Date().toISOString()}] Checking Pending Revenue Submissions ---`);

  // Target mock active vault
  const targetVaultContract = process.env.VAULT_CONTRACT_ID || 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMWAXA7K4PXZPD';
  const mockCreatorId = 'GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFXYCZW6AIKV7PG34AGTY';
  const currentPeriod = '2026-Q1';

  try {
    console.log(`[Oracle] Fetching revenue data via ManualSubmissionSource adapter...`);
    const report = await manualAdapter.fetchRevenue(mockCreatorId, currentPeriod);
    console.log(`[Oracle] Attestation validated: Amount = ${report.amountStroops} stroops for period ${report.period}`);

    console.log(`[Oracle] Triggering Soroban vault deposit_revenue on-chain...`);
    const txResult = await vaultClient.depositRevenue(targetVaultContract, oracleAddress, report.amountStroops);

    console.log(`[Oracle] Deposit transaction submitted successfully! TxHash: ${txResult.txHash}`);
  } catch (err) {
    console.error('[Oracle Worker Error]:', err);
  }
}

// Schedule automated attestation run every 5 minutes (or run immediately once on startup)
cron.schedule('*/5 * * * *', () => {
  processRevenueAttestations();
});

// Run immediate initial execution cycle
processRevenueAttestations();
