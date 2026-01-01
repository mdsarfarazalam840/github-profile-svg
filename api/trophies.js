const { fetchTrophyData } = require('../utils/github');
const { renderTrophySVG, renderErrorSVG } = require('../themes/trophyRenderer');

module.exports = async (req, res) => {
    const {
        username,
        theme = 'dark',
        animation = 'on',
        showLocked = 'true',
        showHidden = 'false'
    } = req.query;

    // Set Content-Type
    res.setHeader('Content-Type', 'image/svg+xml');

    // Disable Cache for dev verification, can be enabled for production
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    if (!username) {
        return res.status(400).send('<?xml version="1.0" encoding="UTF-8"?>' + renderErrorSVG('Username is required'));
    }

    try {
        const data = await fetchTrophyData(username.toLowerCase());

        const svg = renderTrophySVG(data, {
            theme,
            animation,
            showLocked,
            showHidden
        });

        return res.status(200).send('<?xml version="1.0" encoding="UTF-8"?>' + svg);

    } catch (error) {
        console.error('Error in trophies API:', error.message);
        const status = error.message === 'User not found' ? 404 :
            error.message === 'Rate limit exceeded' ? 403 : 500;

        return res.status(status).send('<?xml version="1.0" encoding="UTF-8"?>' + renderErrorSVG(error.message));
    }
};
