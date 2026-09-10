#![cfg(test)]

use super::*;
use soroban_sdk::{
    testutils::Address as _,
    token, Address, Env,
};

fn setup_test() -> (
    Env,
    RoyaltyVaultContractClient<'static>,
    Address, // creator / admin
    Address, // oracle
    Address, // buyer1
    Address, // buyer2
    Address, // token asset address
    token::StellarAssetClient<'static>,
) {
    let env = Env::default();
    env.mock_all_auths();

    let creator = Address::generate(&env);
    let oracle = Address::generate(&env);
    let buyer1 = Address::generate(&env);
    let buyer2 = Address::generate(&env);
    let token_admin = Address::generate(&env);

    let token_address = env.register_stellar_asset_contract(token_admin.clone());
    let token_admin_client = token::StellarAssetClient::new(&env, &token_address);

    let contract_id = env.register_contract(None, RoyaltyVaultContract);
    let client = RoyaltyVaultContractClient::new(&env, &contract_id);

    (
        env,
        client,
        creator,
        oracle,
        buyer1,
        buyer2,
        token_address,
        token_admin_client,
    )
}

#[test]
fn test_initialize_and_vault_info() {
    let (env, client, creator, oracle, _buyer1, _buyer2, token_address, _token_admin) = setup_test();

    let total_shares = 10_000u32;
    let period_start = 1700000000u64;
    let period_end = 1730000000u64;

    client.initialize(&creator, &oracle, &token_address, &total_shares, &period_start, &period_end);

    let info = client.get_vault_info();
    assert_eq!(info.creator, creator);
    assert_eq!(info.oracle, oracle);
    assert_eq!(info.asset, token_address);
    assert_eq!(info.total_shares, 10_000);
    assert_eq!(info.shares_minted, 0);
    assert_eq!(info.total_deposited, 0);
}

#[test]
fn test_deposit_before_shares_minted() {
    let (env, client, creator, oracle, buyer1, _buyer2, token_address, token_admin) = setup_test();

    client.initialize(&creator, &oracle, &token_address, &10_000, &100, &200);

    // Mint revenue token to creator for deposit
    token_admin.mint(&creator, &500_000);

    // Creator deposits 500,000 before any shares sold
    client.deposit_revenue(&creator, &500_000);

    let info = client.get_vault_info();
    assert_eq!(info.total_deposited, 500_000);

    // Now mint 5,000 shares (50%) to buyer1
    client.mint_shares(&buyer1, &5_000);

    // buyer1 balance for past deposit before buying is 0 if last_claimed initialized to current_cumulative
    let balance = client.get_holder_balance(&buyer1);
    assert_eq!(balance, 0);
}

#[test]
fn test_cumulative_deposit_claim_cycle() {
    let (env, client, creator, oracle, buyer1, buyer2, token_address, token_admin) = setup_test();

    let total_shares = 10_000u32;
    client.initialize(&creator, &oracle, &token_address, &total_shares, &100, &200);

    // Mint shares: buyer1 gets 6,000 (60%), buyer2 gets 4,000 (40%)
    client.mint_shares(&buyer1, &6_000);
    client.mint_shares(&buyer2, &4_000);

    // Mint tokens to oracle to make deposits
    token_admin.mint(&oracle, &1_000_000);

    // 1st Deposit: 100,000 stroops/cents
    client.deposit_revenue(&oracle, &100_000);

    // Check unclaimed balances: buyer1 should get 60,000, buyer2 should get 40,000
    assert_eq!(client.get_holder_balance(&buyer1), 60_000);
    assert_eq!(client.get_holder_balance(&buyer2), 40_000);

    // buyer1 claims payout
    let claimed1 = client.claim_payout(&buyer1);
    assert_eq!(claimed1, 60_000);
    assert_eq!(client.get_holder_balance(&buyer1), 0);

    // buyer2 balance remains 40,000
    assert_eq!(client.get_holder_balance(&buyer2), 40_000);

    // 2nd Deposit: 200,000 stroops/cents
    client.deposit_revenue(&oracle, &200_000);

    // buyer1 (60%) should get additional 120,000 -> total 120,000
    // buyer2 (40%) should get additional 80,000 -> total 40,000 + 80,000 = 120,000
    assert_eq!(client.get_holder_balance(&buyer1), 120_000);
    assert_eq!(client.get_holder_balance(&buyer2), 120_000);

    let claimed1_round2 = client.claim_payout(&buyer1);
    let claimed2 = client.claim_payout(&buyer2);

    assert_eq!(claimed1_round2, 120_000);
    assert_eq!(claimed2, 120_000);

    assert_eq!(client.get_holder_balance(&buyer1), 0);
    assert_eq!(client.get_holder_balance(&buyer2), 0);
}

#[test]
fn test_share_transfer_mid_period() {
    let (env, client, creator, oracle, buyer1, buyer2, token_address, token_admin) = setup_test();

    let total_shares = 10_000u32;
    client.initialize(&creator, &oracle, &token_address, &total_shares, &100, &200);

    // buyer1 buys all 10,000 shares (100%)
    client.mint_shares(&buyer1, &10_000);

    token_admin.mint(&oracle, &100_000);

    // Deposit 1: 100,000 revenue
    client.deposit_revenue(&oracle, &100_000);

    // buyer1 transfers 3,000 shares to buyer2 mid-period
    client.transfer_shares(&buyer1, &buyer2, &3_000);

    // buyer1 should still hold unclaimed 100,000 earned prior to transfer
    assert_eq!(client.get_holder_balance(&buyer1), 100_000);
    // buyer2 should have 0 unclaimed earned prior to transfer
    assert_eq!(client.get_holder_balance(&buyer2), 0);

    // Deposit 2: 50,000 revenue
    token_admin.mint(&oracle, &50_000);
    client.deposit_revenue(&oracle, &50_000);

    // buyer1 (7,000 shares = 70% of 50,000 = 35,000) -> Total = 100,000 + 35,000 = 135,000
    // buyer2 (3,000 shares = 30% of 50,000 = 15,000) -> Total = 15,000
    assert_eq!(client.get_holder_balance(&buyer1), 135_000);
    assert_eq!(client.get_holder_balance(&buyer2), 15_000);

    let claimed1 = client.claim_payout(&buyer1);
    let claimed2 = client.claim_payout(&buyer2);

    assert_eq!(claimed1, 135_000);
    assert_eq!(claimed2, 15_000);
}

#[test]
#[should_panic]
fn test_unauthorized_deposit_fails() {
    let (env, client, creator, oracle, buyer1, _buyer2, token_address, token_admin) = setup_test();

    client.initialize(&creator, &oracle, &token_address, &10_000, &100, &200);

    token_admin.mint(&buyer1, &10_000);

    // buyer1 (neither creator nor oracle) attempts deposit -> must fail
    client.deposit_revenue(&buyer1, &10_000);
}
