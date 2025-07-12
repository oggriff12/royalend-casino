const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async function (event, context) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'RoyalEnd Casino Chips',
          },
          unit_amount: 500, // $5 = 500 chips
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: 'https://royalend.netlify.app/success.html',
    cancel_url: 'https://royalend.netlify.app/store.html',
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ id: session.id }),
  };
};
