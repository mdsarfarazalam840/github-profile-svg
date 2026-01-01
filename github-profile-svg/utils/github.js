const axios = require('axios');

/**
 * Trophy definitions and criteria
 */
const TROPHY_LIST = [
    { id: 'first_repo', label: 'First Repo', icon: '🏆', criteria: (user) => user.public_repos >= 1 },
    { id: 'repo_builder', label: 'Repo Builder', icon: '📦', criteria: (user) => user.public_repos >= 10 },
    { id: 'os_addict', label: 'OS Addict', icon: '🔥', criteria: (user) => user.public_repos >= 30 },
    { id: 'rising_dev', label: 'Rising Dev', icon: '⭐', criteria: (user) => user.followers >= 10 },
    { id: 'popular_dev', label: 'Popular Dev', icon: '🌟', criteria: (user) => user.followers >= 50 },
    { id: 'community_leader', label: 'Leader', icon: '👑', criteria: (user) => user.followers >= 100 },
    { id: 'networker', label: 'Networker', icon: '🤝', criteria: (user) => user.following >= 50 },
];

/**
 * Fetch GitHub user data and determine achievements
 * @param {string} username 
 * @returns {Promise<object>} User data and achievements
 */
async function fetchTrophyData(username) {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const headers = {
        'User-Agent': 'github-trophy-generator',
        'Accept': 'application/vnd.github.v3+json'
    };

    if (GITHUB_TOKEN) {
        headers['Authorization'] = `token ${GITHUB_TOKEN}`;
    }

    try {
        const response = await axios.get(`https://api.github.com/users/${username}`, { headers });
        const user = response.data;

        // Filter trophies based on criteria
        const achievements = TROPHY_LIST.filter(t => t.criteria(user)).map(t => ({
            label: t.label,
            icon: t.icon
        }));

        return {
            success: true,
            username: user.login,
            achievements: achievements
        };
    } catch (error) {
        if (error.response && error.response.status === 404) {
            throw new Error('User not found');
        }
        if (error.response && error.response.status === 403) {
            throw new Error('Rate limit exceeded');
        }
        throw new Error('Failed to fetch user data');
    }
}

module.exports = { fetchTrophyData };
