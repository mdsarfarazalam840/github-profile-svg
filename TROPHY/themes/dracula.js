/**
 * Dracula theme SVG template
 * @param {object} data User data
 * @param {string} title Optional title
 * @param {string} rank Calculated rank
 * @returns {string} SVG string
 */
function renderDraculaTheme(data, title, rank) {
    const { username, displayName, publicRepos, followers, following } = data;
    const cardTitle = title || `${displayName}'s GitHub Stats`;

    return `
    <svg width="450" height="165" viewBox="0 0 450 165" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>
        .header { font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif; fill: #ff79c6; animation: fadeIn 0.8s ease-in-out; }
        .stat { font: 400 14px 'Segoe UI', Ubuntu, Sans-Serif; fill: #f8f8f2; animation: fadeIn 1s ease-in-out; }
        .label { font: 600 14px 'Segoe UI', Ubuntu, Sans-Serif; fill: #bd93f9; animation: fadeIn 1s ease-in-out; }
        .rank-text { font: 800 48px 'Segoe UI', Ubuntu, Sans-Serif; fill: #ff79c6; animation: scaleIn 0.8s ease-in-out; }
        .rank-label { font: 600 12px 'Segoe UI', Ubuntu, Sans-Serif; fill: #6272a4; }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0); opacity: 0; transform-origin: center; }
          to { transform: scale(1); opacity: 1; transform-origin: center; }
        }
      </style>
      
      <rect x="0.5" y="0.5" width="449" height="164" rx="10" fill="#282a36" stroke="#44475a"/>
      
      <text x="25" y="35" class="header">${cardTitle}</text>
      
      <g transform="translate(25, 65)">
        <text x="0" y="0" class="label">👤 User:</text>
        <text x="130" y="0" class="stat">${username}</text>
        
        <text x="0" y="25" class="label">📦 Repos:</text>
        <text x="130" y="25" class="stat">${publicRepos}</text>
        
        <text x="0" y="50" class="label">🤝 Followers:</text>
        <text x="130" y="50" class="stat">${followers}</text>
        
        <text x="0" y="75" class="label">✨ Following:</text>
        <text x="130" y="75" class="stat">${following}</text>
      </g>

      <g transform="translate(350, 85)">
        <circle cx="0" cy="0" r="40" stroke="#6272a4" stroke-width="2" fill="none" opacity="0.2"/>
        <text x="0" y="12" text-anchor="middle" class="rank-text">${rank}</text>
        <text x="0" y="55" text-anchor="middle" class="rank-label">Rank</text>
      </g>
    </svg>
  `.trim();
}

module.exports = renderDraculaTheme;
