// blackjack.js let balance = parseFloat(localStorage.getItem("wallet")) || 10; let playerHand = []; let dealerHand = []; let deck = []; let gameOver = false;

const balanceDisplay = document.getElementById("balance"); const betInput = document.getElementById("betAmount"); const dealButton = document.getElementById("dealButton"); const hitButton = document.getElementById("hitButton"); const standButton = document.getElementById("standButton"); const messageDisplay = document.getElementById("message"); const playerCards = document.getElementById("player-cards"); const dealerCards = document.getElementById("dealer-cards");

function updateBalanceDisplay() { balanceDisplay.textContent = $${balance.toFixed(2)}; localStorage.setItem("wallet", balance); }

function createDeck() { const suits = ["hearts", "diamonds", "clubs", "spades"]; const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]; let newDeck = []; for (let suit of suits) { for (let value of values) { newDeck.push({ suit, value }); } } return shuffle(newDeck); }

function shuffle(deck) { for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]]; } return deck; }

function getCardValue(card) { if (["J", "Q", "K"].includes(card.value)) return 10; if (card.value === "A") return 11; return parseInt(card.value); }

function getHandValue(hand) { let value = 0; let aceCount = 0; for (let card of hand) { value += getCardValue(card); if (card.value === "A") aceCount++; } while (value > 21 && aceCount > 0) { value -= 10; aceCount--; } return value; }

function renderCard(card, container) { const cardDiv = document.createElement("div"); cardDiv.className = card ${card.suit}; cardDiv.innerHTML = <span>${card.value}</span><span class="suit">${getSuitSymbol(card.suit)}</span>; container.appendChild(cardDiv); }

function getSuitSymbol(suit) { switch (suit) { case "hearts": return "♥"; case "diamonds": return "♦"; case "clubs": return "♣"; case "spades": return "♠"; } }

function dealCards() { const bet = parseFloat(betInput.value); if (isNaN(bet) || bet <= 0 || bet > balance) { alert("Invalid bet amount"); return; }

playerHand = []; dealerHand = []; deck = createDeck(); gameOver = false; messageDisplay.textContent = ""; playerCards.innerHTML = ""; dealerCards.innerHTML = "";

balance -= bet; updateBalanceDisplay();

playerHand.push(deck.pop()); dealerHand.push(deck.pop()); playerHand.push(deck.pop()); dealerHand.push(deck.pop());

renderCard(playerHand[0], playerCards); renderCard(playerHand[1], playerCards); renderCard(dealerHand[0], dealerCards); renderCard({ suit: "back", value: "" }, dealerCards);

if (getHandValue(playerHand) === 21) { endGame(); } }

function hitCard() { if (gameOver) return; const card = deck.pop(); playerHand.push(card); renderCard(card, playerCards); const total = getHandValue(playerHand); if (total > 21) { endGame(); } }

function standCard() { if (gameOver) return; dealerCards.innerHTML = ""; renderCard(dealerHand[0], dealerCards); renderCard(dealerHand[1], dealerCards);

while (getHandValue(dealerHand) < 17) { const card = deck.pop(); dealerHand.push(card); renderCard(card, dealerCards); }

endGame(); }

function endGame() { gameOver = true; const playerTotal = getHandValue(playerHand); const dealerTotal = getHandValue(dealerHand); const bet = parseFloat(betInput.value); let message = "";

if (playerTotal > 21) { message = "You busted! Dealer wins."; } else if (dealerTotal > 21 || playerTotal > dealerTotal) { balance += bet * 2; message = "You win!"; } else if (playerTotal === dealerTotal) { balance += bet; message = "Push. Bet returned."; } else { message = "Dealer wins."; } updateBalanceDisplay(); messageDisplay.textContent = message; }

dealButton.addEventListener("click", dealCards); hitButton.addEventListener("click", hitCard); standButton.addEventListener("click", standCard);

updateBalanceDisplay();

