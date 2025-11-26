const API_KEY = '077b5d90-e70e-4a3a-b3d2-550935498608';
const PLAYER_ID = 'arbz66';

async function fetchFaceitStats() {
    try {
        const response = await fetch(`https://open.faceit.com/data/v4/players/${PLAYER_ID}`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`
            }
        });
        
        const playerData = await response.json();
        
        // Update ELO
        document.getElementById('elo').textContent = `ELO: ${playerData.games.cs2.faceit_elo || playerData.games.csgo.faceit_elo}`;
        
        // Fetch additional stats
        const statsResponse = await fetch(`https://open.faceit.com/data/v4/players/${PLAYER_ID}/stats/cs2`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`
            }
        });
        
        const statsData = await statsResponse.json();
        const lifetimeStats = statsData.lifetime;
        
        document.getElementById('kd').textContent = `KD: ${lifetimeStats['Average K/D Ratio']}`;
        document.getElementById('kr').textContent = `KR: ${lifetimeStats['Average K/R Ratio']}`;
        document.getElementById('matches').textContent = `Matches: ${lifetimeStats.Matches}`;
        
    } catch (error) {
        console.error('Error fetching Faceit data:', error);
    }
}

// Update every 30 seconds
fetchFaceitStats();
setInterval(fetchFaceitStats, 30000);