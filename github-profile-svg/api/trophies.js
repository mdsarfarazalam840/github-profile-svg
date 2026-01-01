const { fetchTrophyData } = require('../utils/github');
const { renderTrophySVG, renderErrorSVG } = require('../themes/trophyRenderer');

module.exports = async (req, res) => {
    const { username, theme = 'dark', columns = 3 } = req.query;

    // Set the correct content type for SVG
    res.setHeader('Content-Type', 'image/svg+xml');

    if (!username) {
        return res.status(400).send(renderErrorSVG('Username is required'));
    }

    try {
        const data = await fetchTrophyData(username.toLowerCase());

        // Check if user has any trophies
        if (data.achievements.length === 0) {
            return res.status(200).send(renderErrorSVG(`No trophies earned yet for ${username}`));
        }

        const svg = renderTrophySVG(data, { theme, columns });

        // Cache the response for 24 hours
        res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=3600');

        return res.status(200).send(svg);

    } catch (error) {
        console.error('Error in trophies API:', error.message);
        const status = error.message === 'User not found' ? 404 :
            error.message === 'Rate limit exceeded' ? 403 : 500;

        return res.status(status).send(renderErrorSVG(error.message));
    }
};
