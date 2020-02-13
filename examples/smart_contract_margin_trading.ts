// libraries
import * as qs from 'qs';
import * as fetch from 'node-fetch';
import { Web3Wrapper } from '@0x/web3-wrapper';

// utils
import { setUpWeb3GanacheAsync, baseUnitAmount } from './utils';
import { marginTradingMigrationAsync } from '../migrations/migration';

// wrappers
import { SimpleMarginTradingContract } from '../generated-wrappers/simple_margin_trading';

// constants
const ETHEREUM_RPC_URL = process.env.ETHEREUM_RPC_URL;
const MNEMONIC = process.env.MNEMONIC;
const WETH_CONTRACT = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'; // WETH mainnet contract address
const DAI_CONTRACT = '0x6b175474e89094c44da98b954eedeac495271d0f'; // DAI mainnet contract address

const openAsync = async (web3Wrapper: Web3Wrapper, contract: SimpleMarginTradingContract) => {
    // user address interacting with margin contract
    const userAddresses = await web3Wrapper.getAvailableAddressesAsync();
    const takerAddress = userAddresses[0];

    // 1. perform some calculations for the contract
    // TODO: calculations for leverage

    // 2. fetch a quote from 0x API
    // TODO: fetch quote from 0x API 

    // TODO: convert quote to the contract quote format 

    // 3. execute a smart contract call to open a margin position
    // TODO: interact with the margin trading contract
};

const closeAsync = async (web3Wrapper: Web3Wrapper, contract: SimpleMarginTradingContract) => {
    // user address interacting with margin contract
    const userAddresses = await web3Wrapper.getAvailableAddressesAsync();
    const takerAddress = userAddresses[0];

    // 1. get the amount of DAI to be repayed by contract when closing position
    // TODO: add snippet to callAsync the contract for dai borrow balance

    // 2. fetch 0x API quote to buy DAI for repayment
    // TODO: fetch quote from 0x API 


    // TODO: convert quote to the contract quote format ;

    // 3. execute a smart contract call to open a margin position
    // TODO: interact with the margin trading contract
};

((async () => {
    const { web3Wrapper, provider } = await setUpWeb3GanacheAsync(MNEMONIC, ETHEREUM_RPC_URL);
    const { simpleMarginTradingAddress } = await marginTradingMigrationAsync(provider, web3Wrapper);

    const contract = new SimpleMarginTradingContract(simpleMarginTradingAddress, provider);
    
    // open a position
    await openAsync(web3Wrapper, contract);

    // immediately close the position
    await closeAsync(web3Wrapper, contract);
})())