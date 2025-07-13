let activePromo = null;
const DEFAULT_BALANCE = 1000;

// --------- BALANCE STORAGE ---------
function getBalance() {
  return parseFloat(localStorage.getItem('balance')) || DEFAULT_BALANCE;
}

function setBalance(amount) {
  localStorage.setItem('balance', amount.toFixed(2));
}

function updateBalanceDisplay(elementId = 'balanceDisplay') {
  const el = document.getElementById(elementId);
  if (el) el.textContent = `Balance: $${getBalance().toFixed(2)}`;
}

function resetBalance() {
  setBalance(DEFAULT_BALANCE);
  updateBalanceDisplay();
}

// --------- PROMO / PAYMENT ---------
document.querySelectorAll('.pay-button').forEach(button => {
  button.addEventListener('click', async () => {
    const baseAmount = parseInt(button.getAttribute('data-amount'));
    const bonus = activePromo ? Math.round(baseAmount * promoCodes[activePromo]) : 0;
    const finalAmount = baseAmount + bonus;

    // Add chips directly to balance
    const newBalance = getBalance() + finalAmount;
    setBalance(newBalance);
    updateBalanceDisplay();

    // Optional: Send to Stripe checkout if using real payment system
    const response = await fetch('/.netlify/functions/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount: finalAmount })
    });

    const session = await response.json();
    const stripe = Stripe('pk_live_...'); // Replace with your real key
    stripe.redirectToCheckout({ sessionId: session.id });
  });
});

// --------- PROMO CODE ---------
document.getElementById('applyPromo').addEventListener('click', () => {
  const input = document.getElementById('promoCode').value.trim().toUpperCase();
  const message = document.getElementById('promoMessage');

  if (promoCodes[input]) {
    activePromo = input;
    message.textContent = `✅ Promo applied: ${input} (+${promoCodes[input] * 100}% chips)`;
    message.style.color = '#0f0';
  } else {
    activePromo = null;
    message.textContent = '❌ Invalid promo code';
    message.style.color = '#f00';
  }
});
