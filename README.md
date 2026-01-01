# 🏆 GitHub Trophy: Gamified Achievements
A sophisticated achievement system for your GitHub Profile. This project has evolved into a full "Gamified" experience with visible stats, secret unlockables, and tiered progression.

## ✨ New Gamified Features
- **Tiered Progression:** Achieve **LEGENDARY**, **GOLD**, **SILVER**, or **BRONZE** status for every category.
- **Secret Trophies:** Unlock hidden achievements like "Early Adopter" or "Lone Wolf" based on unique behaviors.
- **Visual Upgrades:** Neon glows for Legendary items, progress bars for stats, and slick SVG animations (fade-up + pulse).
- **Interactive Feel:** Trophies float and animate when loaded.
- **Zero Config:** Just use your username.

## 🛠 Usage
Embed the following in your GitHub README:

```markdown
![My Achievements](https://your-domain.vercel.app/api/trophies?username=YOUR_USERNAME&theme=dark&column=3)
```

### Query Parameters
| Parameter | Default | Description |
|-----------|---------|-------------|
| `username`| Required| Your GitHub username |
| `theme`   | `dark`  | `dark` or `light` |
| `columns` | `3`     | Cards per row |
| `animation`| `on`   | Toggle animations (`on`/`off`) |

## 🏆 Trophy Tiers
| Tier | Color | Requirement (Example) |
|------|-------|-----------------------|
| **LEGENDARY** | 🔮 Neon Purple | Top 1% (e.g., >1000 Stars) |
| **GOLD** | 🟡 Gold | High Achievement (e.g., >500 Stars) |
| **SILVER** | ⚪ Silver | Solid Contribution (e.g., >100 Stars) |
| **BRONZE** | 🟤 Bronze | Getting Started |

## 🌟 Secret Trophies
Can you unlock them all?
- 🦕 **Early Adopter**: Account created over 10 years ago.
- 🐺 **Lone Wolf**: ???
- 💎 **Artisan**: ???

## 🚀 Deployment
1. **Fork** this repository.
2. Import to **Vercel**.
3. Add `GITHUB_TOKEN` for higher rate limits.
4. **Deploy** and enjoy your Hall of Fame!

---
Built with ❤️ for GitHub Maintainers.
