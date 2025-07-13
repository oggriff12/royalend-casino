let wallet = parseFloat(localStorage.getItem("wallet")) || 10.00;
let playerHand = [];
let dealerHand = [];
let deck = [];
let betAmount = 0;
let gameOver = true;
let roundsPlayed = 0;
let stats = JSON.parse(localStorage.getItem("stats")) || { wins: 0, losses: 0, ties: 0 };

const walletDisplay = document.getElementById("wallet");
const statusDisplay = document.getElementById("status");
const playerCards = document.getElementById("player-cards");
const dealerCards = document.getElementById("dealer-cards");
const betInput = document.getElementById("betInput");
const insuranceDiv = document.getElementById("insurance");
const winsDisplay = document.getElementById("wins");
const lossesDisplay = document.getElementById("losses");
const tiesDisplay = document.getElementById("ties");

function updateWalletDisplay() {
  walletDisplay.textContent = wallet.toFixed(2);
  localStorage.setItem("wallet", wallet.toFixed(2));
}
function updateStatsDisplay() {
  winsDisplay.textContent = stats.wins;
  lossesDisplay.textContent = stats.losses;
  tiesDisplay.textContent = stats.ties;
  localStorage.setItem("stats", JSON.stringify(stats));
}
function createDeck() {
  const suits = ["♠", "♥", "♦", "♣"];
  const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  const newDeck = [];
  for (let suit of suits) {
    for (let value of values) {
      newDeck.push({ suit, value });
    }
  }
  return shuffle(newDeck);
}
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
function dealCard(toDealer = false) {
  const card = deck.pop();
  const cardEl = document.createElement("div");
  cardEl.className = "card";
  cardEl.innerHTML = `<span>${card.value}</span><span>${card.suit}</span>`;
  cardEl.style.animation = "deal 0.3s ease";
  (toDealer ? dealerCards : playerCards).appendChild(cardEl);
  (toDealer ? dealerHand : playerHand).push(card);
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
function placeBet() {
  const amount = parseFloat(betInput.value);
  if (isNaN(amount) || amount <= 0 || amount > wallet) {
    alert("Invalid bet");
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
  insuranceDiv.classList.add("hidden");

  dealCard();         // Player 1
  dealCard(true);     // Dealer 1
  dealCard();         // Player 2
  dealCard(true);     // Dealer 2

  document.getElementById("hit-btn").disabled = false;
  document.getElementById("stand-btn").disabled = false;

  if (dealerHand[0].value === "A") {
    insuranceDiv.classList.remove("hidden");
  }

  checkBlackjack();
}
function checkBlackjack() {
  const playerTotal = getHandValue(playerHand);
  const dealerTotal = getHandValue(dealerHand);
  if (playerTotal === 21 || dealerTotal === 21) {
    endGame();
  }
}
function hit() {
  if (gameOver) return;
  dealCard();
  const value = getHandValue(playerHand);
  if (value > 21) {
    endGame("Bust! Dealer wins.");
  }
}
function stand() {
  if (gameOver) return;
  while (getHandValue(dealerHand) < 17) {
    dealCard(true);
  }
  endGame();
}
function endGame(msg) {
  gameOver = true;
  const playerValue = getHandValue(playerHand);
  const dealerValue = getHandValue(dealerHand);
  let result = "";

  if (msg) {
    result = msg;
  } else if (playerValue > 21) {
    result = "Bust! Dealer wins.";
    stats.losses++;
  } else if (dealerValue > 21 || playerValue > dealerValue) {
    result = "You win!";
    wallet += betAmount * 2;
    stats.wins++;
  } else if (playerValue === dealerValue) {
    result = "Push. It's a tie.";
    wallet += betAmount;
    stats.ties++;
  } else {
    result = "Dealer wins.";
    stats.losses++;
  }

  updateWalletDisplay();
  updateStatsDisplay();
  statusDisplay.textContent = result;

  document.getElementById("hit-btn").disabled = true;
  document.getElementById("stand-btn").disabled = true;
}
function takeInsurance() {
  insuranceDiv.classList.add("hidden");
  statusDisplay.textContent = "Insurance taken (not yet functional).";
}
function declineInsurance() {
  insuranceDiv.classList.add("hidden");
  statusDisplay.textContent = "Insurance declined.";
}

// Initialize on page load
updateWalletDisplay();
updateStatsDisplay();
