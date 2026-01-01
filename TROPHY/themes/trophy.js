/**
 * Trophy (Gold) theme SVG template
 * @param {object} data User data
 * @param {string} title Optional title
 * @param {string} rank Calculated rank
 * @returns {string} SVG string
 */
function renderTrophyTheme(data, title, rank) {
    const { displayName, followers } = data;
    const cardTitle = title || `${displayName}'s Achievement`;

    // Determine gold vs silver vs bronze based on rank
    let mainColor = '#ffb300'; // Gold (Default for S/A)
    if (rank.startsWith('S')) mainColor = '#ffb300';
    else if (rank.startsWith('A')) mainColor = '#7986cb'; // Blue/Silver
    else mainColor = '#8d6e63'; // Bronze

    return `
    <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>
        .title { font: 600 14px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${mainColor}; text-transform: uppercase; }
        .rank { font: 800 60px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${mainColor}; filter: drop-shadow(0 0 5px rgba(255,179,0,0.4)); }
        .score { font: 400 12px 'Segoe UI', Ubuntu, Sans-Serif; fill: #8b949e; }
        
        @keyframes shine {
          0% { transform: translateX(-100%) rotate(45deg); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateX(100%) rotate(45deg); opacity: 0; }
        }
        .shine-effect { animation: shine 3s infinite; }
      </style>

      <rect width="200" height="200" rx="20" fill="#0d1117" stroke="${mainColor}" stroke-width="2"/>
      <rect width="200" height="200" rx="20" fill="url(#grad)" opacity="0.1"/>

      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${mainColor}" />
          <stop offset="100%" stop-color="#000" />
        </linearGradient>
      </defs>

      <!-- Laurel Wreath Circle -->
      <circle cx="100" cy="100" r="70" stroke="${mainColor}" stroke-width="1" stroke-dasharray="8 4" opacity="0.3"/>
      
      <text x="50%" y="35" text-anchor="middle" class="title">${cardTitle}</text>
      
      <text x="50%" y="115" text-anchor="middle" class="rank">${rank}</text>
      
      <text x="50%" y="165" text-anchor="middle" class="score">${followers} Followers</text>
      
      <!-- Icon/Symbol -->
      <path d="M100 145 L110 155 L90 155 Z" fill="${mainColor}" />
    </svg>
  `.trim();
}

module.exports = renderTrophyTheme;
