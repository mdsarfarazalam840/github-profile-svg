# 🚀 GitHub Profile SVG Generator

A production-ready API to generate clean, modern SVG stat cards for your GitHub Profile README. Embed your real-time stats (Repos, Followers, Following) with support for dark/light themes and custom titles.

## ✨ Features
- **Pure SVG:** No HTML/JSX, perfectly compatible with GitHub READMEs.
- **Dynamic Themes:** Support for `dark`, `light`, `dracula`, and `trophy` modes.
- **Smart Ranking:** Automatic ranking (S+, S, A, B, C) based on your GitHub activity.
- **Micro-Animations:** Smooth CSS transitions for text and rank stats.
- **Auto-Caching:** Responses are cached for 24 hours to handle rate limits and improve performance.
- **Zero Configuration:** Deploy to Vercel in seconds.
- **Error Handling:** Graceful SVG error messages for invalid usernames.

## 🛠 Usage

Simply embed the following link in your GitHub README:

```markdown
![Profile Stats](https://your-domain.vercel.app/api/profile?username=YOUR_USERNAME&theme=trophy)
```

### Query Parameters
| Parameter | Required | Description | Options |
|-----------|----------|-------------|---------|
| `username`| Yes      | GitHub username | Any valid GitHub user |
| `theme`   | No       | Visual theme | `dark` (default), `light`, `dracula`, `trophy` |
| `title`   | No       | Custom card title | Any string (URL encoded) |

### Examples

**Trophy Theme (New!)**
`https://your-domain.vercel.app/api/profile?username=varadscript&theme=trophy`

**Dracula Theme (Highly Recommended)**
`https://your-domain.vercel.app/api/profile?username=varadscript&theme=dracula`

**Dark Theme**
`https://your-domain.vercel.app/api/profile?username=varadscript&theme=dark`

**Light Theme**
`https://your-domain.vercel.app/api/profile?username=varadscript&theme=light`

## 🚀 Deployment

### Deploy to Vercel

1. **Fork this repository.**
2. **Connect to Vercel:** Go to [Vercel](https://vercel.com/) and import your forked repo.
3. **Deploy:** Vercel will automatically detect the settings and deploy the API.
4. **Environment Variables (Optional):** If you hit rate limits frequently, you can modify `utils/github.js` to use a Personal Access Token (PAT).

### Local Development
```bash
# Clone the repository
git clone https://github.com/your-username/github-profile-svg.git

# Install dependencies
npm install

# Run locally using Vercel CLI
npm run dev
```

## 📂 Project Structure
```text
github-profile-svg/
├── api/             # Main API route (Vercel Serverless Function)
├── utils/           # GitHub API integration logic
├── themes/          # SVG templates (Dark & Light)
├── vercel.json      # Routing and Caching configuration
├── package.json     # Dependencies
└── README.md        # Documentation
```

## 🛡 License
This project is licensed under the **MIT License**.

## 🔮 Future Improvements
- [ ] Add more themes (Solarized, Dracula, High Contrast).
- [ ] Support for private repositories (using OAuth/PAT).
- [ ] Display Top Languages or most starred repos.
- [ ] Animated SVG transitions.
- [ ] Integration with GitHub Actions for automated updates.

---
Built with ❤️ by [Antigravity](https://github.com/your-username)
