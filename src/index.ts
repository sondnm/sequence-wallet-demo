#!/usr/bin/env node

import { ethers, BigNumber } from "ethers";
import { Wallet } from "@0xsequence/wallet";
import {
  relayerEOA,
  signerEOA,
  provider,
  relayer,
  sendNative,
  sendERC20,
  erc20Interface,
} from "./helpers";
import { deployWallet } from "./deploy";
import { Command } from "commander";
const program = new Command();

program
  .name("smart-wallet")
  .version("0.0.1")
  .description("A demo CLI for smart wallet");

program
  .command("deploy")
  .description("deploy smart wallet for signer EOA")
  .action(async () => {
    const wallet = await deployWallet(signerEOA);
    console.log("Smart wallet deployed:", wallet);
  });

program
  .command("balance")
  .description("get balance of the smart wallet")
  .action(async () => {
    const wallet = (await Wallet.singleOwner(signerEOA)).connect(
      provider,
      relayer
    );
    const walletBalance = ethers.utils.formatEther(
      await provider.getBalance(wallet.address)
    );
    console.log("Wallet's balance:", walletBalance);
  });

program
  .command("tokenBalance")
  .argument("<contractAddress>", "Contract address of the ERC20 token")
  .description("get token balance of the smart wallet")
  .action(async (contractAddress: string) => {
    const wallet = (await Wallet.singleOwner(signerEOA)).connect(
      provider,
      relayer
    );
    const token = new ethers.Contract(
      contractAddress,
      erc20Interface,
      relayerEOA
    );
    const walletBalance = ethers.utils.formatEther(
      await token.balanceOf(wallet.address)
    );
    console.log("Wallet's ERC20 balance:", walletBalance);
  });

program
  .command("send")
  .description("send native coin to an address")
  .argument("<recipientAddress>", "Account of the receiver")
  .argument("<amount>", "Amount to be transferred out")
  .action(async (recipientAddress: string, amount: string) => {
    const wallet = (await Wallet.singleOwner(signerEOA)).connect(
      provider,
      relayer
    );
    const txResponse = await sendNative(
      wallet,
      relayerEOA.address,
      ethers.utils.parseEther(amount)
    );
    console.log("TX hash:", txResponse.hash);
  });

program
  .command("sendToken")
  .description("send ERC20 token to an address")
  .argument("<contractAddress>", "Contract address of the ERC20 token")
  .argument("<recipientAddress>", "Account of the receiver")
  .argument("<amount>", "Amount to be transferred out")
  .action(
    async (
      contractAddress: string,
      recipientAddress: string,
      amount: string
    ) => {
      const wallet = (await Wallet.singleOwner(signerEOA)).connect(
        provider,
        relayer
      );
      const token = new ethers.Contract(
        contractAddress,
        erc20Interface,
        relayerEOA
      );
      const walletBalance = ethers.utils.formatEther(
        await token.balanceOf(wallet.address)
      );
      console.log("Wallet's ERC20 balance:", walletBalance);
      const txResponse = await sendERC20(
        wallet,
        token.address,
        relayerEOA.address,
        ethers.utils.parseEther(amount)
      );
      console.log("TX hash:", txResponse.hash);
    }
  );

program.command("getConfig").action(async (contractAddress: string) => {
  console.log("signerEOA:", signerEOA.address);
  console.log("relayerEOA:", relayerEOA.address);
});

program.parse();
