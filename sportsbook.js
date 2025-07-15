const API_KEY = '273237';
const leagues = {
    NBA: '4387',
    NFL: '4391',
    MLB: '4424'
};

async function fetchLiveGames() {
    const gamesContainer = document.getElementById('games-container');
    gamesContainer.innerHTML = '<p>Loading live games…</p>';

    try {
        let html = '';
        for (const [league, id] of Object.entries(leagues)) {
            const res = await fetch(`https://www.thesportsdb.com/api/v1/json/${API_KEY}/eventsnextleague.php?id=${id}`);
            const data = await res.json();
            if (data.events) {
                html += `<h3>${league} Upcoming Games:</h3>`;
                data.events.slice(0, 3).forEach(event => {
                    html += `
                        <div class="game-card">
                            <p><strong>${event.strEvent}</strong></p>
                            <p>Date: ${event.dateEvent} | Time: ${event.strTime}</p>
                        </div>`;
                });
            }
        }
        gamesContainer.innerHTML = html || '<p>No live games.</p>';
    } catch (err) {
        gamesContainer.innerHTML = '<p>Error loading games.</p>';
    }
}

async function fetchLiveOdds() {
    const oddsContainer = document.getElementById('odds-container');
    oddsContainer.innerHTML = '<p>Loading live odds…</p>';

    try {
        let html = '';
        for (const [league, id] of Object.entries(leagues)) {
            const res = await fetch(`https://www.thesportsdb.com/api/v1/json/${API_KEY}/livescore.php?l=${id}`);
            const data = await res.json();
            if (data.events) {
                html += `<h3>${league} Odds:</h3>`;
                data.events.slice(0, 3).forEach(event => {
                    html += `
                        <div class="odds-card">
                            <p><strong>${event.strEvent}</strong></p>
                            <p>Status: ${event.strStatus}</p>
                            <p>Score: ${event.intHomeScore || '-'} - ${event.intAwayScore || '-'}</p>
                        </div>`;
                });
            }
        }
        oddsContainer.innerHTML = html || '<p>No live odds.</p>';
    } catch (err) {
        oddsContainer.innerHTML = '<p>Error loading odds.</p>';
    }
}

fetchLiveGames();
fetchLiveOdds();
setInterval(fetchLiveGames, 60000);
setInterval(fetchLiveOdds, 60000);
