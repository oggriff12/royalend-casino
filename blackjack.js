let balance = parseFloat(localStorage.getItem("wallet")) || 10;
let deck = [];
let playerHand = [];
let dealerHand = [];
let gameOver = false;
let betAmount = 0;

const balanceDisplay = document.getElementById("balance");
const betInput = document.getElementById("betInput");
const dealButton = document.getElementById("dealButton");
const hitButton = document.getElementById("hitButton");
const standButton = document.getElementById("standButton");
const playerHandDiv = document.getElementById("playerHand");
const dealerHandDiv = document.getElementById("dealerHand");
const gameStatus = document.getElementById("gameStatus");

function updateBalance() {
  balanceDisplay.textContent = balance.toFixed(2);
  localStorage.setItem("wallet", balance);
}

function createDeck() {
  const suits = ["♠", "♥", "♦", "♣"];
  const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  deck = [];

  for (let suit of suits) {
    for (let value of values) {
      deck.push({ value, suit });
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
  let value = 0;
  let aceCount = 0;

  for (let card of hand) {
    value += getCardValue(card);
    if (card.value === "A") aceCount++;
  }

  while (value > 21 && aceCount > 0) {
    value -= 10;
    aceCount--;
  }

  return value;
}

function displayHand(hand, container) {
  container.innerHTML = "";
  for (let card of hand) {
    const cardDiv = document.createElement("div");
    cardDiv.className = "card";
    if (card.suit === "♥" || card.suit === "♦") cardDiv.classList.add("red");
    cardDiv.textContent = `${card.value}${card.suit}`;
    container.appendChild(cardDiv);
  }
}

function startGame() {
  betAmount = parseFloat(betInput.value);
  if (isNaN(betAmount) || betAmount <= 0 || betAmount > balance) {
    alert("Invalid bet.");
    return;
  }

  balance -= betAmount;
  updateBalance();

  createDeck();
  playerHand = [deck.pop(), deck.pop()];
  dealerHand = [deck.pop(), deck.pop()];
  gameOver = false;

  displayHand(playerHand, playerHandDiv);
  displayHand([dealerHand[0], { value: "?", suit: "?" }], dealerHandDiv);

  gameStatus.textContent = "Your move.";
  dealButton.disabled = true;
  hitButton.disabled = false;
  standButton.disabled = false;
}

function hit() {
  if (gameOver) return;

  playerHand.push(deck.pop());
  displayHand(playerHand, playerHandDiv);

  const playerValue = calculateHandValue(playerHand);
  if (playerValue > 21) {
    endGame();
  }
}

function stand() {
  if (gameOver) return;

  while (calculateHandValue(dealerHand) < 17) {
    dealerHand.push(deck.pop());
  }

  endGame();
}

function endGame() {
  gameOver = true;
  const playerValue = calculateHandValue(playerHand);
  const dealerValue = calculateHandValue(dealerHand);

  displayHand(dealerHand, dealerHandDiv);

  if (playerValue > 21) {
    gameStatus.textContent = "You busted! Dealer wins.";
  } else if (dealerValue > 21 || playerValue > dealerValue) {
    gameStatus.textContent = "You win!";
    balance += betAmount * 2;
  } else if (playerValue === dealerValue) {
    gameStatus.textContent = "Push. Bet returned.";
    balance += betAmount;
  } else {
    gameStatus.textContent = "Dealer wins.";
  }

  updateBalance();
  dealButton.disabled = false;
  hitButton.disabled = true;
  standButton.disabled = true;
}

dealButton.addEventListener("click", startGame);
hitButton.addEventListener("click", hit);
standButton.addEventListener("click", stand);

updateBalance();
