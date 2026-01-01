const axios = require('axios');

/**
 * Tier Definitions
 */
const TIERS = {
    LEGENDARY: { label: 'LEGENDARY', color: ['#d700ff', '#ff0055'] }, // Neon Pink/Purple
    GOLD: { label: 'GOLD', color: ['#ffb300', '#ffd700'] }, // Gold
    SILVER: { label: 'SILVER', color: ['#c0c0c0', '#e0e0e0'] }, // Silver
    BRONZE: { label: 'BRONZE', color: ['#cd7f32', '#a0522d'] }, // Bronze
};

/**
 * Calculate Tier Helper
 */
function getTier(value, thresholds) {
    if (value >= thresholds.LEGENDARY) return 'LEGENDARY';
    if (value >= thresholds.GOLD) return 'GOLD';
    if (value >= thresholds.SILVER) return 'SILVER';
    return 'BRONZE';
}

/**
 * Fetch detailed stats (Stars, Issues, PRs)
 */
async function fetchDetailedStats(username, headers) {
    try {
        const [reposRes, prsRes, issuesRes] = await Promise.allSettled([
            axios.get(`https://api.github.com/users/${username}/repos?per_page=100`, { headers }),
            axios.get(`https://api.github.com/search/issues?q=author:${username}+type:pr`, { headers }),
            axios.get(`https://api.github.com/search/issues?q=author:${username}+type:issue`, { headers })
        ]);

        let stars = 0;
        if (reposRes.status === 'fulfilled') {
            stars = reposRes.value.data.reduce((acc, repo) => acc + repo.stargazers_count, 0);
        }

        const prs = prsRes.status === 'fulfilled' ? prsRes.value.data.total_count : 0;
        const issues = issuesRes.status === 'fulfilled' ? issuesRes.value.data.total_count : 0;

        return { stars, prs, issues };
    } catch (e) {
        return { stars: 0, prs: 0, issues: 0 };
    }
}

/**
 * Fetch GitHub user data and determine achievements
 */
async function fetchTrophyData(username) {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const headers = { 'User-Agent': 'github-trophy-generator' };
    if (GITHUB_TOKEN) headers['Authorization'] = `token ${GITHUB_TOKEN}`;

    try {
        const response = await axios.get(`https://api.github.com/users/${username}`, { headers });
        const user = response.data;
        const { stars, prs, issues } = await fetchDetailedStats(username, headers);

        const accountAgeDays = (new Date() - new Date(user.created_at)) / (1000 * 60 * 60 * 24);
        const accountAgeYears = Math.floor(accountAgeDays / 365);

        // 1. Standard Progression Trophies
        const standardTrophies = [
            {
                id: 'stars',
                category: 'Stars',
                title: 'Star Magnet',
                icon: '🌟',
                value: stars,
                unit: 'Stars',
                tier: getTier(stars, { LEGENDARY: 1000, GOLD: 500, SILVER: 100 }),
                max: 1000 // For progress bar logic if needed
            },
            {
                id: 'followers',
                category: 'Community',
                title: 'Influencer',
                icon: '👥',
                value: user.followers,
                unit: 'Followers',
                tier: getTier(user.followers, { LEGENDARY: 1000, GOLD: 500, SILVER: 100 }),
                max: 1000
            },
            {
                id: 'repos',
                category: 'Repositories',
                title: 'Repo Titan',
                icon: '📦',
                value: user.public_repos,
                unit: 'Repos',
                tier: getTier(user.public_repos, { LEGENDARY: 200, GOLD: 100, SILVER: 30 }),
                max: 200
            },
            {
                id: 'prs',
                category: 'Pull Requests',
                title: 'Open Sourcer',
                icon: '🔧',
                value: prs,
                unit: 'PRs',
                tier: getTier(prs, { LEGENDARY: 500, GOLD: 200, SILVER: 50 }),
                max: 500
            },
            {
                id: 'issues',
                category: 'Issues',
                title: 'Bug Hunter',
                icon: '🐞',
                value: issues,
                unit: 'Issues',
                tier: getTier(issues, { LEGENDARY: 500, GOLD: 200, SILVER: 50 }),
                max: 500
            },
            {
                id: 'experience',
                category: 'Experience',
                title: 'Veteran',
                icon: '⏳',
                value: accountAgeYears,
                unit: 'Years',
                tier: getTier(accountAgeYears, { LEGENDARY: 10, GOLD: 5, SILVER: 2 }),
                max: 10
            }
        ];

        // 2. Secret Trophies (Unlock conditions)
        const secretTrophies = [];

        // Secret: Early Adopter (ID < 1000000 or Account > 10 years)
        if (user.id < 1000000 || accountAgeYears >= 10) {
            secretTrophies.push({
                id: 'early_adopter',
                category: 'Special',
                title: 'Early Adopter',
                icon: '🦕',
                description: 'Joined GitHub in the early days.',
                tier: 'LEGENDARY',
                unlocked: true
            });
        }

        // Secret: Lone Wolf (Many repos, few followers)
        if (user.public_repos >= 50 && user.followers < 10) {
            secretTrophies.push({
                id: 'lone_wolf',
                category: 'Play Style',
                title: 'Lone Wolf',
                icon: '🐺',
                description: 'Built a massive library alone.',
                tier: 'GOLD',
                unlocked: true
            });
        }

        // Secret: Popular Maintainer (High Ratio of Stars to Repos)
        if (stars > 500 && user.public_repos > 0 && (stars / user.public_repos) > 50) {
            secretTrophies.push({
                id: 'quality_first',
                category: 'Quality',
                title: 'Artisan',
                icon: '💎',
                description: 'High star-to-repo ratio.',
                tier: 'LEGENDARY',
                unlocked: true
            });
        }

        return {
            success: true,
            username: user.login,
            standard: standardTrophies,
            secret: secretTrophies
        };

    } catch (error) {
        if (error.response && error.response.status === 404) throw new Error('User not found');
        throw new Error('Failed to fetch stats');
    }
}

module.exports = { fetchTrophyData, TIERS };
