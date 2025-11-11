# Latino Women's Rhetoric & LLMs

An educational website examining how Large Language Models (Claude, ChatGPT, Gemini, Co-Pilot) enhance and minimize Latino women's rhetoric, with focus on culture, identity, and representation.

## 🎯 Project Overview

This interactive educational platform explores:

- **Rhetoric & Composition**: Fundamentals and their role in communication
- **Cultural Implications**: How LLMs affect meaning-making for Latino women
- **Historical Timeline**: 300 years of women's contributions (dual-track: Latino women + all women)
- **LLM Analysis**: Comparative analysis of different AI models
- **Interactive Demonstrations**: Side-by-side comparisons, bias examples, and live experimentation
- **User Contributions**: Community-driven corrections via localStorage and GitHub Issues

## ✨ Key Features

### Three P5.js Visualizations
1. **Rhetoric Network**: Interactive tree/network of rhetoric concepts
2. **Timeline**: Dual-track 300-year timeline with filtering and search
3. **LLM Comparison**: Visual comparison of AI model behaviors

### Accessibility First
- Dark/light mode with high contrast
- ARIA labels and semantic HTML
- Keyboard navigation support
- WCAG 2.1 AA compliant
- Responsive design for all devices

### Free for All Users
- Core site works 100% without API keys
- Pre-recorded examples for all demonstrations
- Optional advanced features for users with free API trial keys

## 🚀 Getting Started

### Prerequisites
None! This is a static site built with pure HTML, CSS, and JavaScript.

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/acsuarez84/Women-Contributors-to-Artificial-Intelligence.git
   cd Women-Contributors-to-Artificial-Intelligence
   ```

2. **Start a local server**

   Using Python:
   ```bash
   python -m http.server 8000
   ```

   Using Node.js:
   ```bash
   npx http-server
   ```

   Using VS Code: Install "Live Server" extension and click "Go Live"

3. **Open in browser**
   ```
   http://localhost:8000
   ```

### Deployment to GitHub Pages

1. Push your changes to the main branch
2. Go to Settings → Pages
3. Source: Deploy from main branch, / (root)
4. Your site will be available at: `https://acsuarez84.github.io/Women-Contributors-to-Artificial-Intelligence/`

## 📁 Project Structure

```
/
├── index.html                    # Landing page
├── pages/                        # All content pages
│   ├── about.html
│   ├── applications.html
│   ├── timeline.html
│   ├── llm-analysis.html
│   ├── demonstrations.html
│   └── contribute.html
├── css/                          # Stylesheets
│   ├── main.css                  # Global styles + dark/light mode
│   ├── timeline.css
│   ├── visualizations.css
│   └── responsive.css
├── js/                           # JavaScript
│   ├── main.js                   # Core app logic
│   ├── navigation.js
│   ├── api/                      # API integrations
│   ├── visualizations/           # P5.js sketches
│   ├── components/               # UI components
│   └── data/                     # Data modules
├── data/                         # JSON data
│   ├── contributors-latino.json
│   ├── contributors-all.json
│   └── rhetoric-concepts.json
├── assets/                       # Images, fonts
├── libs/                         # External libraries
├── CLAUDE.md                     # Instructions for Claude Code
└── README.md                     # This file
```

## 🎨 Customization

### Adding Timeline Contributors

Edit `data/contributors-latino.json` or `data/contributors-all.json`:

```json
{
  "id": "unique-id",
  "name": "Contributor Name",
  "birthYear": 1900,
  "deathYear": 2000,
  "field": "rhetoric|composition|ai|etc",
  "contributions": ["Key contribution 1", "Key contribution 2"],
  "culturalImpact": "Analysis of impact on culture/identity",
  "sources": ["URL or citation"]
}
```

### Modifying Rhetoric Concepts

Edit `data/rhetoric-concepts.json` to add nodes and edges to the network visualization.

### Changing Colors/Theme

Edit CSS custom properties in `css/main.css`:

```css
:root {
  --accent-pink: #e91e63;
  --accent-purple: #9c27b0;
  /* etc. */
}
```

## 🔧 Optional: LLM API Integration

For live experimentation features, users can provide their own API keys (stored in localStorage only):

- **Claude**: [Get free trial credits](https://console.anthropic.com)
- **ChatGPT**: [Get $5 free credits](https://platform.openai.com/signup)
- **Gemini**: [Free tier available](https://makersuite.google.com)

API keys are **never** committed to the repository and are stored only in the user's browser.

## 🤝 Contributing

We welcome contributions! You can:

1. **Submit corrections via GitHub Issues**: [Open an issue](https://github.com/acsuarez84/Women-Contributors-to-Artificial-Intelligence/issues)
2. **Add timeline entries**: Follow the JSON schema in data files
3. **Improve accessibility**: Test with screen readers and submit improvements
4. **Translate content**: Help make this resource multilingual

See `pages/contribute.html` for detailed guidelines.

## 📚 Educational Use

This project is designed for:

- **Students**: Learning about rhetoric, composition, and AI bias
- **Educators**: Teaching critical AI literacy and cultural representation
- **Researchers**: Studying LLM effects on diverse rhetorical traditions
- **General Public**: Understanding how AI affects communication and identity

## 🛡️ Privacy & Data

- No tracking or analytics
- API keys stored only in browser localStorage
- No personal data collected
- User contributions via GitHub are public

## 📖 Learn More

- [About Rhetoric & Composition](pages/about.html)
- [Cultural Implications](pages/applications.html)
- [Interactive Timeline](pages/timeline.html)
- [LLM Analysis](pages/llm-analysis.html)

## 📄 License

Educational use. Content should be cited appropriately when used in academic work.

## 🙏 Acknowledgments

This project centers the voices and contributions of Latino women to rhetoric, composition, and communication studies. We acknowledge the many contributors whose work has been historically marginalized or erased.

## 📧 Contact

For questions or suggestions, please [open an issue](https://github.com/acsuarez84/Women-Contributors-to-Artificial-Intelligence/issues).

---

**Note**: This is an active educational project. Data and analysis are continually being refined and expanded. Contributions welcome!
