require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const HDWalletProvider = require('@truffle/hdwallet-provider');
const { Web3 } = require('web3');
const { abi, evm } = require('./compile');
const compiledFactory = require("./build/CampaignFactory.json");

const provider = new HDWalletProvider(
  process.env.MNEMONIC,
  process.env.SEPOLIA_RPC_URL
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

// neu; 0xfb5ECC61633D93BC3A5cc1Eeb47D8D0516c1EeEc

// neu: 0x04a18e4Fa2D04C0987d83703124EfF5b58c6937B


// 0xC799D3d734f99832C0Cbbe0c30D816FAfEDB3251


// 0x4EcB76D9CD4c4Cf48DFc97B9FCf3d40e58ee154b