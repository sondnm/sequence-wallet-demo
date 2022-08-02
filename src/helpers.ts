require("dotenv").config();
import { ethers, BigNumber } from "ethers";
import { LocalRelayer } from "@0xsequence/relayer";
import { Wallet } from "@0xsequence/wallet";
import { TransactionResponse } from '@0xsequence/transactions';

export const erc20Interface = new ethers.utils.Interface([
  "function transfer(address _to, uint256 _value)",
  "function balanceOf(address _owner) view returns (uint256)",
]);

export const RPC_URL =
  process.env.RPC_URL || "https://matic-mumbai.chainstacklabs.com";
export const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

// const depositPrivKey = ethers.utils.hexlify(ethers.utils.randomBytes(32));
export const signerEOA = new ethers.Wallet(
  process.env.SIGNER_PRIV_KEY!,
  provider
);
export const relayerEOA = new ethers.Wallet(
  process.env.RELAYER_PRIV_KEY!,
  provider
);
export const relayer = new LocalRelayer(relayerEOA);

export const getNetworkName = (chainId: number): string => {
  if (chainId == 1) {
    return "ethereum";
  } else if (chainId == 3) {
    return "ropsten";
  } else if (chainId == 4) {
    return "rinkeby";
  } else if (chainId == 5) {
    return "goerli";
  } else if (chainId == 137) {
    return "polygon";
  } else if (chainId == 80001) {
    return "mumbai";
  } else if (chainId == 56) {
    return "bsc";
  } else if (chainId == 97) {
    return "bsc-testnet";
  } else {
    return "error";
  }
};

export const sendNative = async (
  wallet: Wallet,
  recipientAddress: string,
  amount: BigNumber
) => {
  return sendMultiTxes(wallet, [{ recipientAddress, amount }]);
};

export const sendERC20 = async (
  wallet: Wallet,
  tokenAddress: string,
  recipientAddress: string,
  amount: BigNumber
): Promise<TransactionResponse> => {
  return sendMultiTxes(wallet, [{ tokenAddress, recipientAddress, amount }]);
};

interface TxData {
  recipientAddress: string;
  amount: BigNumber;
  tokenAddress?: string;
}
export const sendMultiTxes = async (wallet: Wallet, data: TxData[]): Promise<TransactionResponse> => {
  const txes = data.map(item => {
    const { tokenAddress, recipientAddress, amount } = item;
    if (tokenAddress) {
      return {
        to: tokenAddress,
        data: erc20Interface.encodeFunctionData("transfer", [
          recipientAddress,
          amount,
        ]),
      }
    } else {
      return {
        to: recipientAddress,
        value: amount,
      }
    }
  });

  return wallet.sendTransactionBatch(txes);
};
