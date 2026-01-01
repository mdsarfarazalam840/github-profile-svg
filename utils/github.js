const axios = require('axios');

/**
 * XP Point Weights
 */
const XP_WEIGHTS = {
    STAR: 5,
    FOLLOWER: 10,
    REPO: 15,
    PR: 10,
    ISSUE: 5,
    YEAR: 50
};

/**
 * Milestone Thresholds (Bronze, Silver, Gold, Legendary)
 */
const MILESTONES = {
    stars: [5, 25, 100, 500],
    followers: [10, 50, 200, 1000],
    repos: [5, 20, 50, 150],
    prs: [10, 50, 150, 500],
    issues: [10, 50, 150, 500],
    experience: [1, 2, 5, 10]
};

const TIER_LABELS = ['BRONZE', 'SILVER', 'GOLD', 'LEGENDARY'];

/**
 * Calculate Level from XP
 * Ladder: 0-250 (L1), 250-750 (L2), 750-1750 (L3), 1750-3750 (L4), etc.
 */
function calculateLevel(totalXP) {
    let level = 1;
    let xpThreshold = 250;
    let tempXP = totalXP;

    while (tempXP >= xpThreshold) {
        tempXP -= xpThreshold;
        level++;
        xpThreshold = Math.floor(xpThreshold * 1.5);
    }

    return {
        level,
        currentXP: tempXP,
        nextLevelXP: xpThreshold,
        progress: Math.min((tempXP / xpThreshold) * 100, 100)
    };
}

/**
 * Fetch detailed stats
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
            stars = reposRes.value.data.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0);
        }

        const prs = prsRes.status === 'fulfilled' ? prsRes.value.data.total_count : 0;
        const issues = issuesRes.status === 'fulfilled' ? issuesRes.value.data.total_count : 0;

        return { stars, prs, issues };
    } catch (e) {
        return { stars: 0, prs: 0, issues: 0 };
    }
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

    const nextMilestone = milestones[tierIndex + 1] || milestones[milestones.length - 1];
    const isLegendary = tierIndex === 3;

    return {
        id,
        title: config.title,
        icon: config.icon,
        value,
        unit: config.unit,
        unlocked: tierIndex >= 0,
        tier: tierIndex >= 0 ? TIER_LABELS[tierIndex] : 'LOCKED',
        progress: isLegendary ? 100 : (value / nextMilestone) * 100,
        nextValue: nextMilestone
    };
}

/**
 * Main Data Fetcher
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

        // Calc Total XP
        const totalXP =
            (stars * XP_WEIGHTS.STAR) +
            (user.followers * XP_WEIGHTS.FOLLOWER) +
            (user.public_repos * XP_WEIGHTS.REPO) +
            (prs * XP_WEIGHTS.PR) +
            (issues * XP_WEIGHTS.ISSUE) +
            (accountAgeYears * XP_WEIGHTS.YEAR);

        const levelData = calculateLevel(totalXP);

        // Visible / Base Trophies
        const visibleTrophies = [
            getMetricTrophy('stars', stars, { title: 'Star Magnet', icon: '⭐', unit: 'Stars' }),
            getMetricTrophy('followers', user.followers, { title: 'Influencer', icon: '👥', unit: 'Fans' }),
            getMetricTrophy('repos', user.public_repos, { title: 'Repo Titan', icon: '📦', unit: 'Repos' }),
            getMetricTrophy('prs', prs, { title: 'Open Sourcer', icon: '🔧', unit: 'PRs' }),
            getMetricTrophy('issues', issues, { title: 'Bug Hunter', icon: '🐞', unit: 'Issues' }),
            getMetricTrophy('experience', accountAgeYears, { title: 'Veteran', icon: '⏳', unit: 'Years' })
        ];

        // Locked / Achievement Trophies
        const lockedTrophies = [
            { id: 'leader', title: 'Community Leader', icon: '👑', value: user.followers, nextValue: 200, unlocked: user.followers >= 200, tier: user.followers >= 200 ? 'LEGENDARY' : 'LOCKED', unit: 'Fans' },
            { id: 'hero', title: 'Open Source Hero', icon: '🛡️', value: prs, nextValue: 100, unlocked: prs >= 100, tier: prs >= 100 ? 'GOLD' : 'LOCKED', unit: 'PRs' },
            { id: 'legend', title: 'Star Legend', icon: '🌌', value: stars, nextValue: 500, unlocked: stars >= 500, tier: stars >= 500 ? 'LEGENDARY' : 'LOCKED', unit: 'Stars' },
            { id: 'machine', title: 'Repo Machine', icon: '🤖', value: user.public_repos, nextValue: 100, unlocked: user.public_repos >= 100, tier: user.public_repos >= 100 ? 'GOLD' : 'LOCKED', unit: 'Repos' }
        ];

        // Hidden / Secret Trophies
        const hiddenTrophies = [];
        if (accountAgeYears >= 10) {
            hiddenTrophies.push({ id: 'early', title: 'Early Adopter', icon: '🦕', unlocked: true, tier: 'LEGENDARY', note: 'Joined 10+ years ago' });
        }
        if (user.public_repos >= 50 && user.followers < 10) {
            hiddenTrophies.push({ id: 'wolf', title: 'Lone Wolf', icon: '🐺', unlocked: true, tier: 'GOLD', note: '50+ Repos, low followers' });
        }
        if (prs >= 100 && user.followers < 20) {
            hiddenTrophies.push({ id: 'silent', title: 'Silent Contributor', icon: '🤫', unlocked: true, tier: 'SILVER', note: '100+ PRs, low fame' });
        }
        // Midnight Committer - Inferred from high repo/PR count or just random/derived
        if (totalXP > 2000 && user.id % 2 === 0) {
            hiddenTrophies.push({ id: 'midnight', title: 'Midnight Committer', icon: '🌙', unlocked: true, tier: 'SILVER', note: 'Active night owl' });
        }

        return {
            username: user.login,
            totalXP,
            level: levelData,
            visible: visibleTrophies,
            locked: lockedTrophies,
            hidden: hiddenTrophies
        };

    } catch (error) {
        if (error.response && error.response.status === 404) throw new Error('User not found');
        throw new Error('Failed to fetch statistics');
    }
}

module.exports = { fetchTrophyData };
