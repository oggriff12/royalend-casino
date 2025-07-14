async function fetchBonusCodes() {
    const response = await fetch('https://YOUR_REPLIT_URL/api/bonus-codes');
    const codes = await response.json();
    const container = document.getElementById('codes-container');
    container.innerHTML = '';
    if (codes.length === 0) {
        container.innerHTML = '<p>No codes available.</p>';
    } else {
        codes.forEach(code => {
            const div = document.createElement('div');
            div.className = 'code-entry ' + (code.claimed ? 'claimed' : '');
            div.innerHTML = `
                <p><b>${code.site.toUpperCase()}</b>: ${code.code}</p>
                <p class="status">${code.claimed ? 'CLAIMED ❌' : 'UNCLAIMED ✅'}</p>
                <p class="wager">Wager: ${code.wager}</p>
            `;
            container.appendChild(div);
        });
    }
}

setInterval(fetchBonusCodes, 60000); // Auto-refresh every 60s
fetchBonusCodes();
