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
  // Check if the browser supports Ethereum provider
  if (window.ethereum) {
    // Check if MetaMask is installed
    if (window.ethereum.isMetaMask) {
      // Initialize Web3 with the MetaMask provider
      web3 = new Web3(window.ethereum);
      try {
        // Request account access
        accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log("Connected accounts:", accounts);

        // Enable claim button and disable connect button
        document.getElementById('claimAirdropButton').disabled = false;
        document.getElementById('connectButton').disabled = true;

        alert("Connected to MetaMask!");
      } catch (error) {
        alert('MetaMask connection failed');
        console.error('MetaMask connection error:', error);
      }
    } else {
      // If MetaMask is not available on mobile (not in MetaMask browser)
      document.getElementById('metaMaskMessage').style.display = 'block';
    }
  } else {
    // If MetaMask is not detected at all
    alert('MetaMask not detected! Please install MetaMask to use this application.');
  }
}

// Function to claim the airdrop
async function claimAirdrop() {
  if (!web3) {
    alert("Please connect to MetaMask first.");
    return;
  }

  try {
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    console.log("Contract instance created:", contract);

    const receipt = await contract.methods.claimTokens().send({ from: accounts[0] });
    console.log("Transaction successful:", receipt);
    alert("Airdrop claimed successfully!");
  } catch (error) {
    console.error("Airdrop claim error:", error);
    alert("Failed to claim airdrop. Please try again.");
  }
}

// Add event listeners to the buttons
window.addEventListener('DOMContentLoaded', () => {
  // Load configuration and ABI when the page loads
  loadConfig();

  // Add click event to the connect button
  document.getElementById('connectButton').addEventListener('click', connectMetaMask);

  // Add click event to the claim airdrop button
  document.getElementById('claimAirdropButton').addEventListener('click', claimAirdrop);
});

