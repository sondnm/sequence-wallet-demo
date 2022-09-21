import { ethers } from "ethers";
import { UniversalDeployer } from '@0xsequence/deployer'
import {
  Factory__factory,
  GuestModule__factory,
  MainModule__factory,
  MainModuleUpgradable__factory,
  SequenceUtils__factory,
  RequireFreshSigner__factory,
} from '@0xsequence/wallet-contracts'

interface DeployWalletContext {
  factory: string,
  mainModule: string,
  mainModuleUpgradable: string,
  guestModule: string,
  sequenceUtils: string,
  libs: any,
}

interface DeployWalletContextByChainId {
  [key: number]: DeployWalletContext,
}

export const deployWalletContext = async (network: string, provider: ethers.providers.JsonRpcProvider): Promise<DeployWalletContext> => {
  let walletContexts = CONTEXTS[provider.network.chainId];

  if (!walletContexts) {
    const universalDeployer = new UniversalDeployer(network, provider)
    const factory = await universalDeployer.deploy('Factory', Factory__factory)
    const guestModule = await universalDeployer.deploy('GuestModule', GuestModule__factory)
    const mainModule = await universalDeployer.deploy('MainModule', MainModule__factory, undefined, undefined, factory.address)
    const mainModuleUpgradable = await universalDeployer.deploy('MainModuleUpgradable', MainModuleUpgradable__factory)
    const sequenceUtils = await universalDeployer.deploy('SequenceUtils', SequenceUtils__factory, undefined, undefined, factory.address, mainModule.address)
    const requireFreshSigner = await universalDeployer.deploy('RequireFreshSigner', RequireFreshSigner__factory, undefined, undefined, sequenceUtils.address)

    walletContexts = {
      factory: factory.address,
      mainModule: mainModule.address,
      mainModuleUpgradable: mainModuleUpgradable.address,
      guestModule: guestModule.address,
      sequenceUtils: sequenceUtils.address,
      libs: {
        requireFreshSigner: requireFreshSigner.address
      }
    }
  }

  console.log('walletContexts:', walletContexts);
  return walletContexts
};

const CONTEXTS: DeployWalletContextByChainId = {
  // eth mainnet
  1: {
    factory: '0xf9D09D634Fb818b05149329C1dcCFAeA53639d96',
    mainModule: '0xd01F11855bCcb95f88D7A48492F66410d4637313',
    mainModuleUpgradable: '0x7EFE6cE415956c5f80C6530cC6cc81b4808F6118',
    guestModule: '0x02390F3E6E5FD1C6786CB78FD3027C117a9955A7',
    sequenceUtils: '0xd130B43062D875a4B7aF3f8fc036Bc6e9D3E1B3E',
    libs: {
      requireFreshSigner: '0xE6B9B21C077F382333220a072e4c44280b873907',
    },
  },
  // polygon mainnet
  137: {
    factory: '0xf9D09D634Fb818b05149329C1dcCFAeA53639d96',
    mainModule: '0xd01F11855bCcb95f88D7A48492F66410d4637313',
    mainModuleUpgradable: '0x7EFE6cE415956c5f80C6530cC6cc81b4808F6118',
    guestModule: '0x02390F3E6E5FD1C6786CB78FD3027C117a9955A7',
    sequenceUtils: '0xd130B43062D875a4B7aF3f8fc036Bc6e9D3E1B3E',
    libs: {
      requireFreshSigner: '0xE6B9B21C077F382333220a072e4c44280b873907',
    },
  },

  // rinkeby
  4: {
    factory: '0xf9D09D634Fb818b05149329C1dcCFAeA53639d96',
    mainModule: '0xd01F11855bCcb95f88D7A48492F66410d4637313',
    mainModuleUpgradable: '0x7EFE6cE415956c5f80C6530cC6cc81b4808F6118',
    guestModule: '0x02390F3E6E5FD1C6786CB78FD3027C117a9955A7',
    sequenceUtils: '0xd130B43062D875a4B7aF3f8fc036Bc6e9D3E1B3E',
    libs: {
      requireFreshSigner: '0xE6B9B21C077F382333220a072e4c44280b873907',
    },
  },
  // bsc testnet
  97: {
    factory: '0xf9D09D634Fb818b05149329C1dcCFAeA53639d96',
    mainModule: '0xd01F11855bCcb95f88D7A48492F66410d4637313',
    mainModuleUpgradable: '0x7EFE6cE415956c5f80C6530cC6cc81b4808F6118',
    guestModule: '0x02390F3E6E5FD1C6786CB78FD3027C117a9955A7',
    sequenceUtils: '0xd130B43062D875a4B7aF3f8fc036Bc6e9D3E1B3E',
    libs: {
      requireFreshSigner: '0xE6B9B21C077F382333220a072e4c44280b873907',
    },
  },
  // polygon mumbai
  80001: {
    factory: '0xf9D09D634Fb818b05149329C1dcCFAeA53639d96',
    mainModule: '0xd01F11855bCcb95f88D7A48492F66410d4637313',
    mainModuleUpgradable: '0x7EFE6cE415956c5f80C6530cC6cc81b4808F6118',
    guestModule: '0x02390F3E6E5FD1C6786CB78FD3027C117a9955A7',
    sequenceUtils: '0xd130B43062D875a4B7aF3f8fc036Bc6e9D3E1B3E',
    libs: {
      requireFreshSigner: '0xE6B9B21C077F382333220a072e4c44280b873907',
    },
  },
  // bsc mainnet
  56: {
    factory: '0xf9D09D634Fb818b05149329C1dcCFAeA53639d96',
    mainModule: '0xd01F11855bCcb95f88D7A48492F66410d4637313',
    mainModuleUpgradable: '0x7EFE6cE415956c5f80C6530cC6cc81b4808F6118',
    guestModule: '0x02390F3E6E5FD1C6786CB78FD3027C117a9955A7',
    sequenceUtils: '0xd130B43062D875a4B7aF3f8fc036Bc6e9D3E1B3E',
    libs: {
      requireFreshSigner: '0xE6B9B21C077F382333220a072e4c44280b873907',
    },
  },
}
