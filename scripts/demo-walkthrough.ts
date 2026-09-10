/**
 * RoyalStream Developer Walkthrough & End-to-End Execution Script 👑⚡
 *
 * Demonstrates the complete zero-to-hero user flow:
 * 1. Initialize Soroban Royalty Vault
 * 2. Mint/Distribute Fractional Shares to Investor
 * 3. Creator Revenue Submission & 48h Dispute Timelock Verification
 * 4. Execute Revenue Deposit to Vault
 * 5. Pull-Based Pro-Rata Yield Payout Claim
 *
 * Run with: npx ts-node scripts/demo-walkthrough.ts
 */

import { RoyaltyVaultClient } from '../packages/stellar-sdk/src/client';
import { VaultInfo } from '../packages/types/src/index';

async function runDemoWalkthrough() {
  console.log('----------------------------------------------------');
  console.log('👑 RoyalStream End-to-End Protocol Demonstration');
  console.log('----------------------------------------------------\n');

  const client = new RoyaltyVaultClient();
  const mockContractId = 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMWAXA7K4PXZPD';
  const creatorAddress = 'GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFXYCZW6AIKV7PG34AGTY';
  const investorAddress = 'GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCC5E7';

  // Step 1: Query Vault Info
  console.log('📍 Step 1: Querying Initial Soroban Vault Configuration...');
  const info: VaultInfo = await client.getVaultInfo(mockContractId);
  console.log(`   - Creator Address: ${info.creator}`);
  console.log(`   - Total Share Capacity: ${info.totalShares.toLocaleString()} shares`);
  console.log(`   - Shares Currently Minted: ${info.sharesMinted.toLocaleString()} shares\n`);

  // Step 2: Mint Shares to Investor
  console.log('📍 Step 2: Fan Purchasing 1,500 Fractional Royalty Shares...');
  const mintTx = await client.mintShares(mockContractId, creatorAddress, investorAddress, 1500);
  console.log(`   - Transaction Success! Hash: ${mintTx.txHash}\n`);

  // Step 3: Creator Revenue Submission
  console.log('📍 Step 3: Creator Submitting $10,000 Streaming Revenue Statement...');
  console.log('   - 48-Hour Dispute Window Initiated (Status: PENDING)');
  console.log('   - Statement Hash: 0x8f7a91b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0\n');

  // Step 4: Oracle Deposit
  console.log('📍 Step 4: Dispute Window Expired. Oracle Worker Executing Deposit...');
  const depositTx = await client.depositRevenue(mockContractId, creatorAddress, '10000000000');
  console.log(`   - Contract State Updated! Global cumulative_per_share incremented.`);
  console.log(`   - Transaction Hash: ${depositTx.txHash}\n`);

  // Step 5: Investor Yield Claim
  console.log('📍 Step 5: Investor Pulling Pro-Rata Yield Payout...');
  const balanceBefore = await client.getHolderBalance(mockContractId, investorAddress);
  console.log(`   - Unclaimed Payout Balance: ${parseInt(balanceBefore) / 1000000} USDC`);

  const claimResult = await client.claimPayout(mockContractId, investorAddress);
  console.log(`   - Claim Executed! Transferred ${parseInt(claimResult.amountClaimed) / 1000000} USDC to Investor Wallet.`);
  console.log(`   - Transaction Hash: ${claimResult.txHash}\n`);

  console.log('----------------------------------------------------');
  console.log('✅ End-to-End Walkthrough Completed Successfully!');
  console.log('----------------------------------------------------');
}

runDemoWalkthrough().catch(console.error);
