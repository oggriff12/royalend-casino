// Initial setup
let wallet = parseFloat(localStorage.getItem("wallet")) || 10.00;
let playerHand = [];
let dealerHand = [];
let deck = [];
let betAmount = 0;
let gameOver = true;

const walletDisplay = document.getElementById("wallet");
const playerCards = document.getElementById("player-cards");
const dealerCards = document.getElementById("dealer-cards");
const statusDisplay = document.getElementById("status");
const betInput = document.getElementById("bet-input");

function updateWalletDisplay() {
  walletDisplay.textContent = `$${wallet.toFixed(2)}`;
  localStorage.setItem("wallet", wallet.toFixed(2));
}

// Card deck
function createDeck() {
  const suits = ["♠", "♥", "♦", "♣"];
  const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  let newDeck = [];

  for (let suit of suits) {
    for (let value of values) {
      newDeck.push({ value, suit });
    }
  }

  return newDeck.sort(() => Math.random() - 0.5);
}

function getCardValue(card) {
  if (["K", "Q", "J"].includes(card.value)) return 10;
  if (card.value === "A") return 11;
  return parseInt(card.value);
}

function getHandValue(hand) {
  let value = 0;
  let aces = 0;

  for (let card of hand) {
    value += getCardValue(card);
    if (card.value === "A") aces++;
  }

  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }

  return value;
}

function createCardElement(card) {
  const cardEl = document.createElement("div");
  cardEl.className = "card";
  cardEl.innerHTML = `${card.value}${card.suit}`;
  return cardEl;
}

function dealCard(toDealer = false) {
  const card = deck.pop();
  const cardEl = createCardElement(card);
  cardEl.style.opacity = 0;
  cardEl.style.transform = "translateY(-20px)";
  setTimeout(() => {
    cardEl.style.opacity = 1;
    cardEl.style.transform = "translateY(0)";
  }, 50);

  if (toDealer) {
    dealerHand.push(card);
    dealerCards.appendChild(cardEl);
  } else {
    playerHand.push(card);
    playerCards.appendChild(cardEl);
  }
}

function placeBet() {
  const amount = parseFloat(betInput.value);
  if (isNaN(amount) || amount <= 0 || amount > wallet) {
    alert("Invalid bet amount.");
    return;
  }

  betAmount = amount;
  wallet -= betAmount;
  updateWalletDisplay();
  startGame();
}

function startGame() {
  gameOver = false;
  deck = createDeck();
  playerHand = [];
  dealerHand = [];
  playerCards.innerHTML = "";
  dealerCards.innerHTML = "";
  statusDisplay.textContent = "";

  dealCard();
  dealCard(true);
  dealCard();
  dealCard(true);

  document.getElementById("hit-btn").disabled = false;
  document.getElementById("stand-btn").disabled = false;
}

function hit() {
  if (gameOver) return;
  dealCard();
  const value = getHandValue(playerHand);
  if (value > 21) endGame("Bust! Dealer wins.");
}

function stand() {
  if (gameOver) return;

  while (getHandValue(dealerHand) < 17) {
    dealCard(true);
  }

  const playerValue = getHandValue(playerHand);
  const dealerValue = getHandValue(dealerHand);

  if (dealerValue > 21 || playerValue > dealerValue) {
    wallet += betAmount * 2;
    updateWalletDisplay();
    endGame("You win!");
  } else if (dealerValue === playerValue) {
    wallet += betAmount;
    updateWalletDisplay();
    endGame("Push. It's a tie.");
  } else {
    endGame("Dealer wins.");
  }
}

function endGame(message) {
  gameOver = true;
  statusDisplay.textContent = message;
  document.getElementById("hit-btn").disabled = true;
  document.getElementById("stand-btn").disabled = true;
}

// Load balance on page load
window.onload = () => {
  updateWalletDisplay();
};
