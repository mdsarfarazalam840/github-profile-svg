/**
 * Render the Gamified Trophy SVG
 * @param {object} data User data with trophies
 * @param {object} options Theme options
 * @returns {string} SVG string
 */
function renderTrophySVG(data, options = {}) {
  const { username, standard, secret } = data;
  const { theme = 'dark', columns = 3, showLocked = 'true', animation = 'on' } = options;

  // Theme Colors
  const isDark = theme !== 'light';
  const bg = isDark ? '#0d1117' : '#ffffff';
  const cardBg = isDark ? '#161b22' : '#f6f8fa';
  const textTitle = isDark ? '#c9d1d9' : '#24292f';
  const textSub = isDark ? '#8b949e' : '#57606a';
  const strokeColor = isDark ? '#30363d' : '#d0d7de';

  // Tier Colors
  const TIER_COLORS = {
    LEGENDARY: { stroke: ['#d700ff', '#ff0055'], bg: '#ff005510' },
    GOLD: { stroke: ['#ffb300', '#ffd700'], bg: '#ffb30010' },
    SILVER: { stroke: ['#c0c0c0', '#e0e0e0'], bg: '#c0c0c010' },
    BRONZE: { stroke: ['#8d6e63', '#a1887f'], bg: '#8d6e6310' }
  };

  const cardW = 150;
  const cardH = 170;
  const gap = 15;
  const headerHeight = 70;

  // 1. Process Display List
  // Combine stats and secrets if applicable. For this layout, we treat standard trophies with progression bars.
  // Locked logic: If showLocked=false, we might hide unachieved milestones, but standard trophies are always "achieved" just at different tiers.
  // Wait, standard trophies are basically stats. They are always "unlocked" but the Tier changes.

  // Let's create a display list.
  let displayItems = [...standard, ...secret];

  const numCols = Math.min(Math.max(parseInt(columns) || 3, 1), 6);
  const numRows = Math.ceil(displayItems.length / numCols);
  const totalW = numCols * (cardW + gap) + gap;
  const totalH = numRows * (cardHeight + gap) + headerHeight + 30;

  let content = '';

  displayItems.forEach((t, i) => {
    const col = i % numCols;
    const row = Math.floor(i / numCols);
    const x = gap + col * (cardW + gap);
    const y = headerHeight + row * (cardHeight + gap);

    const isSecret = t.tier === 'LEGENDARY' && t.category === 'Special';
    const colors = TIER_COLORS[t.tier] || TIER_COLORS.BRONZE;
    const gradId = `grad_${t.id}_${i}`;

    // Animation Logic
    const animDelay = i * 150;
    const animStyle = animation === 'on'
      ? `opacity: 0; animation: fadeUp 0.6s ease-out forwards ${animDelay}ms;`
      : '';

    // Glow/Pulse for High Tiers
    const glow = (t.tier === 'LEGENDARY' || t.tier === 'GOLD') && animation === 'on'
      ? `filter: drop-shadow(0 0 4px ${colors.stroke[0]}80);`
      : '';

    // Progress Bar (for standard trophies only)
    let progressBar = '';
    if (t.max) {
      const pct = Math.min((t.value / t.max) * 100, 100);
      progressBar = `
        <rect x="${cardW / 2 - 50}" y="145" width="100" height="6" rx="3" fill="${isDark ? '#30363d' : '#e1e4e8'}"/>
        <rect x="${cardW / 2 - 50}" y="145" width="${pct}" height="6" rx="3" fill="url(#${gradId})"/>
      `;
    }

    content += `
      <g transform="translate(${x}, ${y})" style="${animStyle}">
        <!-- Card Background -->
        <rect width="${cardW}" height="${cardH}" rx="12" fill="${cardBg}" stroke="${isDark ? '#30363d' : '#d0d7de'}" stroke-width="1"/>
        
        <!-- Tier Frame (if High Tier) -->
        <rect width="${cardW}" height="${cardH}" rx="12" fill="none" stroke="url(#${gradId})" stroke-width="${t.tier === 'LEGENDARY' ? 2 : 1.5}" opacity="${t.tier === 'BRONZE' ? 0.3 : 1}" style="${glow}"/>

        <!-- Gradient Def -->
        <defs>
            <linearGradient id="${gradId}" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="${colors.stroke[0]}"/>
                <stop offset="100%" stop-color="${colors.stroke[1]}"/>
            </linearGradient>
        </defs>

        <!-- Icon Circle -->
        <circle cx="${cardW / 2}" cy="55" r="35" fill="${colors.bg}" />
        <text x="${cardW / 2}" y="67" text-anchor="middle" font-size="40">${t.icon}</text>

        <!-- Title & Tier -->
        <text x="${cardW / 2}" y="110" text-anchor="middle" font-family="Segoe UI, Ubuntu, sans-serif" font-weight="700" font-size="13" fill="${textTitle}">
            ${t.title}
        </text>
        <text x="${cardW / 2}" y="128" text-anchor="middle" font-family="Segoe UI, Ubuntu, sans-serif" font-weight="600" font-size="10" fill="url(#${gradId})">
            ${t.tier}
        </text>

        <!-- Progress / Value -->
        ${progressBar}
        <text x="${cardW / 2}" y="162" text-anchor="middle" font-family="Segoe UI, Ubuntu, sans-serif" font-size="10" fill="${textSub}">
           ${t.value >= 1000 ? (t.value / 1000).toFixed(1) + 'k' : t.value} ${t.unit ? t.unit : ''}
        </text>
      </g>
    `;
  });

  return `
    <svg width="${totalW}" height="${totalH}" viewBox="0 0 ${totalW} ${totalH}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
           @import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;700&amp;display=swap');
           @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } from { opacity: 0; transform: translateY(10px); } }
        </style>
      </defs>
      
      <rect width="100%" height="100%" rx="20" fill="${bg}"/>
      
      <!-- Header -->
      <g transform="translate(${gap}, 40)">
        <text x="0" y="0" font-family="Segoe UI, Ubuntu, sans-serif" font-weight="800" font-size="22" fill="${textTitle}">
          ${username}'s Achievements
        </text>
        <text x="0" y="22" font-family="Segoe UI, Ubuntu, sans-serif" font-size="14" fill="${textSub}">
          Level ${data.standard.filter(t => t.tier === 'LEGENDARY' || t.tier === 'GOLD').length * 10 + 1} • ${displayItems.length} Trophies Unlocked
        </text>
      </g>

      ${content}
    </svg>
  `.trim();
}

function renderErrorSVG(message) {
  return `
    <svg width="400" height="80" viewBox="0 0 400 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" rx="10" fill="#0d1117" stroke="#ff0055" stroke-width="2"/>
      <text x="200" y="45" text-anchor="middle" font-family="Segoe UI" fill="#ff0055" font-weight="bold">${message}</text>
    </svg>
  `;
}

module.exports = { renderTrophySVG, renderErrorSVG };
