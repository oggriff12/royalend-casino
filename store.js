document.querySelectorAll('.pay-button').forEach(button => {
  button.addEventListener('click', async () => {
    const amount = button.getAttribute('data-amount');
    
    const response = await fetch('/.netlify/functions/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount })
    });

    const session = await response.json();
    const stripe = Stripe('YOUR_PUBLISHABLE_KEY_HERE');
    stripe.redirectToCheckout({ sessionId: session.id });
  });
});
