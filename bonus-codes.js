const CODES_URL = 'https://raw.githubusercontent.com/oggriff12/royalend-casino/main/codes.json';
let allCodes = [];

async function fetchBonusCodes() {
  const container = document.getElementById('codes-container');
  container.innerHTML = '<p>Loading bonus codes...</p>';

  try {
    const response = await fetch(CODES_URL);
    if (!response.ok) throw new Error('Failed to fetch codes');
    allCodes = await response.json();
    displayCodes(allCodes);
  } catch (error) {
    container.innerHTML = `<p style="color:red;">Error loading bonus codes.</p>`;
    console.error(error);
  }
}

function displayCodes(codes) {
  const container = document.getElementById('codes-container');
  container.innerHTML = '';

  if (!codes.length) {
    container.innerHTML = '<p>No bonus codes available.</p>';
    return;
  }

  codes.forEach(code => {
    const div = document.createElement('div');
    div.className = 'code-entry';
    div.innerHTML = `
      <h2>${code.site.toUpperCase()}</h2>
      <p><strong>${code.code}</strong></p>
      <p class="status ${code.status.includes('Unclaimed') ? 'unclaimed' : 'claimed'}">
        ${code.status.includes('Unclaimed') ? '✅ UNCLAIMED' : '❌ CLAIMED'}
      </p>
      <p>Wager: ${code.wager}</p>
      <p>Posted: ${code.timestamp}</p>
    `;
    container.appendChild(div);
  });
}

function filterCodes(filter) {
  if (filter === 'all') {
    displayCodes(allCodes);
  } else {
    const filtered = allCodes.filter(code => code.site.toLowerCase() === filter.toLowerCase());
    displayCodes(filtered);
  }
}

fetchBonusCodes();
setInterval(fetchBonusCodes, 60000);
