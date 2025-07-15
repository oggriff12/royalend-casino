async function fetchBonusCodes() {
    const container = document.getElementById('codes-container');
    container.innerHTML = '<p>Loading bonus codes...</p>';

    try {
        const response = await fetch('https://your-replit-url.repl.co/bonus-codes'); // replace with your actual Replit link
        if (!response.ok) throw new Error('Failed to fetch codes');

        const codes = await response.json();
        container.innerHTML = '';

        if (!Array.isArray(codes) || codes.length === 0) {
            container.innerHTML = '<p>No bonus codes available.</p>';
            return;
        }

        codes.forEach(code => {
            const div = document.createElement('div');
            div.className = 'code-entry';

            div.innerHTML = `
                <p><b>${code.site.toUpperCase()}</b> — ${code.code}</p>
                <p class="status">Status: ${code.status.includes('Unclaimed') ? '✅ UNCLAIMED' : '❌ CLAIMED'}</p>
                <p class="wager">Wager: ${code.wager}</p>
                <p class="timestamp">Posted: ${code.timestamp}</p>
            `;

            container.appendChild(div);
        });
    } catch (error) {
        console.error('Error loading codes:', error);
        container.innerHTML = '<p>Failed to load bonus codes.</p>';
    }
}

// Auto-refresh every 60 seconds
setInterval(fetchBonusCodes, 60000);
fetchBonusCodes();
