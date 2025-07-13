// Blackjack Game Script with Split, Double Down, Surrender, Insurance, and Persistent Wallet

let deck = [];
let playerHand = [];
let dealerHand = [];
let playerSplitHand = [];
let isSplit = false;
let currentHand = 'main';
let betAmount = 0;
let wallet = parseFloat(localStorage.getItem("walletBalance")) || 10;
let hasInsurance = false;

const walletDisplay = document.getElementById("wallet");
const playerCards = document.getElementById("player-cards");
const dealerCards = document.getElementById("dealer-cards");
const statusDisplay = document.getElementById("status");
const insuranceBox = document.getElementById("insurance");

function updateWallet() {
  walletDisplay.textContent = `$${wallet.toFixed(2)}`;
  localStorage.setItem("walletBalance", wallet);
}

function createDeck() {
  const suits = ["♠", "♣", "♥", "♦"];
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
  let value = hand.reduce((sum, card) => sum + getCardValue(card), 0);
  let aces = hand.filter(card => card.value === "A").length;
  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }
  return value;
}

function displayHand(hand, element) {
  element.innerHTML = "";
  for (let card of hand) {
    const cardDiv = document.createElement("div");
    cardDiv.className = "card";
    cardDiv.textContent = `${card.value}${card.suit}`;
    element.appendChild(cardDiv);
  }
}

function dealCard(hand) {
  const card = deck.pop();
  hand.push(card);
}

function resetGame() {
  playerHand = [];
  dealerHand = [];
  playerSplitHand = [];
  isSplit = false;
  currentHand = 'main';
  statusDisplay.textContent = "";
  insuranceBox.classList.add("hidden");
  document.getElementById("hit-btn").disabled = true;
  document.getElementById("stand-btn").disabled = true;
  document.getElementById("double-btn").disabled = true;
  document.getElementById("split-btn").disabled = true;
  document.getElementById("surrender-btn").disabled = true;
}

function placeBet() {
  const input = document.getElementById("betInput");
  const value = parseFloat(input.value);
  if (isNaN(value) || value <= 0 || value > wallet) {
    alert("Invalid bet amount");
    return;
  }
  betAmount = value;
  wallet -= betAmount;
  updateWallet();
  document.getElementById("deal-btn").disabled = false;
}

function deal() {
  resetGame();
  createDeck();
  dealCard(playerHand);
  dealCard(dealerHand);
  dealCard(playerHand);
  dealCard(dealerHand);
  displayHand(playerHand, playerCards);
  displayHand(dealerHand, dealerCards);
  document.getElementById("hit-btn").disabled = false;
  document.getElementById("stand-btn").disabled = false;
  document.getElementById("double-btn").disabled = false;
  document.getElementById("surrender-btn").disabled = false;
  if (playerHand[0].value === playerHand[1].value) {
    document.getElementById("split-btn").disabled = false;
  }
  if (dealerHand[0].value === "A") {
    insuranceBox.classList.remove("hidden");
  }
  document.getElementById("deal-btn").disabled = true;
}

function hit() {
  const hand = isSplit && currentHand === 'split' ? playerSplitHand : playerHand;
  dealCard(hand);
  displayHand(hand, playerCards);
  const value = calculateHandValue(hand);
  if (value > 21) {
    statusDisplay.textContent = "Bust! You lose.";
    endRound();
  }
}

function stand() {
  while (calculateHandValue(dealerHand) < 17) {
    dealCard(dealerHand);
  }
  displayHand(dealerHand, dealerCards);
  const dealerValue = calculateHandValue(dealerHand);
  const playerValue = calculateHandValue(playerHand);
  if (dealerValue > 21 || playerValue > dealerValue) {
    statusDisplay.textContent = "You win!";
    wallet += betAmount * 2;
  } else if (playerValue === dealerValue) {
    statusDisplay.textContent = "Push.";
    wallet += betAmount;
  } else {
    statusDisplay.textContent = "Dealer wins.";
  }
  updateWallet();
  endRound();
}

function doubleDown() {
  if (wallet >= betAmount) {
    wallet -= betAmount;
    betAmount *= 2;
    updateWallet();
    hit();
    stand();
  }
}

function split() {
  if (playerHand[0].value === playerHand[1].value) {
    isSplit = true;
    playerSplitHand.push(playerHand.pop());
    dealCard(playerHand);
    dealCard(playerSplitHand);
    displayHand(playerHand, playerCards);
    currentHand = 'split';
  }
}

function surrender() {
  statusDisplay.textContent = "You surrendered. Half bet returned.";
  wallet += betAmount / 2;
  updateWallet();
  endRound();
}

function endRound() {
  document.getElementById("hit-btn").disabled = true;
  document.getElementById("stand-btn").disabled = true;
  document.getElementById("double-btn").disabled = true;
  document.getElementById("split-btn").disabled = true;
  document.getElementById("surrender-btn").disabled = true;
  document.getElementById("deal-btn").disabled = false;
}

function takeInsurance() {
  hasInsurance = true;
  insuranceBox.classList.add("hidden");
}

function declineInsurance() {
  hasInsurance = false;
  insuranceBox.classList.add("hidden");
}

updateWallet();
