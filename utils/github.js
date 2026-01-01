const axios = require('axios');

/**
 * Metric Names & Trophy Names mapping based on image references
 */
const TROPHY_TITLES = {
    stars: ['Beginner Stargazer', 'Stargazer', 'Master Stargazer', 'God Stargazer'],
    followers: ['New User', 'Dynamic User', 'Famous User', 'Community Idol'],
    repos: ['Repo Creator', 'Middle Repo Creator', 'Hyper Repo Creator', 'Repo Titan'],
    prs: ['First PR', 'PR User', 'PR Hunter', 'PR Master'],
    issues: ['First Issue', 'Issuer', 'High Issuer', 'Bug Slayer'],
    experience: ['Newcomer', 'Developer', 'Veteran', 'OG Developer']
};

/**
 * Milestone Thresholds (Beginner friendly)
 */
const MILESTONES = {
    stars: [1, 20, 100, 500],
    followers: [1, 15, 60, 250],
    repos: [1, 10, 30, 100],
    prs: [1, 10, 50, 200],
    issues: [1, 10, 50, 200],
    experience: [0, 1, 3, 5]
};

const TIER_LABELS = ['BRONZE', 'SILVER', 'GOLD', 'LEGENDARY'];
const RANK_LABELS = ['C', 'B', 'A', 'S', 'SSS']; // Indices mapped based on performance

/**
 * Level logic (Simplified)
 */
function calculateLevel(totalXP) {
    let level = 1;
    let xpThreshold = 100;
    let tempXP = totalXP;
    while (tempXP >= xpThreshold) {
        tempXP -= xpThreshold;
        level++;
        xpThreshold = Math.floor(xpThreshold * 1.5);
    }
    return { level, progress: (tempXP / xpThreshold) * 100 };
}

/**
 * Get Trophy Data for a specific metric
 */
function getMetricTrophy(id, value, config) {
    const milestones = MILESTONES[id];
    let tierIndex = -1;
    for (let i = 0; i < milestones.length; i++) {
        if (value >= milestones[i]) tierIndex = i;
    }

    const isUnlocked = tierIndex >= 0;
    const currentTier = isUnlocked ? TIER_LABELS[tierIndex] : 'LOCKED';
    const currentRank = isUnlocked ? RANK_LABELS[tierIndex + 1] : RANK_LABELS[0];
    const title = isUnlocked ? TROPHY_TITLES[id][tierIndex] : 'Locked';

    const nextMilestone = milestones[tierIndex + 1] || milestones[milestones.length - 1];

    return {
        id: config.label || id,
        title,
        icon: config.icon,
        value,
        unit: 'pt',
        unlocked: isUnlocked,
        tier: currentTier,
        label: currentRank,
        progress: (value / nextMilestone) * 100
    };
}

async function fetchDetailedStats(username, headers) {
    try {
        const [reposRes, prsRes, issuesRes] = await Promise.allSettled([
            axios.get(`https://api.github.com/users/${username}/repos?per_page=100`, { headers }),
            axios.get(`https://api.github.com/search/issues?q=author:${username}+type:pr`, { headers }),
            axios.get(`https://api.github.com/search/issues?q=author:${username}+type:issue`, { headers })
        ]);
        let stars = 0;
        if (reposRes.status === 'fulfilled') {
            stars = reposRes.value.data.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0);
        }
        const prs = prsRes.status === 'fulfilled' ? prsRes.value.data.total_count : 0;
        const issues = issuesRes.status === 'fulfilled' ? issuesRes.value.data.total_count : 0;
        return { stars, prs, issues };
    } catch (e) {
        return { stars: 0, prs: 0, issues: 0 };
    }
}

async function fetchTrophyData(username) {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const headers = { 'User-Agent': 'github-trophy-generator' };
    if (GITHUB_TOKEN) headers['Authorization'] = `token ${GITHUB_TOKEN}`;

    try {
        const response = await axios.get(`https://api.github.com/users/${username}`, { headers });
        const user = response.data;
        const { stars, prs, issues } = await fetchDetailedStats(username, headers);
        const accountAgeYears = Math.floor((new Date() - new Date(user.created_at)) / (1000 * 60 * 60 * 24 * 365));

        const trophies = [
            getMetricTrophy('stars', stars, { label: 'Stars' }),
            getMetricTrophy('repos', user.public_repos, { label: 'Repos' }),
            getMetricTrophy('followers', user.followers, { label: 'Followers' }),
            getMetricTrophy('issues', issues, { label: 'Issues' }),
            getMetricTrophy('prs', prs, { label: 'PR' }),
            getMetricTrophy('experience', accountAgeYears, { label: 'Years' })
        ];

        return {
            username: user.login,
            visible: trophies,
            hidden: []
        };
    } catch (error) {
        if (error.response?.status === 404) throw new Error('User not found');
        if (error.response?.status === 403) throw new Error('Rate limit exceeded');
        throw new Error('Failed to fetch stats');
    }
}

module.exports = { fetchTrophyData };
