// Common code for Telegram WebApp setup
Telegram.WebApp.onEvent('themeChanged', () => {
    document.body.style.background = Telegram.WebApp.themeParams.bgColor;
});

Telegram.WebApp.ready();
Telegram.WebApp.setBackgroundColor('#000000'); // Set header color to black

// Determine which page to initialize
document.addEventListener("DOMContentLoaded", function() {
    const page = document.body.getAttribute('data-page');

    if (page === 'tap') {
        initializeTapPage();
    } else if (page === 'boost') {
        initializeBoostPage();
    }
});

function initializeTapPage() {
    let coin = parseInt(localStorage.getItem("circleGameCoin")) || 0;
    let boostFactor = parseInt(localStorage.getItem("circleGameBoostFactor")) || 1;
    let battery = parseInt(localStorage.getItem("circleGameBattery")) || 1000;
    const maxBattery = parseInt(localStorage.getItem("circleGameMaxBattery")) || 1000;

    document.getElementById("score").innerText = `Score: ${coin}`;
    document.getElementById("level").innerText = `Level: ${boostFactor}`;
    document.getElementById("battery").style.width = `${(battery / maxBattery) * 100}%`;

    function updateBattery() {
        battery += boostFactor; // Increase battery based on boostFactor
        if (battery > maxBattery) {
            battery = maxBattery; // Cap battery at maxBattery
        }
        localStorage.setItem("circleGameBattery", battery);
        document.getElementById("battery").style.width = `${(battery / maxBattery) * 100}%`;
    }

    function tap() {
        coin += boostFactor;
        localStorage.setItem("circleGameCoin", coin);
        document.getElementById("score").innerText = `Score: ${coin}`;
        updateBattery();
    }

    document.getElementById("circle").addEventListener("click", tap);

    // Function to update battery every second based on recharge speed
    setInterval(() => {
        let rechargeSpeed = parseInt(localStorage.getItem("circleGameRechargeSpeed")) || 1;
        battery += rechargeSpeed;
        if (battery > maxBattery) {
            battery = maxBattery; // Cap battery at maxBattery
        }
        localStorage.setItem("circleGameBattery", battery);
        document.getElementById("battery").style.width = `${(battery / maxBattery) * 100}%`;
    }, 1000);
}

function initializeBoostPage() {
    let coin = parseInt(localStorage.getItem("circleGameCoin")) || 0;
    let boostFactor = parseInt(localStorage.getItem("circleGameBoostFactor")) || 1;
    let battery = parseInt(localStorage.getItem("circleGameBattery")) || 1000;
    let maxBattery = parseInt(localStorage.getItem("circleGameMaxBattery")) || 1000;
    let rechargeSpeed = parseInt(localStorage.getItem("circleGameRechargeSpeed")) || 1;

    const multitapCosts = [200, 400, 1000, 2000, 4000];
    const batteryCosts = [5000, 10000, 20000];
    const rechargeCosts = [3000, 6000, 12000];

    let multitapIndex = parseInt(localStorage.getItem("circleGameMultitapIndex")) || 0;
    let batteryIndex = parseInt(localStorage.getItem("circleGameBatteryIndex")) || 0;
    let rechargeIndex = parseInt(localStorage.getItem("circleGameRechargeIndex")) || 0;

    function confirmBoost(type) {
        let cost;
        let description;
        if (type === 'multitap') {
            cost = multitapCosts[multitapIndex] || (4000 * (multitapIndex - 4));
            description = `Multitap\nLevel ${multitapIndex + 1}\nMulti tap lets you earn more coins per tap.\n+1 coins per tap\nCost: ${cost} coins`;
        } else if (type === 'battery') {
            cost = batteryCosts[batteryIndex] || (20000 * Math.pow(2, batteryIndex - 2));
            description = `Battery\nLevel ${batteryIndex + 1}\nIncrease your battery capacity.\n+500 battery\nCost: ${cost} coins`;
        } else if (type === 'recharge') {
            cost = rechargeCosts[rechargeIndex] || (12000 * Math.pow(2, rechargeIndex - 2));
            description = `Recharge Speed\nLevel ${rechargeIndex + 1}\nIncreases your battery recharge rate.\n+1 battery per second\nCost: ${cost} coins`;
        }

        Telegram.WebApp.showConfirm({
            text: `${description}\n\nDo you want to proceed?`,
            okButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then(result => {
            if (result) {
                buyBoost(type);
            }
        });
    }

    function buyBoost(type) {
        let cost;
        if (type === 'multitap') {
            cost = multitapCosts[multitapIndex] || (4000 * (multitapIndex - 4));
            if (coin >= cost) {
                coin -= cost;
                boostFactor++;
                multitapIndex++;
                localStorage.setItem("circleGameCoin", coin);
                localStorage.setItem("circleGameBoostFactor", boostFactor);
                localStorage.setItem("circleGameMultitapIndex", multitapIndex);
                updateBoostButton();
            } else {
                Telegram.WebApp.showAlert('Not enough coins!');
            }
        } else if (type === 'battery') {
            cost = batteryCosts[batteryIndex] || (20000 * Math.pow(2, batteryIndex - 2));
            if (coin >= cost) {
                coin -= cost;
                maxBattery += 500;
                battery = maxBattery; // Full battery
                batteryIndex++;
                localStorage.setItem("circleGameCoin", coin);
                localStorage.setItem("circleGameMaxBattery", maxBattery);
                localStorage.setItem("circleGameBattery", battery);
                localStorage.setItem("circleGameBatteryIndex", batteryIndex);
                updateBoostButton();
            } else {
                Telegram.WebApp.showAlert('Not enough coins!');
            }
        } else if (type === 'recharge') {
            cost = rechargeCosts[rechargeIndex] || (12000 * Math.pow(2, rechargeIndex - 2));
            if (coin >= cost) {
                coin -= cost;
                rechargeSpeed++;
                localStorage.setItem("circleGameCoin", coin);
                localStorage.setItem("circleGameRechargeSpeed", rechargeSpeed);
                localStorage.setItem("circleGameRechargeIndex", rechargeIndex);
                updateBoostButton();
            } else {
                Telegram.WebApp.showAlert('Not enough coins!');
            }
        }
    }

    function updateBoostButton() {
        let multitapCost = multitapCosts[multitapIndex] || (4000 * (multitapIndex - 4));
        let batteryCost = batteryCosts[batteryIndex] || (20000 * Math.pow(2, batteryIndex - 2));
        let rechargeCost = rechargeCosts[rechargeIndex] || (12000 * Math.pow(2, rechargeIndex - 2));

        document.getElementById("coinBalance").innerText = `${coin}`; // Just balance, no text
    }

    document.getElementById("buyMultitap").addEventListener("click", () => confirmBoost('multitap'));
    document.getElementById("buyBattery").addEventListener("click", () => confirmBoost('battery'));
    document.getElementById("buyRecharge").addEventListener("click", () => confirmBoost('recharge'));

    // Set up the background and coin balance
    document.body.style.background = localStorage.getItem("circleGameBackground") || "linear-gradient(to bottom, black, #cd7f32)";
    updateBoostButton();
            }
