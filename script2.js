// Declare global variables
let web3;
let accounts;
let contractAddress;
let tokenAddress;
let contractABI;

// Function to load configuration and ABI files
async function loadConfig() {
  try {
    const configResponse = await fetch('config.json');
    if (!configResponse.ok) {
      throw new Error('Failed to fetch config.json');
    }
    const configData = await configResponse.json();
    contractAddress = configData.contractAddress;
    tokenAddress = configData.tokenAddress;

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

// Function to connect to MetaMask
async function connectMetaMask() {
  if (window.ethereum) {
    if (window.ethereum.isMetaMask) {
      web3 = new Web3(window.ethereum);
      try {
        accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log("Connected accounts:", accounts);

        // Enable claim button
        document.getElementById('claimAirdropButton').disabled = false;
        document.getElementById('metaMaskMessage').style.display = 'none';

        alert("Connected to MetaMask!");
      } catch (error) {
        console.error('MetaMask connection error:', error);
        alert('MetaMask connection failed.');
      }
    } else {
      // Display MetaMask browser message for mobile users
      document.getElementById('metaMaskMessage').style.display = 'block';
    }
  } else {
    alert('MetaMask not detected! Please install MetaMask to use this application.');
  }
}

// Function to claim the airdrop using `withdrawTokens`
async function claimAirdrop() {
  if (!web3) {
    alert("Please connect to MetaMask first.");
    return;
  }

  try {
    // Create contract instance
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    console.log("Contract instance created:", contract);

    // Call the withdrawTokens method
    const receipt = await contract.methods.withdrawTokens().send({ from: accounts[0] });
    console.log("Transaction successful:", receipt);
    alert("Airdrop claimed successfully!");
  } catch (error) {
    console.error("Airdrop claim error:", error);
    alert("Failed to claim airdrop. Please try again.");
  }
}

// Add event listeners to the buttons
window.addEventListener('DOMContentLoaded', () => {
  loadConfig();

  document.getElementById('connectButton').addEventListener('click', connectMetaMask);
  document.getElementById('claimAirdropButton').addEventListener('click', claimAirdrop);
});

