/**
 * Render the Legacy Achievement System with Classic Trophy Visuals
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

  const TIER_CONFIG = {
    LEGENDARY: { label: 'SSS', color: '#ff0055', trophy: '#ffd700', glow: '#ff0055aa' },
    GOLD: { label: 'S', color: '#ffb300', trophy: '#ffd700', glow: '#ffb300aa' },
    SILVER: { label: 'A', color: '#c0c0c0', trophy: '#c0c0c0', glow: '#c0c0c0aa' },
    BRONZE: { label: 'B', color: '#cd7f32', trophy: '#cd7f32', glow: '#cd7f32aa' },
    LOCKED: { label: 'C', color: '#30363d', trophy: '#30363d', glow: 'transparent' }
  };

  const cardW = 160;
  const cardH = 190;
  const gap = 15;
  const headerHeight = 110;

  let displayItems = [...visible];
  if (showLocked === 'true') displayItems.push(...locked);
  if (showHidden === 'true' || hidden.length > 0) displayItems.push(...hidden);

  const numCols = 3;
  const numRows = Math.ceil(displayItems.length / numCols);
  const totalW = numCols * (cardW + gap) + gap;
  const totalH = headerHeight + numRows * (cardH + gap) + 60;

  // Trophy Cup SVG Path Helper
  const getTrophyCup = (color, rank) => `
    <g transform="translate(-35, -35)">
      <!-- Laurel Wreath -->
      <path d="M15 55 Q 15 80 35 85 Q 55 80 55 55" fill="none" stroke="${color}" stroke-width="2" opacity="0.4"/>
      <path d="M20 65 L25 60 M20 75 L25 70 M50 60 L45 65 M50 70 L45 75" stroke="${color}" stroke-width="2" opacity="0.4"/>
      
      <!-- Trophy Base -->
      <path d="M25 75 L45 75 L42 70 L28 70 Z" fill="${color}" />
      <path d="M33 70 L33 65 L37 65 L37 70 Z" fill="${color}" />
      
      <!-- Trophy Cup Body -->
      <path d="M20 35 Q 20 65 35 65 Q 50 65 50 35 Z" fill="${color}" />
      
      <!-- Handles -->
      <path d="M20 40 Q 15 40 15 48 Q 15 55 20 52" fill="none" stroke="${color}" stroke-width="3" />
      <path d="M50 40 Q 55 40 55 48 Q 55 55 50 52" fill="none" stroke="${color}" stroke-width="3" />
      
      <!-- Rank Letter -->
      <text x="35" y="52" text-anchor="middle" font-family="Arial, Segoe UI" font-weight="900" font-size="16" fill="${isDark ? '#000' : '#fff'}" style="text-shadow: 0 0 2px rgba(255,255,255,0.5)">
        ${rank}
      </text>
    </g>
  `;

  let content = '';

  displayItems.forEach((t, i) => {
    const col = i % numCols;
    const row = Math.floor(i / numCols);
    const x = gap + col * (cardW + gap);
    const y = headerHeight + row * (cardH + gap);

    const config = TIER_CONFIG[t.tier] || TIER_CONFIG.LOCKED;
    const animDelay = (i * 100) + 500;
    const isLocked = t.tier === 'LOCKED';

    let progressBar = '';
    const progress = t.progress !== undefined ? t.progress : (t.unlocked ? 100 : 0);
    progressBar = `
      <rect x="${cardW / 2 - 50}" y="155" width="100" height="6" rx="3" fill="${isDark ? '#30363d' : '#e1e4e8'}"/>
      <rect x="${cardW / 2 - 50}" y="155" width="${progress}" height="6" rx="3" fill="${config.color}" opacity="${isLocked ? 0.3 : 1}"/>
    `;

    content += `
      <g transform="translate(${x}, ${y})">
        <g class="${animation === 'on' ? 'fade-up' : ''}" style="animation-delay: ${animDelay}ms">
          <!-- Card Body -->
          <rect width="${cardW}" height="${cardH}" rx="18" fill="${cardBg}" stroke="${isLocked ? strokeColor : config.color}" stroke-width="1.5" style="${(!isLocked && animation === 'on') ? 'filter: drop-shadow(0 0 5px ' + config.glow + ')' : ''}"/>
          
          <!-- Trophy Cup Position -->
          <g transform="translate(${cardW / 2}, 60)">
             ${getTrophyCup(config.color, config.label)}
          </g>

          <!-- Info -->
          <text x="${cardW / 2}" y="120" text-anchor="middle" font-family="Segoe UI, Ubuntu, sans-serif" font-weight="700" font-size="14" fill="${isLocked ? textSub : textTitle}">${t.title}</text>
          <text x="${cardW / 2}" y="140" text-anchor="middle" font-family="Segoe UI, Ubuntu, sans-serif" font-weight="600" font-size="11" fill="${config.color}">${t.tier}</text>
          
          <!-- Progression -->
          ${progressBar}
          <text x="${cardW / 2}" y="175" text-anchor="middle" font-family="Segoe UI, Ubuntu, sans-serif" font-size="11" fill="${textSub}">
            ${t.value !== undefined ? t.value + ' / ' + t.nextValue : (t.unlocked ? 'COMPLETED' : 'LOCKED')}
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
          @keyframes fadeUpAnim { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes xpFillAnim { from { width: 0; } to { width: ${level.progress}%; } }
        </style>
      </defs>

      <rect width="100%" height="100%" rx="24" fill="${bg}"/>

      <!-- XP Header -->
      <g transform="translate(25, 30)">
        <text x="0" y="0" font-family="Segoe UI, Ubuntu, sans-serif" font-weight="900" font-size="30" fill="${textTitle}">${username}</text>
        <text x="0" y="30" font-family="Segoe UI, Ubuntu, sans-serif" font-weight="700" font-size="18" fill="#3fb950">LEVEL ${level.level}</text>
        
        <g transform="translate(0, 45)">
          <rect width="${totalW - 50}" height="14" rx="7" fill="${isDark ? '#30363d' : '#e1e4e8'}"/>
          <rect width="${(totalW - 50) * (level.progress / 100)}" height="14" rx="7" fill="#3fb950" class="${animation === 'on' ? 'xp-fill' : ''}"/>
          <text x="${totalW - 55}" y="-8" text-anchor="end" font-family="Segoe UI, Ubuntu, sans-serif" font-size="12" font-weight="700" fill="${textSub}">
            ${level.currentXP} / ${level.nextLevelXP} XP
          </text>
        </g>

        <text x="0" y="80" font-family="Segoe UI, Ubuntu, sans-serif" font-size="15" fill="${textSub}">
          Achievement Score: <tspan font-weight="800" fill="#3fb950">${totalXP} XP</tspan> • Progression: ${data.visible.filter(t => t.unlocked).length} / ${data.visible.length}
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
      <text x="225" y="55" text-anchor="middle" font-family="Segoe UI" fill="#ff0055" font-weight="bold" font-size="16">XP Error: ${message}</text>
    </svg>
  `;
}

module.exports = { renderTrophySVG, renderErrorSVG };
