const API_KEY = '077b5d90-e70e-4a3a-b3d2-550935498608';
//f1c77f98-7462-477c-8c8a-ab06c8487af3

const matchesContainer = document.getElementById('recent-results-container');
const matchResultLetters = ['W', 'L']

const nickname = new URLSearchParams(window.location.search).get('nickname')

async function getFaceitStats() {
    try {
        // Get player basic info and stats in parallel
        const playerResponse = await fetch(`https://open.faceit.com/data/v4/players?nickname=${encodeURIComponent(nickname)}`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`
            }
        });
        if (!playerResponse.ok) {throw new Error('Failed to fetch data from FACEIT');}
        
        const playerData = await playerResponse.json();
        const playerId = playerData.player_id;

        const statsResponse = await fetch(`https://open.faceit.com/data/v4/players/${playerId}/stats/cs2`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`
            }
        });
        if (!statsResponse.ok) {throw new Error('Failed to fetch data from FACEIT');}

        const statsData = await statsResponse.json();

        // Extract all stats
        const stats = {
            // ELO & Level
            elo: playerData.games?.cs2?.faceit_elo || playerData.games?.csgo?.faceit_elo || 0,
            level: playerData.games?.cs2?.skill_level || playerData.games?.csgo?.skill_level || 0,
            
            // Lifetime Stats
            kd: statsData.lifetime?.['Average K/D Ratio'] || '0.00',
            winRate: statsData.lifetime?.['Win Rate %'] || '0%',
            matches: statsData.lifetime?.Matches || 0,
            recentResults: statsData.lifetime['Recent Results'] || {},
            
            // Recent Performance
            longestWinStreak: statsData.lifetime?.['Longest Win Streak'] || 0,
            currentWinStreak: statsData.lifetime?.['Current Win Streak'] || 0,
            
            // Player Info
            nickname: playerData.nickname,
            country: playerData.country
        };

        console.log('Complete FACEIT stats:', stats);
        return stats;

    } catch (error) {
        console.error('Error fetching FACEIT stats:', error);
        return null;
    }
}

async function lastMatchesOverlay(matches) {
    matchesContainer.innerHTML = "";
    matches.forEach(result => {
        const letter = matchResultLetters[result]
        const stat = document.createElement('div');
        stat.classList.add('stat-item', 'last-matches', letter);
        stat.id = 'last-matches';
        stat.textContent = letter;
        
        matchesContainer.appendChild(stat);
    });
}

// Update your overlay with all stats
async function updateOverlay() {
    const stats = await getFaceitStats();
    
    if (stats) {
        lastMatchesOverlay(stats.recentResults)

        document.getElementById('elo').textContent = `ELO: ${stats.elo}`;
        document.getElementById('level').src = `src/img/${stats.level}.png`;
        document.getElementById('kd').textContent = `KD: ${stats.kd}`;
        document.getElementById('win-rate').textContent = `WR: ${stats.winRate}%`;
        document.getElementById('matches').textContent = `Matches: ${stats.matches}`;
    } else {
        document.getElementById('kd').textContent = 'KD: --';
        document.getElementById('win-rate').textContent = 'WR: --';
        document.getElementById('matches').textContent = 'Matches: --';
    }
}

updateOverlay();
setInterval(updateOverlay, 60000);