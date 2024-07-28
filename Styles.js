let coin = parseInt(localStorage.getItem("circleGameCoin")) || 0;
let boostFactor = parseInt(localStorage.getItem("circleGameBoostFactor")) || 1;
let battery = parseInt(localStorage.getItem("circleGameBattery")) || 1000;
let maxBattery = parseInt(localStorage.getItem("circleGameMaxBattery")) || 1000;

function updateScore() {
    document.getElementById("scoreValue").innerText = coin;
    localStorage.setItem("circleGameCoin", coin);
    localStorage.setItem("circleGameBoostFactor", boostFactor);
    localStorage.setItem("circleGameBattery", battery);
    localStorage.setItem("circleGameMaxBattery", maxBattery);
    updateLevel();
    updateBattery();
}

function tapCircle(event) {
    let tapCount = event.touches ? event.touches.length : 1;
    let tapsNeeded = boostFactor * tapCount;
    if (battery >= tapsNeeded) {
        coin += tapsNeeded;
        battery -= tapsNeeded;
        updateScore();
        for (let i = 0; i < tapCount; i++) {
            let touch = event.touches[i];
            updateFlyingNumber(boostFactor, touch.clientX, touch.clientY);
        }
        apply3DEffect(event.touches[0].clientX, event.touches[0].clientY);
        bounceCircle();
    } else {
        alert('Not enough battery!');
    }
}

function updateFlyingNumber(amount, x, y) {
    let flyingNumber = document.createElement("div");
    flyingNumber.innerText = amount;
    flyingNumber.className = "flyingNumber";
    flyingNumber.style.left = x + 'px';
    flyingNumber.style.top = y + 'px';
    document.body.appendChild(flyingNumber);

    setTimeout(function () {
        flyingNumber.remove();
    }, 300); // Adjusted for faster removal
}

function apply3DEffect(x, y) {
    let rect = document.getElementById("circle").getBoundingClientRect();
    let centerX = rect.left + rect.width / 2;
    let centerY = rect.top + rect.height / 2;
    let deltaX = x - centerX;
    let deltaY = y - centerY;
    document.getElementById("circle").style.transform = `rotateX(${deltaY / 10}deg) rotateY(${deltaX / 10}deg)`;

    setTimeout(() => {
        document.getElementById("circle").style.transform = '';
    }, 100);
}

function bounceCircle() {
    let circle = document.getElementById("circle");
    circle.style.transition = 'transform 0.1s'; // Smaller bounce effect
    circle.style.transform = 'scale(0.98)';

    setTimeout(() => {
        circle.style.transform = 'scale(1)';
    }, 100);
}

function updateBattery() {
    let batteryElement = document.getElementById("battery");
    batteryElement.style.width = `${(battery / maxBattery) * 100}%`;
    document.getElementById("batteryText").innerText = `${battery}/${maxBattery}`;
}

function recoverBattery() {
    if (battery < maxBattery) {
        battery++;
        updateBattery();
    }
}

function updateLevel() {
    let levelElement = document.getElementById("level");
    let background = "";
    let levelText = "";

    if (coin < 5000) {
        levelText = "🥉 Bronze";
        background = "linear-gradient(to bottom, black, #cd7f32)";
    } else if (coin < 200000) {
        levelText = "🥈 Silver";
        background = "linear-gradient(to bottom, black, silver)";
    } else if (coin < 500000) {
        levelText = "🥇 Gold";
        background = "linear-gradient(to bottom, black, gold)";
    } else if (coin < 1000000) {
        levelText = "💎 Diamond";
        background = "linear-gradient(to bottom, black, #b9f2ff)";
    } else {
        levelText = "🏆 Platinum";
        background = "linear-gradient(to bottom, black, #11bcff)";
    }

    levelElement.innerText = levelText;
    document.body.style.background = background;
    localStorage.setItem("circleGameBackground", background);
}

setInterval(recoverBattery, 1000); // Recover 1 battery per second

function initializeRecaptcha() {
    // Display reCAPTCHA when the page loads
    grecaptcha.execute();
}

// Initial setup
updateScore();
initializeRecaptcha();

// Telegram API integration (simplified example)
window.Telegram.WebApp.onEvent('mainButtonClicked', function() {
    console.log('Telegram button clicked!');
});

function syncWithTelegram() {
    // Your code to synchronize data with Telegram
                           }
    
