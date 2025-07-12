let playerHand = [];
let dealerHand = [];
let wallet = 100;
let bet = 0;

document.getElementById("wallet").textContent = wallet.toFixed(2);

function startGame() {
  bet = parseFloat(document.getElementById("betAmount").value);
  if (bet > wallet || bet <= 0) {
    alert("Invalid bet amount.");
    return;
  }

  wallet -= bet;
  updateWallet();

  playerHand = [drawCard(), drawCard()];
  dealerHand = [drawCard(), drawCard()];

  displayHands();
  document.getElementById("statusText").textContent = "Your turn!";
}

function drawCard() {
  return Math.floor(Math.random() * 10) + 1;
}

function getTotal(hand) {
  return hand.reduce((a, b) => a + b, 0);
}

function displayHands() {
  document.getElementById("playerHand").textContent = "Player: " + playerHand.join(", ") + " (Total: " + getTotal(playerHand) + ")";
  document.getElementById("dealerHand").textContent = "Dealer: " + dealerHand[0] + ", ?";
}

function hit() {
  playerHand.push(drawCard());
  displayHands();

  if (getTotal(playerHand) > 21) {
    document.getElementById("statusText").textContent = "Bust! You lost.";
  }
}

function stand() {
  while (getTotal(dealerHand) < 17) {
    dealerHand.push(drawCard());
  }

  const playerTotal = getTotal(playerHand);
  const dealerTotal = getTotal(dealerHand);

  document.getElementById("dealerHand").textContent = "Dealer: " + dealerHand.join(", ") + " (Total: " + dealerTotal + ")";

  if (dealerTotal > 21 || playerTotal > dealerTotal) {
    wallet += bet * 2;
    document.getElementById("statusText").textContent = "You win!";
  } else if (playerTotal === dealerTotal) {
    wallet += bet;
    document.getElementById("statusText").textContent = "Push!";
  } else {
    document.getElementById("statusText").textContent = "Dealer wins.";
  }

  updateWallet();
}

function doubleDown() {
  if (wallet >= bet) {
    wallet -= bet;
    bet *= 2;
    hit();
    stand();
  } else {
    alert("Not enough funds to double.");
  }
}

function insurance() {
  alert("Insurance placed (stub)");
}

function updateWallet() {
  document.getElementById("wallet").textContent = wallet.toFixed(2);
}
