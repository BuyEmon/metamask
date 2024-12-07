// Declare global variables
let web3;
let accounts;
let contractAddress;
let tokenAddress;
let contractABI;

// Function to load configuration and ABI files
async function loadConfig() {
  try {
    // Load contract and token addresses from config.json
    const configResponse = await fetch('config.json');
    if (!configResponse.ok) {
      throw new Error('Failed to fetch config.json');
    }
    const configData = await configResponse.json();
    contractAddress = configData.contractAddress;
    tokenAddress = configData.tokenAddress;

    // Load ABI from abi.json
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
  try {
    if (typeof window.ethereum !== 'undefined') {
      // MetaMask is installed
      if (window.ethereum.isMetaMask) {
        web3 = new Web3(window.ethereum);

        // Request account access
        accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log("Connected accounts:", accounts);

        // Enable claim button
        document.getElementById('claimAirdropButton').disabled = false;
        document.getElementById('metaMaskMessage').style.display = 'none';

        alert("Connected to MetaMask!");
      } else {
        // For MetaMask browser
        document.getElementById('metaMaskMessage').style.display = 'block';
      }
    } else {
      // If MetaMask is not detected, handle mobile deep-linking
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        alert("Redirecting to MetaMask. Please install MetaMask if you haven't.");
        window.location.href = "https://metamask.app.link/dapp/buyemon.github.io/metamask/index.html";
      } else {
        alert("MetaMask is not detected. Please install MetaMask to use this application.");
      }
    }
  } catch (error) {
    console.error("MetaMask connection error:", error);
    alert("Failed to connect to MetaMask. Check console for details.");
  }
}

// Function to claim the airdrop using `withdrawTokens`
async function claimAirdrop() {
  if (!web3) {
    alert("Please connect to MetaMask first.");
    return;
  }

  try {
    // Create a contract instance
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    console.log("Contract instance created:", contract);

    // Call the `withdrawTokens` function
    const receipt = await contract.methods.withdrawTokens().send({ from: accounts[0] });
    console.log("Transaction successful:", receipt);
    alert("Airdrop claimed successfully!");
  } catch (error) {
    console.error("Airdrop claim error:", error);
    if (error.message.includes("Transaction has been reverted")) {
      alert("Transaction failed. Make sure you meet the airdrop criteria.");
    } else {
      alert("Failed to claim airdrop. Please try again.");
    }
  }
}

// Add event listeners to the buttons
window.addEventListener('DOMContentLoaded', () => {
  loadConfig();

  document.getElementById('connectButton').addEventListener('click', connectMetaMask);
  document.getElementById('claimAirdropButton').addEventListener('click', claimAirdrop);
});

