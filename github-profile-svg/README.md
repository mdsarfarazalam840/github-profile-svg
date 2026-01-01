# 🏆 GitHub Trophy Generator

A production-ready API to generate trophy-style SVG badges for your GitHub Profile README. This tool derives "achievements" from your GitHub activity (repos, followers, following) and displays them as a beautiful grid of medals.

## ✨ Features
- **Pure SVG:** Works perfectly as an image link in GitHub READMEs.
- **Dynamic Achievements:** Automatically calculates trophies from your GitHub stats.
- **Customizable Layout:** Choose your theme (`dark` or `light`) and grid columns.
- **Auto-Scaling:** The SVG height adjusts automatically based on the number of trophies earned.
- **Production Performance:** Serverless API with 24-hour caching.

## 🛠 Usage

Embed the following in your GitHub README:

```markdown
![My Trophies](https://your-domain.vercel.app/api/trophies?username=YOUR_USERNAME&theme=dark&columns=3)
```

### Query Parameters
| Parameter | Required | Description | Options |
|-----------|----------|-------------|---------|
| `username`| Yes      | GitHub username | Any valid user |
| `theme`   | No       | Visual style | `dark` (default), `light` |
| `columns` | No       | Number of columns in grid | `1`, `2`, `3` (default), etc. |

## 🏆 Achievement List
| Trophy | Milestone | Criteria |
|--------|-----------|---------|
| 🏆 **First Repo** | Beginner | `public_repos` ≥ 1 |
| 📦 **Repo Builder** | Regular | `public_repos` ≥ 10 |
| 🔥 **OS Addict** | Advanced | `public_repos` ≥ 30 |
| ⭐ **Rising Dev**| Emerging | `followers` ≥ 10 |
| 🌟 **Popular Dev**| Notable | `followers` ≥ 50 |
| 👑 **Leader** | Influence | `followers` ≥ 100 |
| 🤝 **Networker** | Community | `following` ≥ 50 |

## 🚀 Deployment

### Deploy to Vercel
1. **Fork** this repository.
2. Go to [Vercel](https://vercel.com) and **Import** your fork.
3. (Optional) Add a `GITHUB_TOKEN` environment variable to increase rate limits.
4. **Deploy**!

### Local Development
```bash
npm install
npm run dev
```

## 📂 Project Structure
```text
github-trophy-generator/
├── api/
│   └── trophies.js      # Main API endpoint
├── utils/
│   └── github.js        # GitHub data & achievement logic
├── themes/
│   └── trophyRenderer.js # SVG grid generation
├── vercel.json           # Routing & Caching
└── package.json          # Dependencies
```

## 📜 License
Licensed under the [MIT License](LICENSE).

---
Built with ❤️ for the Open Source Community.
