let deck, playerHand, dealerHand;
let wallet = 10.00;
let currentBet = 0;
let gameInProgress = false;
let insuranceOffered = false;

const walletSpan = document.getElementById("wallet");
const betInput = document.getElementById("betInput");
const dealerCards = document.getElementById("dealer-cards");
const playerCards = document.getElementById("player-cards");
const dealBtn = document.getElementById("deal-btn");
const hitBtn = document.getElementById("hit-btn");
const standBtn = document.getElementById("stand-btn");
const statusDiv = document.getElementById("status");
const insuranceDiv = document.getElementById("insurance");

function updateWalletDisplay() {
  walletSpan.textContent = `$${wallet.toFixed(2)}`;
}

function createDeck() {
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const newDeck = [];
  for (let suit of suits) {
    for (let value of values) {
      newDeck.push({ suit, value });
    }
  }
  return newDeck.sort(() => Math.random() - 0.5);
}

function getCardValue(card) {
  if (['J', 'Q', 'K'].includes(card.value)) return 10;
  if (card.value === 'A') return 11;
  return parseInt(card.value);
}

function calculateHandValue(hand) {
  let value = 0;
  let aces = 0;
  for (let card of hand) {
    value += getCardValue(card);
    if (card.value === 'A') aces++;
  }
  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }
  return value;
}

function renderCard(card, target) {
  const cardDiv = document.createElement("div");
  cardDiv.className = `card ${card.suit}`;
  cardDiv.innerHTML = `<span>${card.value}</span>`;
  cardDiv.style.opacity = 0;
  target.appendChild(cardDiv);
  setTimeout(() => {
    cardDiv.style.transform = "translateY(0)";
    cardDiv.style.opacity = 1;
  }, 100);
}

function dealCardTo(hand, target) {
  const card = deck.pop();
  hand.push(card);
  renderCard(card, target);
}

function clearTable() {
  dealerCards.innerHTML = "";
  playerCards.innerHTML = "";
  statusDiv.textContent = "";
}

function placeBet() {
  const bet = parseFloat(betInput.value);
  if (isNaN(bet) || bet <= 0) {
    alert("Please enter a valid bet greater than 0.");
    return;
  }
  if (bet > wallet) {
    alert("Not enough funds.");
    return;
  }
  currentBet = bet;
  wallet -= bet;
  updateWalletDisplay();
  dealBtn.disabled = false;
}

function deal() {
  if (currentBet <= 0) {
    alert("Please place a bet first.");
    return;
  }

  gameInProgress = true;
  dealBtn.disabled = true;
  hitBtn.disabled = false;
  standBtn.disabled = false;
  insuranceOffered = false;

  deck = createDeck();
  playerHand = [];
  dealerHand = [];
  clearTable();

  dealCardTo(playerHand, playerCards);
  dealCardTo(dealerHand, dealerCards);
  dealCardTo(playerHand, playerCards);
  dealCardTo(dealerHand, dealerCards);

  if (getCardValue(dealerHand[0]) === 11) {
    offerInsurance();
  }

  checkBlackjack();
}

function checkBlackjack() {
  const playerValue = calculateHandValue(playerHand);
  const dealerValue = calculateHandValue(dealerHand);

  if (playerValue === 21) {
    if (dealerValue === 21) {
      endGame("Push! Both have Blackjack.");
    } else {
      wallet += currentBet * 2.5;
      endGame("Blackjack! You win!");
    }
  } else if (dealerValue === 21) {
    endGame("Dealer has Blackjack. You lose.");
  }
}

function offerInsurance() {
  insuranceOffered = true;
  insuranceDiv.classList.remove("hidden");
}

function takeInsurance() {
  const insuranceBet = currentBet / 2;
  if (insuranceBet > wallet) {
    alert("Not enough funds for insurance.");
    return;
  }
  wallet -= insuranceBet;
  updateWalletDisplay();
  insuranceDiv.classList.add("hidden");
  checkInsuranceOutcome(insuranceBet);
}

function declineInsurance() {
  insuranceDiv.classList.add("hidden");
}

function checkInsuranceOutcome(insuranceBet) {
  const dealerValue = calculateHandValue(dealerHand);
  if (dealerValue === 21) {
    wallet += insuranceBet * 3;
    updateWalletDisplay();
    endGame("Dealer has Blackjack. Insurance pays 2:1.");
  }
}

function hit() {
  dealCardTo(playerHand, playerCards);
  const playerValue = calculateHandValue(playerHand);
  if (playerValue > 21) {
    endGame("Bust! You lose.");
  }
}

function stand() {
  hitBtn.disabled = true;
  standBtn.disabled = true;

  while (calculateHandValue(dealerHand) < 17) {
    dealCardTo(dealerHand, dealerCards);
  }

  const playerValue = calculateHandValue(playerHand);
  const dealerValue = calculateHandValue(dealerHand);

  if (dealerValue > 21 || playerValue > dealerValue) {
    wallet += currentBet * 2;
    endGame("You win!");
  } else if (playerValue === dealerValue) {
    wallet += currentBet;
    endGame("Push!");
  } else {
    endGame("You lose.");
  }
}

function endGame(message) {
  statusDiv.textContent = message;
  updateWalletDisplay();
  hitBtn.disabled = true;
  standBtn.disabled = true;
  gameInProgress = false;
  currentBet = 0;
}

updateWalletDisplay();
