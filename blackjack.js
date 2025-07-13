// blackjack.js

let walletBalance = 1000; let betAmount = 100; let deck = []; let playerHand = []; let dealerHand = [];

function updateWalletDisplay() { document.getElementById("wallet").textContent = Wallet: $${walletBalance}; }

function createDeck() { const suits = ["Hearts", "Diamonds", "Clubs", "Spades"]; const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]; deck = []; for (let suit of suits) { for (let value of values) { deck.push({ value, suit }); } } deck = deck.sort(() => Math.random() - 0.5); }

function getCardValue(card) { if (["J", "Q", "K"].includes(card.value)) return 10; if (card.value === "A") return 11; return parseInt(card.value); }

function calculateHandValue(hand) { let value = 0; let aces = 0; for (let card of hand) { value += getCardValue(card); if (card.value === "A") aces++; } while (value > 21 && aces > 0) { value -= 10; aces--; } return value; }

function renderHand(hand, elementId) { const container = document.getElementById(elementId); container.innerHTML = ""; for (let card of hand) { const div = document.createElement("div"); div.className = "card"; div.textContent = ${card.value} ${card.suit}; container.appendChild(div); } }

function deal() { if (walletBalance < betAmount) { alert("Not enough funds."); return; } walletBalance -= betAmount; updateWalletDisplay();

createDeck(); playerHand = [deck.pop(), deck.pop()]; dealerHand = [deck.pop(), deck.pop()];

renderHand(playerHand, "player-cards"); renderHand([dealerHand[0]], "dealer-cards");

document.getElementById("status").textContent = "Hit or Stand?"; document.getElementById("hit-btn").disabled = false; document.getElementById("stand-btn").disabled = false; }

function hit() { playerHand.push(deck.pop()); renderHand(playerHand, "player-cards"); const value = calculateHandValue(playerHand); if (value > 21) { endGame(); } }

function stand() { while (calculateHandValue(dealerHand) < 17) { dealerHand.push(deck.pop()); } endGame(); }

function endGame() { renderHand(dealerHand, "dealer-cards"); const playerVal = calculateHandValue(playerHand); const dealerVal = calculateHandValue(dealerHand); let result = ""; if (playerVal > 21) { result = "Bust! Dealer wins."; } else if (dealerVal > 21 || playerVal > dealerVal) { result = "You win!"; walletBalance += betAmount * 2; } else if (playerVal < dealerVal) { result = "Dealer wins."; } else { result = "Push. Bet returned."; walletBalance += betAmount; } updateWalletDisplay(); document.getElementById("status").textContent = result; document.getElementById("hit-btn").disabled = true; document.getElementById("stand-btn").disabled = true; }

document.getElementById("deal-btn").onclick = deal; document.getElementById("hit-btn").onclick = hit; document.getElementById("stand-btn").onclick = stand;

updateWalletDisplay();

