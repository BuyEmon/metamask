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

// Function to connect to MetaMask (for desktop users and mobile users)
async function connectMetaMask() {
  if (window.ethereum) {
    // Check if MetaMask is available
    if (window.ethereum.isMetaMask) {
      // For desktop users: Connect via MetaMask browser extension
      web3 = new Web3(window.ethereum);
      try {
        accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log("Connected accounts:", accounts);

        // Enable claim button and disable connect button
        document.getElementById('claimAirdropButton').disabled = false;
        document.getElementById('connectButton').disabled = true;
      } catch (error) {
        alert('MetaMask connection failed');
        console.error('MetaMask connection error:', error);
      }
    } else {
      // Mobile users not in MetaMask browser
      document.getElementById('metaMaskMessage').style.display = 'block';
    }
  } else {
    alert('MetaMask not detected! Please install MetaMask on your device.');
  }
}

// Add event listeners to the buttons
window.addEventListener('DOMContentLoaded', (event) => {
  document.getElementById('connectButton').addEventListener('click', connectMetaMask);

  // Load configuration and ABI when the page loads
  loadConfig();
});
