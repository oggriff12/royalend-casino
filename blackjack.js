// blackjack.js

// Force wallet to start at $10 every load localStorage.setItem("walletBalance", 10.00); let walletBalance = 10.00; let currentBet = 0;

const walletEl = document.getElementById("wallet"); const betInput = document.getElementById("betInput"); const insuranceBox = document.getElementById("insurance"); const dealerCards = document.getElementById("dealer-cards"); const playerCards = document.getElementById("player-cards"); const statusDiv = document.getElementById("status");

walletEl.textContent = $${walletBalance.toFixed(2)};

function placeBet() { const bet = parseFloat(betInput.value); if (isNaN(bet) || bet <= 0) { alert("Please enter a valid bet greater than 0."); return; } if (bet > walletBalance) { alert("Not enough funds."); return; } currentBet = bet; walletBalance -= bet; localStorage.setItem("walletBalance", walletBalance.toFixed(2)); walletEl.textContent = $${walletBalance.toFixed(2)}; enableControls(); statusDiv.textContent = "Place your move."; }

function enableControls() { document.getElementById("hit-btn").disabled = false; document.getElementById("stand-btn").disabled = false; }

function disableControls() { document.getElementById("hit-btn").disabled = true; document.getElementById("stand-btn").disabled = true; }

function deal() { clearCards(); animateDealCard(dealerCards); animateDealCard(playerCards); animateDealCard(playerCards); statusDiv.textContent = "Dealt cards."; }

function hit() { animateDealCard(playerCards); statusDiv.textContent = "Hit."; }

function stand() { animateDealCard(dealerCards); statusDiv.textContent = "Stand. Dealer's turn."; disableControls(); }

function takeInsurance() { insuranceBox.classList.add("hidden"); statusDiv.textContent = "Insurance taken."; }

function declineInsurance() { insuranceBox.classList.add("hidden"); statusDiv.textContent = "Insurance declined."; }

function clearCards() { dealerCards.innerHTML = ""; playerCards.innerHTML = ""; }

function animateDealCard(target) { const card = document.createElement("div"); card.className = "card"; card.innerHTML = <div class="card-inner">🂠</div>; target.appendChild(card);

setTimeout(() => { card.classList.add("show"); }, 100); }

