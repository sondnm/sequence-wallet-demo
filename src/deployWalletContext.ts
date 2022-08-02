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
export const deployWalletContext = async (network: string, provider: ethers.providers.JsonRpcProvider): Promise<DeployWalletContext> => {
  const universalDeployer = new UniversalDeployer(network, provider)
  const factory = await universalDeployer.deploy('Factory', Factory__factory)
  const guestModule = await universalDeployer.deploy('GuestModule', GuestModule__factory)
  const mainModule = await universalDeployer.deploy('MainModule', MainModule__factory, undefined, undefined, factory.address)
  const mainModuleUpgradable = await universalDeployer.deploy('MainModuleUpgradable', MainModuleUpgradable__factory)
  const sequenceUtils = await universalDeployer.deploy('SequenceUtils', SequenceUtils__factory, undefined, undefined, factory.address, mainModule.address)
  const requireFreshSigner = await universalDeployer.deploy('RequireFreshSigner', RequireFreshSigner__factory, undefined, undefined, sequenceUtils.address)

  return {
    factory: factory.address,
    mainModule: mainModule.address,
    mainModuleUpgradable: mainModuleUpgradable.address,
    guestModule: guestModule.address,
    sequenceUtils: sequenceUtils.address,
    libs: {
      requireFreshSigner: requireFreshSigner.address
    }
  }
};
