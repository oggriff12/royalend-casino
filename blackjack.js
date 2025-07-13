// blackjack.js
let deck, playerHand, dealerHand;
let wallet = parseFloat(localStorage.getItem('wallet')) || 10;
let bet = 0;
let stats = { wins: 0, losses: 0, ties: 0 };

const walletDisplay = document.getElementById("wallet");
const playerCards = document.getElementById("player-cards");
const dealerCards = document.getElementById("dealer-cards");
const statusDisplay = document.getElementById("status");
const betInput = document.getElementById("betInput");
const insuranceBox = document.getElementById("insurance");

function updateWalletDisplay() {
  walletDisplay.textContent = wallet.toFixed(2);
  localStorage.setItem('wallet', wallet);
}

function updateStatsDisplay() {
  document.getElementById("wins").textContent = stats.wins;
  document.getElementById("losses").textContent = stats.losses;
  document.getElementById("ties").textContent = stats.ties;
}

function createDeck() {
  const suits = ["♠", "♥", "♦", "♣"];
  const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  return suits.flatMap(suit => values.map(value => ({ suit, value })));
}

function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function calculateValue(hand) {
  let total = 0;
  let aces = 0;
  for (const card of hand) {
    if (card.value === "A") {
      aces++;
      total += 11;
    } else if (["K", "Q", "J"].includes(card.value)) {
      total += 10;
    } else {
      total += parseInt(card.value);
    }
  }
  while (total > 21 && aces) {
    total -= 10;
    aces--;
  }
  return total;
}

function renderCards(container, hand) {
  container.innerHTML = "";
  hand.forEach(card => {
    const cardEl = document.createElement("div");
    cardEl.className = "card";
    cardEl.innerHTML = `${card.value}${card.suit}`;
    container.appendChild(cardEl);
  });
}

function placeBet() {
  bet = parseFloat(betInput.value);
  if (isNaN(bet) || bet <= 0 || bet > wallet) {
    alert("Invalid bet amount");
    return;
  }

  wallet -= bet;
  updateWalletDisplay();
  startGame();
}

function startGame() {
  deck = shuffleDeck(createDeck());
  playerHand = [deck.pop(), deck.pop()];
  dealerHand = [deck.pop(), deck.pop()];
  renderCards(playerCards, playerHand);
  renderCards(dealerCards, [dealerHand[0], { value: "?", suit: "" }]);
  statusDisplay.textContent = "Game in progress...";
  document.getElementById("hit-btn").disabled = false;
  document.getElementById("stand-btn").disabled = false;

  // Show insurance if dealer shows Ace
  if (dealerHand[0].value === "A") {
    insuranceBox.classList.add("show");
  } else {
    insuranceBox.classList.remove("show");
  }
}

function hit() {
  playerHand.push(deck.pop());
  renderCards(playerCards, playerHand);

  if (calculateValue(playerHand) > 21) {
    endGame("Bust! You lose.");
    stats.losses++;
    updateStatsDisplay();
  }
}

function stand() {
  while (calculateValue(dealerHand) < 17) {
    dealerHand.push(deck.pop());
  }

  const playerScore = calculateValue(playerHand);
  const dealerScore = calculateValue(dealerHand);

  renderCards(dealerCards, dealerHand);

  if (dealerScore > 21 || playerScore > dealerScore) {
    wallet += bet * 2;
    statusDisplay.textContent = "You win!";
    stats.wins++;
  } else if (dealerScore === playerScore) {
    wallet += bet;
    statusDisplay.textContent = "Push (tie).";
    stats.ties++;
  } else {
    statusDisplay.textContent = "Dealer wins.";
    stats.losses++;
  }

  updateWalletDisplay();
  updateStatsDisplay();
  document.getElementById("hit-btn").disabled = true;
  document.getElementById("stand-btn").disabled = true;
}

function takeInsurance() {
  insuranceBox.classList.remove("show");
  alert("Insurance taken (not implemented fully). Good luck!");
}

function declineInsurance() {
  insuranceBox.classList.remove("show");
}

updateWalletDisplay();
updateStatsDisplay();
