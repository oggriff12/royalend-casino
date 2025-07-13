let walletBalance = parseFloat(localStorage.getItem("walletBalance")) || 1000;
let betAmount = 100;
let deck = [], playerHand = [], dealerHand = [], insuranceTaken = false;

function updateWalletDisplay() {
  document.getElementById("wallet").textContent = walletBalance.toFixed(2);
  localStorage.setItem("walletBalance", walletBalance);
}

function placeBet() {
  betAmount = parseInt(document.getElementById("betInput").value) || 100;
  if (betAmount > walletBalance) {
    alert("Insufficient funds!");
    return;
  }
  document.getElementById("status").textContent = `Bet placed: $${betAmount}`;
  document.getElementById("deal-btn").disabled = false;
}

function createDeck() {
  const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
  const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value });
    }
  }
  deck.sort(() => Math.random() - 0.5);
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

function renderHand(hand, elementId) {
  const container = document.getElementById(elementId);
  container.innerHTML = "";
  for (let card of hand) {
    const div = document.createElement("div");
    div.className = "card";
    div.textContent = `${card.value} ${card.suit[0]}`;
    container.appendChild(div);
  }
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
  renderHand([dealerHand[0]], "dealer-cards");

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
  if (val > 21) {
    endGame();
  }
}

function stand() {
  while (calculateHandValue(dealerHand) < 17) {
    dealerHand.push(deck.pop());
  }
  endGame();
}

function endGame() {
  renderHand(dealerHand, "dealer-cards");
  const playerVal = calculateHandValue(playerHand);
  const dealerVal = calculateHandValue(dealerHand);
  let message = "";

  if (playerVal > 21) {
    message = "You busted!";
  } else if (dealerVal > 21 || playerVal > dealerVal) {
    message = "You win!";
    walletBalance += betAmount * 2;
  } else if (playerVal === dealerVal) {
    message = "Push. Bet returned.";
    walletBalance += betAmount;
  } else {
    message = "Dealer wins.";
  }

  if (insuranceTaken && dealerVal === 21) {
    walletBalance += betAmount / 2;
    message += ` Insurance paid $${(betAmount / 2).toFixed(2)}.`;
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
    opacity: { value: 0.5 },
    size: { value: 3 },
    move: { enable: true, speed: 2, direction: "none", out_mode: "out" }
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: { enable: true, mode: "repulse" },
      onclick: { enable: true, mode: "push" }
    },
    modes: {
      repulse: { distance: 100 },
      push: { particles_nb: 4 }
    }
  },
  retina_detect: true
});
