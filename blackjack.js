let walletBalance = 1000;
let betAmount = 100;
let deck = [];
let playerHand = [];
let dealerHand = [];

function updateWalletDisplay() {
  document.getElementById("wallet").textContent = `$${walletBalance}`;
}

function createDeck() {
  const suits = ["♠", "♥", "♦", "♣"];
  const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  deck = [];

  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value });
    }
  }

  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function getCardValue(card) {
  if (["J", "Q", "K"].includes(card.value)) return 10;
  if (card.value === "A") return 11;
  return parseInt(card.value);
}

function calculateHandValue(hand) {
  let value = 0;
  let aces = 0;
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
  hand.forEach((card) => {
    const cardDiv = document.createElement("div");
    cardDiv.className = "card pop";
    cardDiv.innerHTML = `${card.value}${card.suit}`;
    container.appendChild(cardDiv);
  });
}

function deal() {
  if (walletBalance < betAmount) {
    alert("Not enough funds.");
    return;
  }

  walletBalance -= betAmount;
  updateWalletDisplay();

  createDeck();
  playerHand = [deck.pop(), deck.pop()];
  dealerHand = [deck.pop(), deck.pop()];

  renderHand(playerHand, "player-cards");
  renderHand([dealerHand[0]], "dealer-cards");

  document.getElementById("status").textContent = "Hit or Stand?";
  document.getElementById("hit-btn").disabled = false;
  document.getElementById("stand-btn").disabled = false;
}

function hit() {
  playerHand.push(deck.pop());
  renderHand(playerHand, "player-cards");

  if (calculateHandValue(playerHand) > 21) {
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
  let result = "";

  if (playerVal > 21) result = "Bust! You lose.";
  else if (dealerVal > 21 || playerVal > dealerVal) {
    result = "You win!";
    walletBalance += betAmount * 2;
  } else if (playerVal === dealerVal) {
    result = "Push!";
    walletBalance += betAmount;
  } else {
    result = "Dealer wins!";
  }

  updateWalletDisplay();
  document.getElementById("status").textContent = result;
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
