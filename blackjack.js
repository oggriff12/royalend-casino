let walletBalance = parseFloat(localStorage.getItem("walletBalance")) || 10.00;
let betAmount = 1.00;
let deck = [], playerHand = [], dealerHand = [], insuranceTaken = false;

function updateWalletDisplay() {
    document.getElementById("wallet").textContent = `$${walletBalance.toFixed(2)}`;
    localStorage.setItem("walletBalance", walletBalance);
}

function placeBet() {
    betAmount = parseFloat(document.getElementById("betInput").value) || 0;
    if (betAmount <= 0 || betAmount > walletBalance) {
        alert("Please enter a valid bet greater than 0.");
        return;
    }
    document.getElementById("status").textContent = "";
}

function createDeck() {
    const suits = ["C", "D", "H", "S"];
    const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
    deck = deck.sort(() => Math.random() - 0.5);
}

function getCardValue(card) {
    if (["J", "Q", "K"].includes(card.value)) return 10;
    if (card.value === "A") return 11;
    return parseInt(card.value);
}

function calculateHandValue(hand) {
    let value = 0, aces = 0;
    for (let card of hand) {
        value += getCardValue(card);
        if (card.value === "A") aces++;
    }
    while (value > 21 && aces) {
        value -= 10;
        aces--;
    }
    return value;
}

function renderHand(hand, elementId, revealAll = true) {
    const container = document.getElementById(elementId);
    container.innerHTML = "";
    hand.forEach((card, index) => {
        const div = document.createElement("div");
        div.className = "card";
        if (elementId === "dealer-cards" && index === 1 && !revealAll) {
            div.style.backgroundImage = "url('cards/BACK.png')";
        } else {
            div.style.backgroundImage = `url('cards/${card.value}${card.suit}.png')`;
        }
        container.appendChild(div);
    });
}

function deal() {
    if (betAmount > walletBalance) return alert("Not enough funds.");
    walletBalance -= betAmount;
    insuranceTaken = false;
    updateWalletDisplay();
    createDeck();
    playerHand = [deck.pop(), deck.pop()];
    dealerHand = [deck.pop(), deck.pop()];
    renderHand(playerHand, "player-cards");
    renderHand(dealerHand, "dealer-cards", false);
    if (getCardValue(dealerHand[0]) === 11) {
        document.getElementById("insurance").classList.remove("hidden");
    }
    document.getElementById("hit-btn").disabled = false;
    document.getElementById("stand-btn").disabled = false;
    document.getElementById("status").textContent = "Hit or Stand?";
}

function takeInsurance() {
    insuranceTaken = true;
    document.getElementById("insurance").classList.add("hidden");
    document.getElementById("status").textContent = "Insurance taken.";
}

function declineInsurance() {
    insuranceTaken = false;
    document.getElementById("insurance").classList.add("hidden");
    document.getElementById("status").textContent = "Insurance declined.";
}

function hit() {
    playerHand.push(deck.pop());
    renderHand(playerHand, "player-cards");
    const val = calculateHandValue(playerHand);
    if (val > 21) endGame();
}

function stand() {
    while (calculateHandValue(dealerHand) < 17) {
        dealerHand.push(deck.pop());
    }
    endGame();
}

function endGame() {
    renderHand(dealerHand, "dealer-cards", true);
    const playerVal = calculateHandValue(playerHand);
    const dealerVal = calculateHandValue(dealerHand);
    let message = "";
    if (playerVal > 21) {
        message = "You busted!";
    } else if (dealerVal > 21 || playerVal > dealerVal) {
        message = "You win!";
        walletBalance += betAmount * 2;
    } else if (playerVal === dealerVal) {
        message = "Push!";
        walletBalance += betAmount;
    } else {
        message = "Dealer wins!";
    }
    if (insuranceTaken && dealerVal === 21) {
        walletBalance += betAmount * 2;
        message += ` Insurance paid $${(betAmount).toFixed(2)}.`;
    }
    updateWalletDisplay();
    document.getElementById("status").textContent = message;
    document.getElementById("hit-btn").disabled = true;
    document.getElementById("stand-btn").disabled = true;
}

updateWalletDisplay();

particlesJS("particles-js", {
    particles: {
        number: { value: 80 },
        color: { value: "#ffffff" },
        shape: { type: "circle" },
        opacity: { value: 0.5 }
    }
});
