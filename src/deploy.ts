import { ethers, BigNumber } from "ethers";
import { Wallet } from "@0xsequence/wallet";
import {
  provider,
  getNetworkName,
  relayer,
} from "./helpers";
import { deployWalletContext } from "./deployWalletContext";

export const deployWallet = async (EOA: ethers.Wallet): Promise<Wallet> => {
  await provider.getNetwork();
  const networkName = getNetworkName(provider.network.chainId);
  const context = await deployWalletContext(networkName, provider);
  const wallet = new Wallet({
    context,
    config: {
      threshold: 1,
      signers: [{ weight: 1, address: EOA.address }],
    },
  });
  let tx = await relayer.deployWallet(wallet.config, wallet.context);
  console.log(">>> deploy done");
  console.log("tx hash:", tx.hash);
  return wallet;
};

const compareAddr = (
  a: string | ethers.Wallet,
  b: string | ethers.Wallet
) => {
  const addrA = typeof a === "string" ? a : a.address;
  const addrB = typeof b === "string" ? b : b.address;

  const bigA = ethers.BigNumber.from(addrA);
  const bigB = ethers.BigNumber.from(addrB);

  if (bigA.lt(bigB)) {
    return -1;
  } else if (bigA.eq(bigB)) {
    return 0;
  } else {
    return 1;
  }
}

const encodeImageHash = (
  threshold: BigNumber,
  accounts: {
    weight: BigNumber;
    address: string;
  }[]
) => {
  const sorted = accounts.sort((a, b) => compareAddr(a.address, b.address));
  let imageHash = ethers.utils.solidityPack(["uint256"], [threshold]);

  sorted.forEach(
    (a) =>
      (imageHash = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ["bytes32", "uint8", "address"],
          [imageHash, a.weight, a.address]
        )
      ))
  );

  return imageHash;
}

const WALLET_CODE =
  "0x603a600e3d39601a805130553df3363d3d373d3d3d363d30545af43d82803e903d91601857fd5bf3";
const addressOf = (
  factory: string,
  mainModule: string,
  imageHash: string
): string => {
  const codeHash = ethers.utils.keccak256(
    ethers.utils.solidityPack(
      ["bytes", "bytes32"],
      [WALLET_CODE, ethers.utils.hexZeroPad(mainModule, 32)]
    )
  );

  const hash = ethers.utils.keccak256(
    ethers.utils.solidityPack(
      ["bytes1", "address", "bytes32", "bytes32"],
      ["0xff", factory, imageHash, codeHash]
    )
  );

  return ethers.utils.getAddress(ethers.utils.hexDataSlice(hash, 12));
}
