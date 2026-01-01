/**
 * Render the Legacy Achievement System SVG
 */
function renderTrophySVG(data, options = {}) {
  const { username, totalXP, level, visible, locked, hidden } = data;
  const {
    theme = 'dark',
    animation = 'on',
    showLocked = 'true',
    showHidden = 'false'
  } = options;

  const isDark = theme !== 'light';
  const bg = isDark ? '#0d1117' : '#ffffff';
  const cardBg = isDark ? '#161b22' : '#f6f8fa';
  const textTitle = isDark ? '#c9d1d9' : '#24292f';
  const textSub = isDark ? '#8b949e' : '#57606a';
  const strokeColor = isDark ? '#30363d' : '#d0d7de';

  const TIER_STYLES = {
    LEGENDARY: { stroke: ['#d700ff', '#ff0055'], bg: '#ff005510', glow: '#ff0055aa' },
    GOLD: { stroke: ['#ffb300', '#ffd700'], bg: '#ffb30010', glow: '#ffb300aa' },
    SILVER: { stroke: ['#8c8c8c', '#e0e0e0'], bg: '#8c8c8c10', glow: '#8c8c8caa' },
    BRONZE: { stroke: ['#cd7f32', '#8d6e63'], bg: '#cd7f3210', glow: '#cd7f32aa' },
    LOCKED: { stroke: ['#30363d', '#30363d'], bg: 'transparent', glow: 'transparent' }
  };

  const cardW = 160;
  const cardH = 190;
  const gap = 15;
  const headerHeight = 110;

  // 1. Filter items based on flags
  let displayItems = [...visible];
  if (showLocked === 'true') displayItems.push(...locked);
  if (showHidden === 'true' || hidden.length > 0) displayItems.push(...hidden);

  const numCols = 3; // Fixed for clean look
  const numRows = Math.ceil(displayItems.length / numCols);
  const totalW = numCols * (cardW + gap) + gap;
  const totalH = headerHeight + numRows * (cardH + gap) + 50;

  let content = '';

  displayItems.forEach((t, i) => {
    const col = i % numCols;
    const row = Math.floor(i / numCols);
    const x = gap + col * (cardW + gap);
    const y = headerHeight + row * (cardH + gap);

    const style = TIER_STYLES[t.tier] || TIER_STYLES.LOCKED;
    const gradId = `grad_${t.id}_${i}`;
    const animDelay = (i * 100) + 500; // Delay cards start after XP bar
    const isLocked = t.tier === 'LOCKED';

    // Progress bar for trophies
    let progressBar = '';
    const progress = t.progress !== undefined ? t.progress : (t.unlocked ? 100 : 0);
    progressBar = `
      <rect x="${cardW / 2 - 50}" y="152" width="100" height="6" rx="3" fill="${isDark ? '#30363d' : '#e1e4e8'}"/>
      <rect x="${cardW / 2 - 50}" y="152" width="${progress}" height="6" rx="3" fill="url(#${gradId})" opacity="${isLocked ? 0.3 : 1}"/>
    `;

    content += `
      <g transform="translate(${x}, ${y})">
        <g class="${animation === 'on' ? 'fade-up' : ''}" style="animation-delay: ${animDelay}ms">
          <!-- Card Body -->
          <rect width="${cardW}" height="${cardH}" rx="16" fill="${cardBg}" stroke="${isLocked ? strokeColor : 'url(#' + gradId + ')'}" stroke-width="${t.tier === 'LEGENDARY' ? 2 : 1.2}" style="${(t.tier === 'LEGENDARY' || t.tier === 'GOLD') && animation === 'on' ? 'filter: drop-shadow(0 0 5px ' + style.glow + ')' : ''}"/>
          
          <defs>
            <linearGradient id="${gradId}" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="${style.stroke[0]}"/>
              <stop offset="100%" stop-color="${style.stroke[1]}"/>
            </linearGradient>
          </defs>

          <!-- Icon Circle -->
          <circle cx="${cardW / 2}" cy="58" r="38" fill="${style.bg}"/>
          <text x="${cardW / 2}" y="73" text-anchor="middle" font-family="Segoe UI Emoji, Apple Color Emoji, sans-serif" font-size="44" fill="${textTitle}" opacity="${isLocked ? 0.4 : 1}">
            ${isLocked ? '🔒' : t.icon}
          </text>

          <!-- Info -->
          <text x="${cardW / 2}" y="118" text-anchor="middle" font-family="Segoe UI, Ubuntu, sans-serif" font-weight="700" font-size="14" fill="${isLocked ? textSub : textTitle}">${t.title}</text>
          <text x="${cardW / 2}" y="135" text-anchor="middle" font-family="Segoe UI, Ubuntu, sans-serif" font-weight="600" font-size="11" fill="url(#${gradId})">${t.tier}</text>
          
          <!-- Progression -->
          ${progressBar}
          <text x="${cardW / 2}" y="172" text-anchor="middle" font-family="Segoe UI, Ubuntu, sans-serif" font-size="11" fill="${textSub}">
            ${t.value !== undefined ? t.value + ' / ' + t.nextValue : (t.unlocked ? 'UNLOCKED' : 'LOCKED')}
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
          .xp-fill { width: 0; animation: xpFillAnim 1.5s ease-in-out forwards; }
          .float { animation: floating 3s ease-in-out infinite; }
          @keyframes fadeUpAnim { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes xpFillAnim { from { width: 0; } to { width: ${level.progress}%; } }
          @keyframes floating { 0% { transform: translateY(0); } 50% { transform: translateY(-5px); } 100% { transform: translateY(0); } }
        </style>
      </defs>

      <rect width="100%" height="100%" rx="24" fill="${bg}"/>

      <!-- XP/Level Header -->
      <g transform="translate(20, 30)">
        <text x="0" y="0" font-family="Segoe UI, Ubuntu, sans-serif" font-weight="800" font-size="28" fill="${textTitle}">${username}</text>
        <text x="0" y="28" font-family="Segoe UI, Ubuntu, sans-serif" font-weight="700" font-size="16" fill="url(#xp_grad)">LEVEL ${level.level}</text>
        
        <!-- Global XP Bar -->
        <g transform="translate(0, 42)">
          <rect width="${totalW - 40}" height="12" rx="6" fill="${isDark ? '#30363d' : '#e1e4e8'}"/>
          <rect width="${(totalW - 40) * (level.progress / 100)}" height="12" rx="6" fill="url(#xp_grad)" class="${animation === 'on' ? 'xp-fill' : ''}"/>
          <text x="${totalW - 45}" y="-5" text-anchor="end" font-family="Segoe UI, Ubuntu, sans-serif" font-size="12" font-weight="600" fill="${textSub}">
            ${level.currentXP} / ${level.nextLevelXP} XP (Next Lvl in ${level.nextLevelXP - level.currentXP} XP)
          </text>
        </g>

        <linearGradient id="xp_grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#3fb950"/>
          <stop offset="100%" stop-color="#abffb4"/>
        </linearGradient>

        <text x="0" y="75" font-family="Segoe UI, Ubuntu, sans-serif" font-size="14" fill="${textSub}">
          Total Achievement Score: <tspan font-weight="700" fill="#3fb950">${totalXP} XP</tspan> • ${data.visible.filter(t => t.unlocked).length + data.hidden.length} Trophies Unlocked
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
      <text x="225" y="55" text-anchor="middle" font-family="Segoe UI" fill="#ff0055" font-weight="bold" font-size="16">⚠️ XP Error: ${message}</text>
    </svg>
  `;
}

module.exports = { renderTrophySVG, renderErrorSVG };
