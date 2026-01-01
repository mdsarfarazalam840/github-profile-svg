const axios = require('axios');

/**
 * Calculate a rank based on followers and public repos
 * @param {number} followers 
 * @param {number} repos 
 * @returns {string} Rank
 */
function calculateRank(followers, repos) {
  const score = (followers * 2) + repos;
  if (score > 1000) return 'S+';
  if (score > 500) return 'S';
  if (score > 200) return 'A+';
  if (score > 100) return 'A';
  if (score > 50) return 'B+';
  if (score > 20) return 'B';
  return 'C';
}

/**
 * Fetch GitHub user data from the REST API
 * @param {string} username 
 * @returns {Promise<object>} User data or error object
 */
async function fetchUserData(username) {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const headers = {
    'User-Agent': 'github-profile-svg-generator',
    'Accept': 'application/vnd.github.v3+json'
  };

  if (GITHUB_TOKEN) {
    headers['Authorization'] = `token ${GITHUB_TOKEN}`;
  }

  try {
    const response = await axios.get(`https://api.github.com/users/${username}`, { headers });

    const { login, name, public_repos, followers, following, avatar_url } = response.data;

    return {
      success: true,
      username: login,
      displayName: name || login,
      publicRepos: public_repos,
      followers: followers,
      following: following,
      avatarUrl: avatar_url,
      rank: calculateRank(followers, public_repos)
    };
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error('User not found');
    }
    if (error.response && error.response.status === 403) {
      throw new Error('GitHub API rate limit exceeded');
    }
    throw new Error('Failed to fetch user data');
  }
}

module.exports = { fetchUserData };
