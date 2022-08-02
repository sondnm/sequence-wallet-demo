# Sequence smart wallet demo
## Set env
- Create .env file in the root directory
```
cp .env.sample .env
```
- Set the env with certain values
```
SIGNER_PRIV_KEY=''
RELAYER_PRIV_KEY=''
RPC_URL='' # change the network in this
```

## Run commands
```
# deploy wallet
yarn deploy

# get balance 
yarn balance

# get balance of an ERC20
yarn tokenBalance <CONTRACT_ADDRESS>

# send native coin
yarn send <RECIPIENT_ADDRESS> <AMOUNT>

# send ERC20 token
yarn sendToken <CONTRACT_ADDRESS> <RECIPIENT_ADDRESS> <AMOUNT>
```
