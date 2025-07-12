document.getElementById('payButton').addEventListener('click', async () => {
  const response = await fetch('/.netlify/functions/create-checkout-session');
  const session = await response.json();

  const stripe = Stripe('YOUR_PUBLISHABLE_KEY_HERE');
  stripe.redirectToCheckout({ sessionId: session.id });
});
