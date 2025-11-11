# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an educational website examining how Large Language Models (Claude, ChatGPT, Gemini, Co-Pilot) enhance and minimize Latino women's rhetoric, with focus on rhetoric & composition, culture, identity, and representation. The site includes a 300-year timeline of women's contributions and interactive demonstrations of LLM behaviors.

**Target Audience**: Mixed (academics/researchers and general public)

**Hosting**: GitHub Pages (static site)

## Technology Stack

- **Frontend**: HTML5, CSS3 (Grid/Flexbox)
- **JavaScript**: Vanilla ES6+ (no frameworks)
- **Visualizations**: P5.js for interactive graphics
- **APIs**:
  - Optional LLM APIs (user-provided keys): Anthropic Claude, OpenAI, Google Gemini
  - GitHub Issues API for user contributions
- **Data**: JSON files + localStorage

## Project Structure

```
/
├── index.html                    # Landing page
├── css/                          # Stylesheets
│   ├── main.css                  # Global styles + dark/light mode
│   ├── timeline.css              # Timeline-specific styles
│   ├── visualizations.css        # P5.js canvas styles
│   └── responsive.css            # Mobile responsiveness
├── js/                           # JavaScript modules
│   ├── main.js                   # Core app logic
│   ├── navigation.js             # Page navigation
│   ├── api/                      # API integrations
│   ├── visualizations/           # P5.js sketches
│   ├── components/               # UI components
│   └── data/                     # Data modules
├── pages/                        # HTML pages
│   ├── about.html                # Rhetoric & composition explained
│   ├── applications.html         # Implications analysis
│   ├── timeline.html             # Interactive timeline
│   ├── llm-analysis.html         # LLM comparison
│   ├── demonstrations.html       # Interactive demos
│   └── contribute.html           # User contributions
├── data/                         # JSON data files
│   ├── contributors-latino.json  # Latino women timeline data
│   ├── contributors-all.json     # All women timeline data
│   └── rhetoric-concepts.json    # Network visualization data
├── assets/                       # Images, fonts
└── libs/                         # External libraries (P5.js)
```

## Key Features

### 1. Three P5.js Interactive Visualizations
- **Rhetoric Network**: Tree/network visualization of rhetoric concepts
- **Timeline**: Dual-track 300-year timeline (Latino women + all women)
- **LLM Comparison**: Comparative analysis with links to each platform

### 2. Interactive Demonstrations
- Side-by-side LLM response comparisons
- Before/after bias examples
- Real-time API experimentation (optional, user's own keys)

### 3. User Contribution System
- **LocalStorage**: Immediate user annotations (no persistence across users)
- **GitHub Issues API**: Persistent corrections and additions

### 4. Dynamic Content Generation
- LLM APIs regenerate content based on user corrections
- Display: original content | user corrections | regenerated content
- Explanation of algorithmic implications for each change

### 5. Accessibility Features
- Dark/light mode toggle
- High contrast text on both modes
- ARIA labels and keyboard navigation
- WCAG 2.1 AA compliance

## Development Guidelines

### API Key Management
- **Never commit API keys to the repository**
- LLM APIs are optional advanced features
- Core site works 100% without API keys (uses pre-recorded examples)
- Users can provide their own free trial keys for experimentation
- Keys stored only in localStorage

### Design Principles
- **Dual tone**: Academic/formal + colorful/engaging
- **Accessibility first**: High contrast, keyboard nav, screen reader support
- **Progressive enhancement**: Works without JavaScript, better with it
- **Mobile responsive**: All features work on mobile devices

### Content Strategy
- Educational content accessible to both academics and general public
- Layered explanations (simple overview + deeper analysis)
- Pre-recorded examples for all LLM demonstrations
- Clear instructions for optional API features

## Working with Data Files

### Timeline Data Structure (data/contributors-latino.json, contributors-all.json)
```json
[
  {
    "id": "unique-id",
    "name": "Contributor Name",
    "birthYear": 1800,
    "deathYear": 1900,
    "field": "rhetoric|composition|AI|NLP|etc",
    "contributions": ["Brief description of contribution"],
    "culturalImpact": "Analysis of cultural/identity implications",
    "sources": ["URL or citation"]
  }
]
```

### Rhetoric Concepts (data/rhetoric-concepts.json)
```json
{
  "nodes": [
    {
      "id": "concept-id",
      "label": "Concept Name",
      "description": "Brief explanation",
      "level": 1
    }
  ],
  "edges": [
    {
      "source": "concept-id-1",
      "target": "concept-id-2",
      "relationship": "builds-on|relates-to|contrasts-with"
    }
  ]
}
```

## Local Development

1. **No build process needed** - pure HTML/CSS/JS
2. **Local server**: Use any HTTP server (Python, Node http-server, VS Code Live Server)
   ```bash
   python -m http.server 8000
   # OR
   npx http-server
   ```
3. **Testing**: Open browser to http://localhost:8000

## Deployment to GitHub Pages

1. Push to main branch
2. Settings → Pages → Source: main branch, / (root)
3. Site will be available at: https://acsuarez84.github.io/Women-Contributors-to-Artificial-Intelligence/

## Common Tasks

### Adding Timeline Entries
1. Edit `data/contributors-latino.json` or `data/contributors-all.json`
2. Follow the JSON schema structure
3. Ensure all required fields are present
4. Commit and push

### Updating Visualizations
- Rhetoric network: Edit `js/visualizations/rhetoric-network.js`
- Timeline: Edit `js/visualizations/timeline-viz.js`
- LLM comparison: Edit `js/visualizations/llm-comparison.js`

### Modifying Content
- Educational pages: Edit HTML files in `pages/`
- Styling: Edit CSS files in `css/`
- Add dark mode support to new elements by using CSS variables

### Testing User Contributions
- LocalStorage: Use browser dev tools → Application → Local Storage
- GitHub Issues: Test with repository's Issues tab

## Important Notes

- All LLM API features are optional enhancements
- Site must be fully functional without any API keys
- Maintain high contrast for accessibility in both light/dark modes
- Keep content accessible to non-academic audiences while maintaining scholarly rigor
- User contributions via GitHub Issues should be moderated before integration
