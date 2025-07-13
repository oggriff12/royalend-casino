const fetch = require("node-fetch");

exports.handler = async function(event, context) {
  const apiKey = process.env.ODDS_API_KEY;
  const region = "us"; // You can change this to "uk", "eu", etc.
  const sport = "upcoming"; // You can also use "basketball_nba", "soccer_epl", etc.

  const url = `https://api.the-odds-api.com/v4/sports/${sport}/odds/?apiKey=${apiKey}&regions=${region}&markets=h2h,spreads&oddsFormat=decimal`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch odds", details: error.message }),
    };
  }
};
