# Sequence smart wallet demo
A demo on how to setup a local relayer with EOA to empower smart wallet on the backend with [0xsequence](github.com/0xsequence/sequence.js)

## Setup environment
### .env
Create .env file in the root directory
```
cp .env.sample .env
```

Set the environment variables accordingly
```
# Private key of the signer EOA which will own the smart wallet
SIGNER_PRIV_KEY=''

# Private key of the relayer EOA which will relay the signer txes
RELAYER_PRIV_KEY=''

# Connect to an RPC node. The RPC url will decide which network you're connecting to. Default: Polygon Mumbai.
RPC_URL=''
```

### Test tokens
Request for test MATIC and ERC20 tokens on Polygon faucet https://faucet.polygon.technology/

## Run commands
```
# generate signer private key
yarn generateSignerPK

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

