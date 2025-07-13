// blackjack.js let wallet = parseFloat(localStorage.getItem("wallet")) || 10.00; let playerHand = []; let dealerHand = []; let deck = []; let betAmount = 0; let gameOver = true; let roundsPlayed = 0; let wins = 0, losses = 0, ties = 0;

const walletDisplay = document.getElementById("wallet"); const statusDisplay = document.getElementById("status"); const playerCards = document.getElementById("player-cards"); const dealerCards = document.getElementById("dealer-cards"); const betInput = document.getElementById("betInput");

function updateWalletDisplay() { walletDisplay.textContent = $${wallet.toFixed(2)}; localStorage.setItem("wallet", wallet); }

function createDeck() { const suits = ["♠", "♥", "♦", "♣"]; const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]; let newDeck = []; for (let suit of suits) { for (let value of values) { newDeck.push({ value, suit }); } } return newDeck.sort(() => Math.random() - 0.5); }

function dealCard(toDealer = false) { const card = deck.pop(); const cardEl = document.createElement("div"); cardEl.className = "card"; cardEl.innerHTML = <span>${card.value}</span><span>${card.suit}</span>; if (toDealer) { dealerHand.push(card); dealerCards.appendChild(cardEl); } else { playerHand.push(card); playerCards.appendChild(cardEl); } return card; }

function getCardValue(card) { if (["K", "Q", "J"].includes(card.value)) return 10; if (card.value === "A") return 11; return parseInt(card.value); }

function getHandValue(hand) { let value = 0; let aces = 0; for (let card of hand) { value += getCardValue(card); if (card.value === "A") aces++; } while (value > 21 && aces > 0) { value -= 10; aces--; } return value; }

function placeBet() { const amount = parseFloat(betInput.value); if (isNaN(amount) || amount <= 0 || amount > wallet) { alert("Invalid bet"); return; } betAmount = amount; wallet -= betAmount; updateWalletDisplay(); startGame(); }

function startGame() { gameOver = false; deck = createDeck(); playerHand = []; dealerHand = []; playerCards.innerHTML = ""; dealerCards.innerHTML = ""; statusDisplay.textContent = "";

dealCard(); dealCard(true); dealCard(); dealCard(true);

document.getElementById("hit-btn").disabled = false; document.getElementById("stand-btn").disabled = false; }

function hit() { if (gameOver) return; dealCard(); const value = getHandValue(playerHand); if (value > 21) { endGame("Bust! Dealer wins."); } }

function stand() { if (gameOver) return; while (getHandValue(dealerHand) < 17) { dealCard(true); }

const playerValue = getHandValue(playerHand); const dealerValue = getHandValue(dealerHand);

if (dealerValue > 21 || playerValue > dealerValue) { endGame("You win!", true); } else if (dealerValue === playerValue) { endGame("Push. It's a tie.", null); } else { endGame("Dealer wins."); } }

function endGame(message, playerWins = false) { gameOver = true; document.getElementById("hit-btn").disabled = true; document.getElementById("stand-btn").disabled = true; statusDisplay.textContent = message;

if (playerWins === true) { wins++; wallet += betAmount * 2; } else if (playerWins === null) { ties++; wallet += betAmount; } else { losses++; }

updateWalletDisplay(); betAmount = 0; roundsPlayed++;

if (roundsPlayed % 5 === 0) { wallet += 5; alert("Bonus Round! You've received $5 for playing 5 hands."); updateWalletDisplay(); }

updateStatsDisplay(); }

function updateStatsDisplay() { let stats = document.getElementById("stats"); if (!stats) { stats = document.createElement("div"); stats.id = "stats"; stats.className = "stats"; document.querySelector(".game-container").appendChild(stats); } stats.innerHTML = Wins: ${wins} | Losses: ${losses} | Ties: ${ties}; }

function doubleDown() { // logic placeholder }

function split() { // logic placeholder }

function surrender() { // logic placeholder }

function takeInsurance() {} function declineInsurance() {}

updateWalletDisplay(); updateStatsDisplay();

