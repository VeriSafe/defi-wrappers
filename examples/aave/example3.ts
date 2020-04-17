/**
 * This example shows how to lend 1 Dai to Aave protocol, borrow 0.1 Dai with it and repay it back
 * Min Requirements: 1 Dai on mainnet wallet, ETH to pay the gas
 */

import { setUpWeb3GanacheAsync, baseUnitAmount, getDaiFrom0xApi, setUpWeb3GanacheWithPKAsync } from '../utils';
import { LendingPoolAddressesProviderContract } from '../../generated-wrappers/lending_pool_addresses_provider';
import { ERC20TokenContract } from '@0x/contracts-erc20';
import { LendingPoolContract } from '../../generated-wrappers/lending_pool';
import { AtokenContract } from '../../generated-wrappers/atoken';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { BigNumber } from '@0x/utils';

// constants
const ETHEREUM_RPC_URL = process.env.ETHEREUM_RPC_URL;
const MNEMONIC = process.env.MNEMONIC;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const USE_MENMONIC = process.env.USE_MENMONIC === 'false' ? false : true;
const DAI_CONTRACT = '0x6b175474e89094c44da98b954eedeac495271d0f'; // DAI mainnet contract address

const ADAI_CONTRACT = '0xfC1E690f61EFd961294b3e1Ce3313fBD8aa4f85d'; // ADAI mainnet contract address
const AETH_CONTRACT = '0x3a3a65aab0dd2a17e3f1947ba16138cd37d08c04'; // AETH mainnet contract address
const REFERRAL_CODE = 0;
const INTEREST_RATE_MODE = new BigNumber(2); // variable rate

const lpAddressProviderAddress = '0x24a42fD28C976A61Df5D00D0599C34c4f90748c8';

(async () => {
    // initialize ganache fork
    const { web3Wrapper, provider } = USE_MENMONIC
        ? await setUpWeb3GanacheAsync(MNEMONIC, ETHEREUM_RPC_URL)
        : await setUpWeb3GanacheWithPKAsync(PRIVATE_KEY, ETHEREUM_RPC_URL);
    // Get lending pool core address

    // get user address
    const userAddresses = await web3Wrapper.getAvailableAddressesAsync();
    const userAddress = userAddresses[0];
    console.log(userAddress);
    console.log(await web3Wrapper.getBalanceInWeiAsync(userAddress));
    const lpAddressProvider = new LendingPoolAddressesProviderContract(lpAddressProviderAddress, provider);
    // get current lpCoreAddress
    const lpCoreAddress = await lpAddressProvider.getLendingPoolCore().callAsync();

    // get 1 dai in wei
    const daiAmountinWei = baseUnitAmount(1);

    // get current lending pool address
    const lpAddress = await lpAddressProvider.getLendingPool().callAsync();
    // init contract wrapper
    const lpContract = new LendingPoolContract(lpAddress, provider);
    console.log(`Depositing DAI on Lending pool`);
    // deposit ETH on the contract
    // init dai contract
    const daiContract = new ERC20TokenContract(DAI_CONTRACT, provider);
    await daiContract.approve(lpCoreAddress, daiAmountinWei).sendTransactionAsync({ from: userAddress });
    await lpContract.deposit(DAI_CONTRACT, daiAmountinWei, REFERRAL_CODE).sendTransactionAsync({ from: userAddress });

    const aDaiContract = new AtokenContract(ADAI_CONTRACT, provider);

    console.log(`Borrowing Dai from Lending pool `);
    // borrow 1 Dai asset from pool
    // get 0.1 eth in wei
    const daiBorrowAmountinWei = baseUnitAmount(0.11);
    await lpContract
        .borrow(DAI_CONTRACT, daiBorrowAmountinWei, INTEREST_RATE_MODE, REFERRAL_CODE)
        .sendTransactionAsync({ from: userAddress });
    // calling user reserve data to know how much user have borrowed
    console.log(`Fetching user reserve data `);
    let userDaiReserveData = await lpContract.getUserReserveData(DAI_CONTRACT, userAddress).callAsync();
    const balanceDai = await daiContract.balanceOf(userAddress).callAsync();
    const decimalsDai = new BigNumber(await aDaiContract.decimals().callAsync());
    const balanceDaiUnits = Web3Wrapper.toUnitAmount(balanceDai, decimalsDai.toNumber());
    let currentBorrowDaiBalance = Web3Wrapper.toUnitAmount(userDaiReserveData[2], decimalsDai.toNumber());
    let principalBorrowDaiBalance = Web3Wrapper.toUnitAmount(userDaiReserveData[3], decimalsDai.toNumber());

    console.log(`Should have 1 Dai Balance or more: Current Dai Balance: ${balanceDaiUnits.toFixed(2)}`);
    console.log(
        `Should have current borrow dai balance of 1: Current Borrow Dai Balance: ${currentBorrowDaiBalance.toFixed(
            2,
        )}`,
    );
    console.log(
        `Should have principal borrow dai balance of 1: Principal Borrow Dai Balance: ${principalBorrowDaiBalance.toFixed(
            2,
        )}`,
    );

    console.log(`Repaying back 1 Dai borrowed`);
    // Repaying back partially own loan. Note: Need to check the amount needed to pay back fully loan
    await lpContract.repay(DAI_CONTRACT, baseUnitAmount(0.05), userAddress).sendTransactionAsync({ from: userAddress });
    userDaiReserveData = await lpContract.getUserReserveData(DAI_CONTRACT, userAddress).callAsync();
    currentBorrowDaiBalance = Web3Wrapper.toUnitAmount(userDaiReserveData[2], decimalsDai.toNumber());
    principalBorrowDaiBalance = Web3Wrapper.toUnitAmount(userDaiReserveData[3], decimalsDai.toNumber());
    console.log(
        `Should have current borrow dai balance around 0 : Current Borrow Dai Balance: ${currentBorrowDaiBalance.toFixed(
            2,
        )}`,
    );
    console.log(
        `Should have principal borrow dai balance around 0: Principal Borrow Dai Balance: ${principalBorrowDaiBalance.toFixed(
            2,
        )}`,
    );
})();
