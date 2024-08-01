document.addEventListener('DOMContentLoaded', function() {
    // Function to update background based on level in local storage
    function updateBackground() {
        const level = localStorage.getItem('backgroundLevel') || '1';
        document.body.style.backgroundImage = `url('background-level-${level}.jpg')`;
    }

    // Update background on page load
    updateBackground();

    // Back button functionality
    document.getElementById('back-button').addEventListener('click', function() {
        window.history.back();
    });

    // Connect wallet functionality
    document.getElementById('connect-wallet').addEventListener('click', async function() {
        if (window.TonConnect) {
            try {
                // Initialize Ton Connect SDK
                const tonConnect = new TonConnect({
                    bridgeUrl: 'https://bridge.tonconnect.org', // Ton Connect Bridge URL
                    appMeta: {
                        name: 'Telecoin',
                        description: 'Connect your Ton wallet to Telecoin.',
                        url: 'https://tourmaline-gaufre-01a120.netlify.app/', // Your deployed site URL
                        icon: 'https://raw.githubusercontent.com/Ebisa7/Vmhdfhf/main/Photos/970a27e0-0240-4c11-abd7-602e46a58399.jpg-output.png', // URL to your icon
                    },
                });

                // Connect wallet
                const { accounts } = await tonConnect.connect();

                // Assuming the first account is the one to display
                const account = accounts[0];
                const shortenedAccount = `${account.address.substring(0, 6)}...${account.address.slice(-4)}`;

                // Update button text to show connected wallet address
                this.textContent = `Connected: ${shortenedAccount}`;
            } catch (error) {
                console.error('Error connecting wallet:', error);
                alert('Error connecting wallet. Please try again.');
            }
        } else {
            alert('Ton Connect is not available. Please try again later.');
        }
    });
});
                                           
