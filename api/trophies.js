const { fetchTrophyData } = require('../utils/github');
const { renderTrophySVG, renderErrorSVG } = require('../themes/trophyRenderer');

module.exports = async (req, res) => {
    const { username, theme = 'dark', columns = 3, animation = 'on', showLocked = 'true' } = req.query;

    // Set the correct content type for SVG
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=3600');

    if (!username) {
        return res.status(400).send('<?xml version="1.0" encoding="UTF-8"?>' + renderErrorSVG('Username is required'));
    }

    try {
        const data = await fetchTrophyData(username.toLowerCase());

        const svg = renderTrophySVG(data, { theme, columns, animation, showLocked });

        return res.status(200).send('<?xml version="1.0" encoding="UTF-8"?>' + svg);

    } catch (error) {
        console.error('Error in trophies API:', error.message);
        const status = error.message === 'User not found' ? 404 :
            error.message === 'Rate limit exceeded' ? 403 : 500;

        return res.status(status).send('<?xml version="1.0" encoding="UTF-8"?>' + renderErrorSVG(error.message));
    }
};
