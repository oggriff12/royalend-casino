const promoCodes = {
  ROYAL10: 0.10,  // +10% bonus chips
  BONUS25: 0.25   // +25% bonus chips
};

let activePromo = null;

document.querySelectorAll('.pay-button').forEach(button => {
  button.addEventListener('click', async () => {
    const baseAmount = parseInt(button.getAttribute('data-amount'));
    const bonus = activePromo ? Math.round(baseAmount * promoCodes[activePromo]) : 0;
    const finalAmount = baseAmount + bonus;

    const response = await fetch('/.netlify/functions/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount: finalAmount })
    });

    const session = await response.json();
    const stripe = Stripe(pk_live_51LtHnPLIlCvt9RCoW1Kp2kz3fJsJxoKE8xhuX29pUnAqD4xOBKIQCPLFhpNWJW1a3P9Lo5SEqxsB6FTkuxFpPdeO00wiLyt2XW
);
    stripe.redirectToCheckout({ sessionId: session.id });
  });
});

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
