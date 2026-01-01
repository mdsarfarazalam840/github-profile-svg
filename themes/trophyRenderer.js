/**
 * Render the Gamified Trophy SVG
 * @param {object} data User data with trophies
 * @param {object} options Theme options
 * @returns {string} SVG string
 */
function renderTrophySVG(data, options = {}) {
  const { username, standard, secret } = data;
  const { theme = 'dark', columns = 3, animation = 'on' } = options;

  // Theme Colors
  const isDark = theme !== 'light';
  const bg = isDark ? '#0d1117' : '#ffffff';
  const cardBg = isDark ? '#161b22' : '#f6f8fa';
  const textTitle = isDark ? '#c9d1d9' : '#24292f';
  const textSub = isDark ? '#8b949e' : '#57606a';

  // Tier Colors
  const TIER_COLORS = {
    LEGENDARY: { stroke: ['#d700ff', '#ff0055'], bg: '#ff005510' },
    GOLD: { stroke: ['#ffb300', '#ffd700'], bg: '#ffb30010' },
    SILVER: { stroke: ['#c0c0c0', '#e0e0e0'], bg: '#c0c0c010' },
    BRONZE: { stroke: ['#8d6e63', '#a1887f'], bg: '#8d6e6310' }
  };

  const cardW = 155;
  const cardH = 185;
  const gap = 15;
  const headerHeight = 90;

  let displayItems = [...standard, ...secret];

  const numCols = Math.min(Math.max(parseInt(columns) || 3, 1), 6);
  const numRows = Math.ceil(displayItems.length / numCols);
  const totalW = numCols * (cardW + gap) + gap;
  const totalH = numRows * (cardH + gap) + headerHeight + 20;

  let content = '';

  displayItems.forEach((t, i) => {
    const col = i % numCols;
    const row = Math.floor(i / numCols);
    const x = gap + col * (cardW + gap);
    const y = headerHeight + row * (cardH + gap);

    const colors = TIER_COLORS[t.tier] || TIER_COLORS.BRONZE;
    const gradId = `grad_${t.id}_${i}`;

    // Animation Logic
    const animDelay = i * 100;
    const animClass = animation === 'on' ? 'fade-up' : '';
    const glow = (t.tier === 'LEGENDARY' || t.tier === 'GOLD') && animation === 'on'
      ? `filter: drop-shadow(0 0 5px ${colors.stroke[0]}aa);`
      : '';

    // Progress Bar
    let progressBar = '';
    if (t.max) {
      const pct = Math.min((t.value / t.max) * 100, 100);
      progressBar = `
        <rect x="${cardW / 2 - 50}" y="148" width="100" height="6" rx="3" fill="${isDark ? '#30363d' : '#e1e4e8'}"/>
        <rect x="${cardW / 2 - 50}" y="148" width="${pct}" height="6" rx="3" fill="url(#${gradId})"/>
      `;
    }

    content += `
      <!-- Nested group fix: outer handles position, inner handles animation -->
      <g transform="translate(${x}, ${y})">
        <g class="${animClass}" style="animation-delay: ${animDelay}ms;">
          <!-- Card Background -->
          <rect width="${cardW}" height="${cardH}" rx="14" fill="${cardBg}" stroke="${isDark ? '#30363d' : '#d0d7de'}" stroke-width="1.2"/>
          
          <!-- Tier Frame -->
          <rect width="${cardW}" height="${cardH}" rx="14" fill="none" stroke="url(#${gradId})" stroke-width="${t.tier === 'LEGENDARY' ? 2.5 : 1.5}" opacity="${t.tier === 'BRONZE' ? 0.4 : 1}" style="${glow}"/>

          <defs>
              <linearGradient id="${gradId}" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="${colors.stroke[0]}"/>
                  <stop offset="100%" stop-color="${colors.stroke[1]}"/>
              </linearGradient>
          </defs>

          <!-- Icon Section -->
          <circle cx="${cardW / 2}" cy="58" r="36" fill="${colors.bg}" />
          <text x="${cardW / 2}" y="72" text-anchor="middle" font-size="42">${t.icon}</text>

          <!-- Title & Tier -->
          <text x="${cardW / 2}" y="115" text-anchor="middle" font-family="Segoe UI, Ubuntu, sans-serif" font-weight="700" font-size="14" fill="${textTitle}">${t.title}</text>
          <text x="${cardW / 2}" y="132" text-anchor="middle" font-family="Segoe UI, Ubuntu, sans-serif" font-weight="600" font-size="11" fill="url(#${gradId})">${t.tier}</text>

          <!-- Progress -->
          ${progressBar}
          <text x="${cardW / 2}" y="166" text-anchor="middle" font-family="Segoe UI, Ubuntu, sans-serif" font-size="11" fill="${textSub}">
             ${t.value >= 1000 ? (t.value / 1000).toFixed(1) + 'k' : t.value} ${t.unit ? t.unit : ''}
          </text>
        </g>
      </g>
    `;
  });

  return `
    <svg width="${totalW}" height="${totalH}" viewBox="0 0 ${totalW} ${totalH}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
           @import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;700&amp;display=swap');
           .fade-up { opacity: 0; animation: fadeUpAnim 0.6s ease-out forwards; }
           @keyframes fadeUpAnim { 
             from { opacity: 0; transform: translateY(15px); } 
             to { opacity: 1; transform: translateY(0); } 
           }
        </style>
      </defs>
      
      <rect width="100%" height="100%" rx="24" fill="${bg}"/>
      
      <!-- Header Section -->
      <g transform="translate(${gap + 5}, 50)">
        <text x="0" y="0" font-family="Segoe UI, Ubuntu, sans-serif" font-weight="800" font-size="24" fill="${textTitle}">
          ${username}'s Achievements
        </text>
        <text x="0" y="24" font-family="Segoe UI, Ubuntu, sans-serif" font-size="15" fill="${textSub}">
          Level ${data.standard.filter(t => t.tier === 'LEGENDARY' || t.tier === 'GOLD').length * 10 + 1} • ${displayItems.length} Trophies Unlocked
        </text>
      </g>

      ${content}
    </svg>
  `.trim();
}

function renderErrorSVG(message) {
  return `
    <svg width="450" height="100" viewBox="0 0 450 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" rx="16" fill="#0d1117" stroke="#ff0055" stroke-width="2"/>
      <text x="225" y="55" text-anchor="middle" font-family="Segoe UI" fill="#ff0055" font-weight="bold" font-size="16">⚠️ Error: ${message}</text>
    </svg>
  `;
}

module.exports = { renderTrophySVG, renderErrorSVG };
