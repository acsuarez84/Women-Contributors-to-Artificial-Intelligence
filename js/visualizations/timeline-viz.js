/**
 * timeline-viz.js - P5.js interactive dual-track timeline visualization
 * Displays Latino women and all women contributors on parallel tracks
 */

let timelineSketch = function(p) {
  let latinoData = [];
  let allWomenData = [];
  let currentView = 'both'; // 'both', 'latino', 'all'
  let selectedContributor = null;
  let startYear = 1700;
  let endYear = 2024;
  let zoomLevel = 1;
  let panOffset = 0;

  // Configuration
  const config = {
    trackHeight: 80,
    dotRadius: 8,
    latinoColor: [233, 30, 99],    // Pink
    allWomenColor: [156, 39, 176],  // Purple
    lineColor: [200, 200, 200],
    fontSize: 11,
    padding: { top: 60, bottom: 60, left: 100, right: 100 }
  };

  p.setup = function() {
    const container = document.getElementById('timeline-canvas');
    if (!container) return;

    const canvas = p.createCanvas(container.offsetWidth, 500);
    canvas.parent(container);

    // Load data
    loadTimelineData();

    // Set up controls
    setupTimelineControls();

    // Mark as loaded
    container.classList.add('loaded');
  };

  async function loadTimelineData() {
    const latinoLoader = new TimelineDataLoader();
    const allLoader = new AllWomenDataLoader();

    latinoData = await latinoLoader.loadLatino();
    allWomenData = await allLoader.loadAll();

    // Update result count
    updateResultCount();
  }

  p.draw = function() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    p.background(isDark ? 45 : 248);

    if (latinoData.length === 0 && allWomenData.length === 0) {
      drawLoadingMessage();
      return;
    }

    // Draw timeline axis
    drawTimelineAxis();

    // Draw tracks based on current view
    if (currentView === 'both' || currentView === 'latino') {
      drawTrack(latinoData, config.padding.top + 50, config.latinoColor, 'Latino Women');
    }

    if (currentView === 'both' || currentView === 'all') {
      const yPos = currentView === 'both' ?
        config.padding.top + 50 + config.trackHeight + 80 :
        config.padding.top + 50;
      drawTrack(allWomenData, yPos, config.allWomenColor, 'All Women');
    }

    // Draw selected contributor detail
    if (selectedContributor) {
      drawContributorDetail(selectedContributor);
    }
  };

  function drawLoadingMessage() {
    p.fill(150);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(16);
    p.text('Loading timeline data...', p.width / 2, p.height / 2);
  }

  function drawTimelineAxis() {
    const startX = config.padding.left;
    const endX = p.width - config.padding.right;
    const y = p.height - config.padding.bottom + 20;

    // Axis line
    p.stroke(150);
    p.strokeWeight(2);
    p.line(startX, y, endX, y);

    // Year markers
    const yearRange = endYear - startYear;
    const interval = yearRange > 200 ? 50 : 25;

    p.textAlign(p.CENTER, p.TOP);
    p.textSize(config.fontSize);
    p.fill(150);
    p.noStroke();

    for (let year = Math.ceil(startYear / interval) * interval; year <= endYear; year += interval) {
      const x = p.map(year, startYear, endYear, startX, endX);
      p.strokeWeight(1);
      p.stroke(150);
      p.line(x, y - 5, x, y + 5);
      p.noStroke();
      p.text(year, x, y + 10);
    }
  }

  function drawTrack(data, yPos, color, label) {
    const startX = config.padding.left;
    const endX = p.width - config.padding.right;

    // Track label
    p.fill(...color);
    p.noStroke();
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(14);
    p.text(label, startX, yPos - 30);

    // Track line
    p.stroke(...color, 100);
    p.strokeWeight(2);
    p.line(startX, yPos, endX, yPos);

    // Contributor dots
    data.forEach(contributor => {
      const x = p.map(contributor.birthYear, startYear, endYear, startX, endX);
      const isHovered = p.dist(p.mouseX, p.mouseY, x, yPos) < config.dotRadius;
      const isSelected = selectedContributor && selectedContributor.id === contributor.id;

      // Dot
      p.strokeWeight(isSelected || isHovered ? 3 : 1);
      p.stroke(isSelected ? 255 : ...color);
      p.fill(...color, isHovered ? 255 : 200);
      p.ellipse(x, yPos, config.dotRadius * 2);

      // Name on hover
      if (isHovered || isSelected) {
        p.noStroke();
        p.fill(0);
        p.textAlign(p.CENTER, p.BOTTOM);
        p.textSize(config.fontSize);
        p.text(contributor.name, x, yPos - config.dotRadius - 5);
      }
    });
  }

  function drawContributorDetail(contributor) {
    const boxWidth = 350;
    const boxHeight = 200;
    const x = 20;
    const y = 20;

    // Background box
    p.fill(255, 255, 255, 250);
    p.stroke(100);
    p.strokeWeight(2);
    p.rect(x, y, boxWidth, boxHeight, 5);

    // Content
    p.noStroke();
    p.fill(0);
    p.textAlign(p.LEFT, p.TOP);

    p.textSize(16);
    p.text(contributor.name, x + 15, y + 15, boxWidth - 30);

    p.textSize(12);
    const years = window.utils.formatYearRange(contributor.birthYear, contributor.deathYear);
    p.text(years, x + 15, y + 40);

    p.text(`Field: ${contributor.field}`, x + 15, y + 60);

    p.textSize(11);
    const contrib = contributor.contributions[0];
    p.text(window.utils.truncate(contrib, 150), x + 15, y + 85, boxWidth - 30, 80);

    // Close button
    p.fill(200, 50, 50);
    p.ellipse(x + boxWidth - 15, y + 15, 20);
    p.fill(255);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(14);
    p.text('×', x + boxWidth - 15, y + 14);
  }

  p.mousePressed = function() {
    // Check close button
    if (selectedContributor) {
      const closeX = 20 + 350 - 15;
      const closeY = 20 + 15;
      if (p.dist(p.mouseX, p.mouseY, closeX, closeY) < 10) {
        selectedContributor = null;
        return;
      }
    }

    // Check contributors
    const startX = config.padding.left;
    const endX = p.width - config.padding.right;

    const datasets = [];
    if (currentView === 'both' || currentView === 'latino') {
      datasets.push({ data: latinoData, y: config.padding.top + 50 });
    }
    if (currentView === 'both' || currentView === 'all') {
      const yPos = currentView === 'both' ?
        config.padding.top + 50 + config.trackHeight + 80 :
        config.padding.top + 50;
      datasets.push({ data: allWomenData, y: yPos });
    }

    for (let dataset of datasets) {
      for (let contributor of dataset.data) {
        const x = p.map(contributor.birthYear, startYear, endYear, startX, endX);
        if (p.dist(p.mouseX, p.mouseY, x, dataset.y) < config.dotRadius) {
          selectedContributor = contributor;
          showDetailPanel(contributor);
          return;
        }
      }
    }
  };

  function showDetailPanel(contributor) {
    const panel = document.getElementById('detail-panel');
    const content = document.getElementById('detail-content');

    if (panel && content) {
      const years = window.utils.formatYearRange(contributor.birthYear, contributor.deathYear);

      content.innerHTML = `
        <h3>${contributor.name}</h3>
        <p class="contributor-years">${years}</p>
        <p><strong>Field:</strong> ${contributor.field}</p>
        <h4>Contributions:</h4>
        <ul>
          ${contributor.contributions.map(c => `<li>${c}</li>`).join('')}
        </ul>
        <h4>Cultural Impact:</h4>
        <p>${contributor.culturalImpact}</p>
        ${contributor.sources && contributor.sources.length > 0 ? `
          <h4>Sources:</h4>
          <ul>
            ${contributor.sources.map(s => `<li><a href="${s}" target="_blank">${s}</a></li>`).join('')}
          </ul>
        ` : ''}
      `;

      panel.hidden = false;
      window.a11y.trapFocus(panel);
    }
  }

  p.windowResized = function() {
    const container = document.getElementById('timeline-canvas');
    if (container) {
      p.resizeCanvas(container.offsetWidth, 500);
    }
  };

  function setupTimelineControls() {
    // View buttons
    const viewBothBtn = document.getElementById('view-both');
    const viewLatinoBtn = document.getElementById('view-latino');
    const viewAllBtn = document.getElementById('view-all');

    if (viewBothBtn) {
      viewBothBtn.addEventListener('click', () => {
        currentView = 'both';
        updateActiveButton([viewBothBtn, viewLatinoBtn, viewAllBtn], viewBothBtn);
      });
    }

    if (viewLatinoBtn) {
      viewLatinoBtn.addEventListener('click', () => {
        currentView = 'latino';
        updateActiveButton([viewBothBtn, viewLatinoBtn, viewAllBtn], viewLatinoBtn);
      });
    }

    if (viewAllBtn) {
      viewAllBtn.addEventListener('click', () => {
        currentView = 'all';
        updateActiveButton([viewBothBtn, viewLatinoBtn, viewAllBtn], viewAllBtn);
      });
    }

    // Close detail panel
    const closeBtn = document.querySelector('.close-panel');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        selectedContributor = null;
        const panel = document.getElementById('detail-panel');
        if (panel) panel.hidden = true;
      });
    }
  }

  function updateActiveButton(buttons, activeBtn) {
    buttons.forEach(btn => {
      if (btn) {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });

    if (activeBtn) {
      activeBtn.classList.add('active');
      activeBtn.setAttribute('aria-pressed', 'true');
    }
  }

  function updateResultCount() {
    const countElement = document.getElementById('result-count');
    if (countElement) {
      const total = latinoData.length + allWomenData.length;
      countElement.textContent = `${total}`;
    }
  }
};

// Initialize when on timeline page
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('timeline-canvas')) {
    new p5(timelineSketch);
  }
});
