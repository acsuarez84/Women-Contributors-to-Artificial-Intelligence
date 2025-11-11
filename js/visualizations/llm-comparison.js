/**
 * llm-comparison.js - P5.js visualization comparing LLM behaviors
 * Bar chart or scatter plot showing comparative metrics
 */

let comparisonSketch = function(p) {
  let selectedCategory = 'code-switching';
  let data = {};

  // Mock data for visualization (would be loaded from actual analysis)
  const categories = {
    'code-switching': {
      name: 'Code-Switching Recognition',
      metrics: {
        claude: { score: 85, label: 'Recognizes as valid' },
        chatgpt: { score: 45, label: 'Often "corrects"' },
        gemini: { score: 65, label: 'Mixed recognition' },
        copilot: { score: 30, label: 'Treats as error' }
      }
    },
    'cultural-context': {
      name: 'Cultural Context Understanding',
      metrics: {
        claude: { score: 80, label: 'Strong context awareness' },
        chatgpt: { score: 60, label: 'Moderate awareness' },
        gemini: { score: 70, label: 'Good awareness' },
        copilot: { score: 40, label: 'Limited awareness' }
      }
    },
    'rhetorical-styles': {
      name: 'Rhetorical Style Diversity',
      metrics: {
        claude: { score: 75, label: 'Validates diverse styles' },
        chatgpt: { score: 55, label: 'Prefers standard' },
        gemini: { score: 65, label: 'Acknowledges variety' },
        copilot: { score: 50, label: 'Enforces norms' }
      }
    },
    'representation': {
      name: 'Representation & Stereotypes',
      metrics: {
        claude: { score: 70, label: 'Aware of bias' },
        chatgpt: { score: 60, label: 'Some stereotypes' },
        gemini: { score: 65, label: 'Mixed results' },
        copilot: { score: 55, label: 'Limited awareness' }
      }
    },
    'language-preservation': {
      name: 'Language Preservation',
      metrics: {
        claude: { score: 85, label: 'Preserves bilingualism' },
        chatgpt: { score: 50, label: 'Suggests translation' },
        gemini: { score: 70, label: 'Balanced approach' },
        copilot: { score: 45, label: 'Monolingual bias' }
      }
    }
  };

  // Configuration
  const config = {
    barHeight: 40,
    barSpacing: 20,
    leftMargin: 120,
    rightMargin: 50,
    topMargin: 80,
    bottomMargin: 60,
    colors: {
      claude: [156, 39, 176],
      chatgpt: [76, 175, 80],
      gemini: [33, 150, 243],
      copilot: [255, 152, 0]
    }
  };

  p.setup = function() {
    const container = document.getElementById('llm-comparison-canvas');
    if (!container) return;

    const canvas = p.createCanvas(container.offsetWidth, 400);
    canvas.parent(container);

    // Set up category selector
    setupCategorySelector();

    // Initial category
    data = categories[selectedCategory];

    // Mark as loaded
    container.classList.add('loaded');
  };

  p.draw = function() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    p.background(isDark ? 45 : 248);

    if (!data || !data.metrics) {
      drawLoadingMessage();
      return;
    }

    // Draw title
    p.fill(isDark ? 245 : 50);
    p.noStroke();
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(16);
    p.text(data.name, p.width / 2, 20);

    // Draw bars
    const llms = Object.keys(data.metrics);
    const startY = config.topMargin;
    const maxBarWidth = p.width - config.leftMargin - config.rightMargin;

    llms.forEach((llm, index) => {
      const metric = data.metrics[llm];
      const y = startY + index * (config.barHeight + config.barSpacing);
      const barWidth = p.map(metric.score, 0, 100, 0, maxBarWidth);

      // LLM label
      p.fill(isDark ? 200 : 80);
      p.textAlign(p.RIGHT, p.CENTER);
      p.textSize(14);
      p.text(llm.toUpperCase(), config.leftMargin - 10, y + config.barHeight / 2);

      // Bar
      const isHovered = p.mouseX > config.leftMargin &&
                       p.mouseX < config.leftMargin + barWidth &&
                       p.mouseY > y &&
                       p.mouseY < y + config.barHeight;

      p.fill(...config.colors[llm], isHovered ? 255 : 200);
      p.noStroke();
      p.rect(config.leftMargin, y, barWidth, config.barHeight, 4);

      // Score
      p.fill(isDark ? 245 : 50);
      p.textAlign(p.LEFT, p.CENTER);
      p.textSize(14);
      p.text(metric.score, config.leftMargin + barWidth + 10, y + config.barHeight / 2);

      // Hover label
      if (isHovered) {
        drawTooltip(metric.label, p.mouseX, p.mouseY);
      }
    });

    // Draw legend/scale
    drawScale();
  };

  function drawLoadingMessage() {
    p.fill(150);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(16);
    p.text('Loading comparison data...', p.width / 2, p.height / 2);
  }

  function drawTooltip(text, x, y) {
    const padding = 10;
    const boxWidth = 200;

    p.fill(255, 255, 255, 250);
    p.stroke(100);
    p.strokeWeight(2);
    p.rect(x + 10, y - 20, boxWidth, 40, 5);

    p.noStroke();
    p.fill(0);
    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(12);
    p.text(text, x + 20, y, boxWidth - 20);
  }

  function drawScale() {
    const y = p.height - config.bottomMargin + 20;
    const startX = config.leftMargin;
    const endX = p.width - config.rightMargin;

    // Scale line
    p.stroke(150);
    p.strokeWeight(2);
    p.line(startX, y, endX, y);

    // Labels
    p.noStroke();
    p.fill(150);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(12);
    p.text('0', startX, y + 10);
    p.text('50', (startX + endX) / 2, y + 10);
    p.text('100', endX, y + 10);

    p.textAlign(p.CENTER, p.BOTTOM);
    p.text('Score (0-100)', p.width / 2, y - 10);
  }

  function setupCategorySelector() {
    const selector = document.getElementById('prompt-select');
    if (selector) {
      selector.addEventListener('change', (e) => {
        selectedCategory = e.target.value;
        data = categories[selectedCategory];
      });
    }
  }

  p.windowResized = function() {
    const container = document.getElementById('llm-comparison-canvas');
    if (container) {
      p.resizeCanvas(container.offsetWidth, 400);
    }
  };
};

// Initialize when on LLM analysis page
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('llm-comparison-canvas')) {
    new p5(comparisonSketch);
  }
});
