// libraries
import * as qs from 'qs';
import * as fetch from 'node-fetch';

// utils
import { setUpWeb3GanacheAsync, baseUnitAmount, fetchERC20BalanceFactory } from './utils';

// constants
const ETHEREUM_RPC_URL = process.env.ETHEREUM_RPC_URL;
const MNEMONIC = process.env.MNEMONIC;
const DAI_CONTRACT = '0x6b175474e89094c44da98b954eedeac495271d0f'; // DAI mainnet contract address

(async () => {
    // initialize ganache fork
    const { web3Wrapper, provider } = await setUpWeb3GanacheAsync(MNEMONIC, ETHEREUM_RPC_URL);

    // get user address
    const userAddresses = await web3Wrapper.getAvailableAddressesAsync();
    const takerAddress = userAddresses[0]

    // 1. call 0x api for a quote for one dollar of DAI.
    // TODO: fetch a quote from 0x API 

    // 2. send transaction with response from 0x api
    // TODO: add web3 code to execute fetched quote
})();