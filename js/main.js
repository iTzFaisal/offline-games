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
    }
    // Add more games here in the future
    // Example:
    // snake: {
    //     id: 'snake',
    //     name: 'Snake',
    //     description: 'Guide the snake to eat food and grow longer.',
    //     path: 'games/snake.html'
    // }
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
