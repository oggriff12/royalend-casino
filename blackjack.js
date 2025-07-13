let wallet = parseFloat(localStorage.getItem("wallet")) || 10.0;
document.getElementById("wallet").textContent = `$${wallet.toFixed(2)}`;

const dealerCards = document.getElementById("dealer-cards");
const playerCards = document.getElementById("player-cards");
const status = document.getElementById("status");
const dealBtn = document.getElementById("deal-btn");
const hitBtn = document.getElementById("hit-btn");
const standBtn = document.getElementById("stand-btn");
const betInput = document.getElementById("betInput");

let deck, playerHand, dealerHand, currentBet;

function createDeck() {
  const suits = ["♠", "♥", "♦", "♣"];
  const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  const newDeck = [];
  for (let suit of suits) {
    for (let value of values) {
      newDeck.push({ suit, value });
    }
  }
  return newDeck.sort(() => Math.random() - 0.5);
}

function placeBet() {
  currentBet = parseFloat(betInput.value);
  if (isNaN(currentBet) || currentBet <= 0 || currentBet > wallet) {
    alert("Invalid bet amount");
    return;
  }
  wallet -= currentBet;
  updateWalletDisplay();
  deal();
}

function updateWalletDisplay() {
  localStorage.setItem("wallet", wallet);
  document.getElementById("wallet").textContent = `$${wallet.toFixed(2)}`;
}

function deal() {
  status.textContent = "";
  dealerCards.innerHTML = "";
  playerCards.innerHTML = "";
  deck = createDeck();
  playerHand = [deck.pop(), deck.pop()];
  dealerHand = [deck.pop(), deck.pop()];
  renderCards();
  hitBtn.disabled = false;
  standBtn.disabled = false;
  dealBtn.disabled = true;
  checkBlackjack();
}

function renderCards() {
  playerCards.innerHTML = "";
  dealerCards.innerHTML = "";

  playerHand.forEach(card => {
    const el = createCardElement(card);
    playerCards.appendChild(el);
  });

  dealerHand.forEach((card, i) => {
    const el = createCardElement(i === 0 ? { suit: "?", value: "?" } : card);
    dealerCards.appendChild(el);
  });
}

function createCardElement(card) {
  const el = document.createElement("div");
  el.className = "card";
  el.textContent = `${card.value}${card.suit}`;
  return el;
}

function hit() {
  playerHand.push(deck.pop());
  renderCards();
  if (calculateScore(playerHand) > 21) {
    endRound("Bust! Dealer wins.");
  }
}

function stand() {
  while (calculateScore(dealerHand) < 17) {
    dealerHand.push(deck.pop());
  }
  renderCards();
  determineWinner();
}

function calculateScore(hand) {
  let score = 0;
  let aces = 0;
  for (let card of hand) {
    if (["J", "Q", "K"].includes(card.value)) score += 10;
    else if (card.value === "A") {
      score += 11;
      aces++;
    } else {
      score += parseInt(card.value);
    }
  }
  while (score > 21 && aces) {
    score -= 10;
    aces--;
  }
  return score;
}

function checkBlackjack() {
  const playerScore = calculateScore(playerHand);
  if (playerScore === 21) {
    endRound("Blackjack! You win!", true);
  }
}

function determineWinner() {
  const playerScore = calculateScore(playerHand);
  const dealerScore = calculateScore(dealerHand);

  if (dealerScore > 21 || playerScore > dealerScore) {
    endRound("You win!", true);
  } else if (playerScore < dealerScore) {
    endRound("Dealer wins.");
  } else {
    endRound("Push. Bet returned.", null);
  }
}

function endRound(msg, win = false) {
  status.textContent = msg;
  if (win) {
    wallet += currentBet * 2;
  } else if (win === null) {
    wallet += currentBet;
  }
  updateWalletDisplay();
  hitBtn.disabled = true;
  standBtn.disabled = true;
  dealBtn.disabled = false;

  // Reveal dealer's full hand
  renderCards = () => {
    dealerCards.innerHTML = "";
    playerCards.innerHTML = "";

    playerHand.forEach(card => {
      playerCards.appendChild(createCardElement(card));
    });
    dealerHand.forEach(card => {
      dealerCards.appendChild(createCardElement(card));
    });
  };
  renderCards();
}

// Initialize particles background
tsParticles.loadJSON("particles-js", "particles.json").then(() => {
  console.log("Particles loaded.");
});
