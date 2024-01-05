const Web3 = require('web3');
const contract = require('path/to/cb.sol');

// Connect to the Ethereum network
const web3 = new Web3('http://localhost:8545');

// Deploy the smart contract
async function deployContract() {
  try {
    const accounts = await web3.eth.getAccounts();
    const contractInstance = new web3.eth.Contract(contract.abi);

    const deployment = contractInstance.deploy({
      data: contract.bytecode,
      arguments: [arg1, arg2, ...] // Pass any constructor arguments here
    });

    const deployedContract = await deployment.send({
      from: accounts[0],
      gas: 2000000 // Adjust the gas limit as per your requirement
    });

    console.log('Contract deployed at address:', deployedContract.options.address);
  } catch (error) {
    console.error('Error deploying contract:', error);
  }
}

deployContract();
