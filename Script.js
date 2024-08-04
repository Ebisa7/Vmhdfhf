document.addEventListener("DOMContentLoaded", function() {
    const page = document.body.getAttribute("data-page");

    if (page === "tap") {
        // Existing tap.html functionality
        setupTapPage();
    } else if (page === "boost") {
        setupBoostPage();
    }
});

function setupTapPage() {
    // Add tap.html-specific functionality here
    let coin = parseInt(localStorage.getItem("circleGameCoin")) || 0;
    document.getElementById("coinBalance").innerText = coin;

    // Add functionality for tapping to earn coins
    document.addEventListener("click", function() {
        coin++;
        localStorage.setItem("circleGameCoin", coin);
        document.getElementById("coinBalance").innerText = coin;
    });

    Telegram.WebApp.initData(); // Initialize Telegram WebApp
}

function setupBoostPage() {
    // Add boost.html-specific functionality here
    let coin = parseInt(localStorage.getItem("circleGameCoin")) || 0;
    document.getElementById("coinBalance").innerText = coin;

    // Event listeners for boost buttons
    document.getElementById("buyMultitap").addEventListener("click", function() {
        confirmBoost('multitap');
    });
    
    document.getElementById("buyBattery").addEventListener("click", function() {
        confirmBoost('battery');
    });

    document.getElementById("buyRecharge").addEventListener("click", function() {
        confirmBoost('recharge');
    });

    function confirmBoost(type) {
        let cost, description;

        switch(type) {
            case 'multitap':
                cost = multitapCosts[multitapIndex] || (4000 * (multitapIndex - 4));
                description = `Multitap\nLevel ${multitapIndex + 1}\nMulti tap lets you earn more coins per tap.\n+1 coins per tap\nCost: ${cost} coins`;
                break;
            case 'battery':
                cost = batteryCosts[batteryIndex] || (20000 * Math.pow(2, batteryIndex - 2));
                description = `Battery\nLevel ${batteryIndex + 1}\nIncrease your battery capacity.\n+500 battery\nCost: ${cost} coins`;
                break;
            case 'recharge':
                cost = rechargeCost; // Set appropriate cost
                description = `Recharge Speed\nLevel ${rechargeIndex + 1}\nIncrease your recharge speed.\n+1 battery per second\nCost: ${cost} coins`;
                break;
            default:
                return;
        }

        if (Telegram.WebApp.showAlert) {
            Telegram.WebApp.showAlert(description + "\n\nDo you want to proceed?", function() {
                buyBoost(type);
            }, "Yes", "No");
        } else {
            if (confirm(description + "\n\nDo you want to proceed?")) {
                buyBoost(type);
            }
        }
    }

    function buyBoost(type) {
        let cost;
        switch(type) {
            case 'multitap':
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
                break;
            case 'battery':
                cost = batteryCosts[batteryIndex] || (20000 * Math.pow(2, batteryIndex - 2));
                if (coin >= cost) {
                    coin -= cost;
                    maxBattery += 500;
                    batteryIndex++;
                    localStorage.setItem("circleGameCoin", coin);
                    localStorage.setItem("circleGameMaxBattery", maxBattery);
                    localStorage.setItem("circleGameBatteryIndex", batteryIndex);
                    updateBoostButton();
                } else {
                    Telegram.WebApp.showAlert('Not enough coins!');
                }
                break;
            case 'recharge':
                cost = rechargeCost;
                if (coin >= cost) {
                    coin -= cost;
                    rechargeSpeed++;
                    localStorage.setItem("circleGameCoin", coin);
                    localStorage.setItem("circleGameRechargeSpeed", rechargeSpeed);
                    updateBoostButton();
                } else {
                    Telegram.WebApp.showAlert('Not enough coins!');
                }
                break;
        }
    }

    function updateBoostButton() {
        document.getElementById("coinBalance").innerText = coin;
    }

    let multitapCosts = [200, 400, 1000, 2000, 4000];
    let batteryCosts = [5000, 10000, 20000];
    let rechargeCost = 10000; // Example cost
    let multitapIndex = parseInt(localStorage.getItem("circleGameMultitapIndex")) || 0;
    let batteryIndex = parseInt(localStorage.getItem("circleGameBatteryIndex")) || 0;
    let rechargeSpeed = parseInt(localStorage.getItem("circleGameRechargeSpeed")) || 1;
                              }
                              
