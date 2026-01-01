/**
 * Render the Trophy Grid SVG
 * @param {object} data User data with achievements
 * @param {object} options Theme and layout options
 * @returns {string} SVG string
 */
function renderTrophySVG(data, options = {}) {
    const { username, achievements } = data;
    const { theme = 'dark', columns = 3 } = options;

    const isDark = theme === 'dark';
    const bgColor = isDark ? '#0d1117' : '#ffffff';
    const strokeColor = isDark ? '#30363d' : '#d0d7de';
    const textColor = isDark ? '#c9d1d9' : '#24292f';
    const labelColor = isDark ? '#58a6ff' : '#0969da';

    const cardWidth = 130;
    const cardHeight = 150;
    const gap = 10;

    const numCols = parseInt(columns) || 3;
    const numRows = Math.ceil(achievements.length / numCols);

    const totalWidth = numCols * (cardWidth + gap) + gap;
    const totalHeight = numRows * (cardHeight + gap) + 60; // Extra space for header

    let trophiesHtml = '';

    achievements.forEach((trophy, index) => {
        const col = index % numCols;
        const row = Math.floor(index / numCols);

        const x = gap + col * (cardWidth + gap);
        const y = 50 + row * (cardHeight + gap);

        trophiesHtml += `
      <g transform="translate(${x}, ${y})">
        <rect width="${cardWidth}" height="${cardHeight}" rx="10" fill="${bgColor}" stroke="${strokeColor}" stroke-width="1"/>
        <text x="50%" y="60" text-anchor="middle" font-size="40">${trophy.icon}</text>
        <text x="50%" y="110" text-anchor="middle" font-family="Segoe UI, Ubuntu, sans-serif" font-weight="600" font-size="12" fill="${labelColor}">${trophy.label}</text>
        <text x="50%" y="130" text-anchor="middle" font-family="Segoe UI, Ubuntu, sans-serif" font-size="10" fill="${textColor}" opacity="0.6">Achievement</text>
      </g>
    `;
    });

    return `
    <svg width="${totalWidth}" height="${totalHeight}" viewBox="0 0 ${totalWidth} ${totalHeight}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>
        .header { font: 600 16px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${textColor}; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .trophy-card { animation: fadeIn 0.5s ease-in-out forwards; }
      </style>
      
      <rect width="100%" height="100%" rx="15" fill="${bgColor}"/>
      <text x="${gap}" y="30" class="header">${username}'s GitHub Trophies</text>
      
      ${trophiesHtml}
    </svg>
  `.trim();
}

/**
 * Render Error SVG
 * @param {string} message 
 * @returns {string} SVG string
 */
function renderErrorSVG(message) {
    return `
    <svg width="400" height="100" viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" rx="10" fill="#fff5f5" stroke="#feb2b2"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Segoe UI, Ubuntu, Sans-Serif" font-size="14" fill="#c53030">
        ❌ Error: ${message}
      </text>
    </svg>
  `.trim();
}

module.exports = { renderTrophySVG, renderErrorSVG };
