/**
 * Game Registry - Lists all available games
 * To add a new game, add an entry here following the same pattern
 */
const gameRegistry = {
    tictactoe: {
        id: 'tictactoe',
        name: 'Tic-Tac-Toe',
        description: 'Classic 3x3 strategy game. Play against AI or a friend locally!',
        path: 'games/tictactoe.html'
    },
    snake: {
        id: 'snake',
        name: 'Snake',
        description: 'Guide the snake to eat food and grow longer. Avoid walls and yourself! 10 levels of increasing difficulty.',
        path: 'games/snake.html'
    },
    pong: {
        id: 'pong',
        name: 'Pong',
        description: 'Classic paddle game! Play against AI or a friend locally. First to 10 wins!',
        path: 'games/pong.html'
    },
    breakout: {
        id: 'breakout',
        name: 'Breakout',
        description: 'Break all the bricks! Collect power-ups and advance through levels in this classic arcade game.',
        path: 'games/breakout.html'
    },
    invaders: {
        id: 'invaders',
        name: 'Space Invaders',
        description: 'Defend Earth from waves of descending aliens. Destroy them all before they reach your planet!',
        path: 'games/invaders.html'
    },
    asteroids: {
        id: 'asteroids',
        name: 'Asteroids',
        description: 'Navigate your ship through space and destroy asteroids before they destroy you. Watch out for UFOs!',
        path: 'games/asteroids.html'
    }
};

/**
 * Initialize the homepage - render game cards
 */
function initHomepage() {
    const gamesGrid = document.getElementById('games-grid');

    if (!gamesGrid) {
        console.error('Games grid element not found');
        return;
    }

    // Clear any existing content
    gamesGrid.innerHTML = '';

    // Render each game as a card
    Object.values(gameRegistry).forEach(game => {
        const card = createGameCard(game);
        gamesGrid.appendChild(card);
    });
}

/**
 * Create a game card element
 * @param {Object} game - Game configuration object
 * @returns {HTMLElement} Game card element
 */
function createGameCard(game) {
    const card = document.createElement('article');
    card.className = 'game-card';

    const title = document.createElement('h2');
    title.textContent = game.name;

    const description = document.createElement('p');
    description.className = 'description';
    description.textContent = game.description;

    const playButton = document.createElement('a');
    playButton.href = game.path;
    playButton.className = 'play-button';
    playButton.textContent = 'Play Now';
    playButton.setAttribute('role', 'button');

    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(playButton);

    return card;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHomepage);
} else {
    initHomepage();
}
