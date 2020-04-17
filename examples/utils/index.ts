import * as qs from 'qs';
import * as fetch from 'node-fetch';

import {
    MnemonicWalletSubprovider,
    GanacheSubprovider,
    Web3ProviderEngine,
    RPCSubprovider,
    PrivateKeyWalletSubprovider,
} from '@0x/subproviders';
import { BigNumber, providerUtils } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ERC20TokenContract } from '@0x/contracts-erc20';

export const setUpWeb3 = async (mnemonic, rpcUrl) => {
    const providerEngine = new Web3ProviderEngine();
    // Intercept calls to `eth_accounts` and always return empty
    providerEngine.addProvider(
        new MnemonicWalletSubprovider({
            mnemonic: mnemonic,
        }),
    );
    providerEngine.addProvider(new RPCSubprovider(rpcUrl));
    // Start the Provider Engine
    providerUtils.startProviderEngine(providerEngine);
    const web3Wrapper = new Web3Wrapper(providerEngine);
    return {
        provider: providerEngine,
        web3Wrapper,
    };
};
export const setUpWeb3GanacheWithPKAsync = async (privateKey, rpcUrl) => {
    console.log('forking mainnet in ganache...');
    const ganacheSubprovider = new GanacheSubprovider({
        fork: rpcUrl,
        gasLimit: 100_000_000,
        blockTime: 0,
        logger: { log: console.log },
    } as any);
    const providerEngine = new Web3ProviderEngine();
    providerEngine.addProvider(new PrivateKeyWalletSubprovider(privateKey.slice(2)));
    providerEngine.addProvider(ganacheSubprovider);
    providerUtils.startProviderEngine(providerEngine);
    const web3Wrapper = new Web3Wrapper(providerEngine);
    return {
        provider: providerEngine,
        web3Wrapper,
    };
};

export const setUpWeb3GanacheAsync = async (mnemonic, rpcUrl) => {
    console.log('forking mainnet in ganache...');
    const ganacheSubprovider = new GanacheSubprovider({
        fork: rpcUrl,
        gasLimit: 100_000_000,
        blockTime: 0,
        logger: { log: console.log },
    } as any);
    const providerEngine = new Web3ProviderEngine();
    providerEngine.addProvider(
        new MnemonicWalletSubprovider({
            mnemonic,
        }),
    );
    providerEngine.addProvider(ganacheSubprovider);
    providerUtils.startProviderEngine(providerEngine);
    const web3Wrapper = new Web3Wrapper(providerEngine);
    return {
        provider: providerEngine,
        web3Wrapper,
    };
};

export const baseUnitAmount = (unitAmount: number, decimals = 18): BigNumber => {
    return Web3Wrapper.toBaseUnitAmount(new BigNumber(unitAmount), decimals);
};

export const fetchERC20BalanceFactory = (provider, erc20Address) => {
    const daiContract = new ERC20TokenContract(erc20Address, provider);
    return async (address) => {
        return daiContract.balanceOf(address).callAsync();
    };
};
/**
 * Normally users only have ETH on their wallet, we are swapping the sufficient amount to do the Dai examples
 */
export const getDaiFrom0xApi = async (address, web3Wrapper: Web3Wrapper, buyAmount) => {
    let params = {
        sellToken: 'ETH',
        buyToken: 'DAI',
        buyAmount: buyAmount.toString(),
    };

    const res = await fetch(`https://api.0x.org/swap/v0/quote?${qs.stringify(params)}`);
    const quote = await res.json();

    await web3Wrapper.sendTransactionAsync({
        ...quote,
        ...{
            from: address,
        },
    });
};
