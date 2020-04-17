/**
 * This example shows how to lend 1 DAI to Aave protocol and redeem it back
 * Min Requirements: 0.1 ETH on mainnet wallet or 1 DAI, if you don't have the
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
const REFERRAL_CODE = 0;

const lpAddressProviderAddress = '0x24a42fD28C976A61Df5D00D0599C34c4f90748c8';

(async () => {
    // initialize ganache fork
    const { web3Wrapper, provider } = USE_MENMONIC
        ? await setUpWeb3GanacheAsync(MNEMONIC, ETHEREUM_RPC_URL)
        : await setUpWeb3GanacheWithPKAsync(PRIVATE_KEY, ETHEREUM_RPC_URL);
    // Get lending pool core address

    // get user address
    const userAddresses = await web3Wrapper.getAvailableAddressesAsync();
    const lenderAddress = userAddresses[0];
    console.log(lenderAddress);
    console.log(await web3Wrapper.getBalanceInWeiAsync(lenderAddress));
    const lpAddressProvider = new LendingPoolAddressesProviderContract(lpAddressProviderAddress, provider);
    // get current lpCoreAddress
    const lpCoreAddress = await lpAddressProvider.getLendingPoolCore().callAsync();
    console.log(`Current Lending pool Core address: ${lpCoreAddress.toString()}`);
    // init dai contract
    const daiContract = new ERC20TokenContract(DAI_CONTRACT, provider);
    // get one dai in wei
    const daiAmountinWei = baseUnitAmount(1);

    // if user don't have DAI get it from 0xApi
    const userDaiBalance = await daiContract.balanceOf(lenderAddress).callAsync();
    if (userDaiBalance.lt(daiAmountinWei)) {
        getDaiFrom0xApi(lenderAddress, web3Wrapper, daiAmountinWei);
    }
    console.log(`Giving allowance to Lending pool`);
    // give sufficient allowance to lending pool core address
    await daiContract.approve(lpCoreAddress, daiAmountinWei).sendTransactionAsync({ from: lenderAddress });
    console.log(`Allowance to Lending pool granted`);
    // get current lending pool address
    console.log(`Get Current Lending pool address`);
    const lpAddress = await lpAddressProvider.getLendingPool().callAsync();
    console.log(`Current Lending pool address:${lpAddress}`);

    // init contract wrapper
    const lpContract = new LendingPoolContract(lpAddress, provider);
    console.log(`Depositing Dai on Lending pool`);
    // deposit Dai on the contract
    await lpContract.deposit(DAI_CONTRACT, daiAmountinWei, REFERRAL_CODE).sendTransactionAsync({ from: lenderAddress });

    console.log(`Fetching Adai state if it minted deposited Dai`);
    const aDaiContract = new AtokenContract(ADAI_CONTRACT, provider);

    let balanceAdai = await aDaiContract.balanceOf(lenderAddress).callAsync();
    const decimalsAdai = new BigNumber(await aDaiContract.decimals().callAsync());
    console.log(decimalsAdai);
    let balanceAdaiUnits = Web3Wrapper.toUnitAmount(balanceAdai, decimalsAdai.toNumber());

    console.log(`Should have 1 aDai Balance or more: Current Adai Balance: ${balanceAdaiUnits.toFixed(2)}`);

    console.log('Check if reedem will fail');
    const isAllowed = await aDaiContract.isTransferAllowed(lenderAddress, balanceAdai).callAsync();
    console.log(`Redeem is ${isAllowed ? 'allowed' : 'not allowed'}`);

    console.log(`Redeem aDai: ${balanceAdaiUnits.toFixed(2)}`);
    // redeem back the dai
    try {
        // TODO: check why this is failing on ganache
        await aDaiContract.redeem(balanceAdai).sendTransactionAsync({ from: lenderAddress });
    } catch (e) {
        console.log(e);
    }
    balanceAdai = await aDaiContract.balanceOf(lenderAddress).callAsync();
    balanceAdaiUnits = Web3Wrapper.toUnitAmount(balanceAdai, decimalsAdai.toNumber());
    console.log(
        `Should have less 1 aDai Balance or more from before the redeem: Current Adai Balance: ${balanceAdaiUnits.toFixed(
            2,
        )}`,
    );
})();
