require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const HDWalletProvider = require('@truffle/hdwallet-provider');
const { Web3 } = require('web3');
const { abi, evm } = require('./compile');
const compiledFactory = require("./build/CampaignFactory.json");

const provider = new HDWalletProvider(
  process.env.MNEMONIC,
  process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ gas: '10000000', from: accounts[0] });

  console.log("Interface: ", JSON.stringify(compiledFactory.abi, null, 2));
  console.log('Contract deployed to', result.options.address);
  provider.engine.stop(); // stops the connection so the script can exit
}
deploy();
