const { fetchUserData } = require('../utils/github');
const renderDarkTheme = require('../themes/dark');
const renderLightTheme = require('../themes/light');

const renderDraculaTheme = require('../themes/dracula');
const renderTrophyTheme = require('../themes/trophy');

/**
 * Error SVG template
 * @param {string} message 
 * @returns {string} SVG string
 */
function renderErrorSVG(message) {
    return `
    <svg width="450" height="150" viewBox="0 0 450 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0.5" y="0.5" width="449" height="149" rx="10" fill="#fff5f5" stroke="#feb2b2"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Segoe UI, Ubuntu, Sans-Serif" font-size="16" fill="#c53030">
        ❌ Error: ${message}
      </text>
    </svg>
  `.trim();
}

module.exports = async (req, res) => {
    const { username, theme = 'dark', title } = req.query;

    // Set default content type
    res.setHeader('Content-Type', 'image/svg+xml');

    if (!username) {
        return res.status(400).send(renderErrorSVG('Username is required'));
    }

    try {
        const userData = await fetchUserData(username.toLowerCase());

        let svg;
        if (theme === 'light') {
            svg = renderLightTheme(userData, title, userData.rank);
        } else if (theme === 'dracula') {
            svg = renderDraculaTheme(userData, title, userData.rank);
        } else if (theme === 'trophy') {
            svg = renderTrophyTheme(userData, title, userData.rank);
        } else {
            svg = renderDarkTheme(userData, title, userData.rank);
        }

        // Cache the response for 24 hours (86400 seconds)
        res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=3600');
        return res.status(200).send(svg);

    } catch (error) {
        console.error('Error in profile API:', error.message);
        let status = 500;
        if (error.message === 'User not found') status = 404;
        if (error.message === 'GitHub API rate limit exceeded') status = 403;

        return res.status(status).send(renderErrorSVG(error.message));
    }
};
