/**
 * theory-llm-map.js - Interactive concept map showing relationships between
 * rhetoric theories, LLMs, and implications for Latino women's rhetoric
 */

let theoryLLMSketch = function(p) {
  let data = null;
  let nodes = [];
  let edges = [];
  let hoveredNode = null;
  let hoveredEdge = null;
  let selectedNode = null;

  // Configuration
  const config = {
    theoryNodeRadius: 40,
    llmNodeWidth: 120,
    llmNodeHeight: 60,
    fontSize: 11,
    labelFontSize: 10,
    colors: {
      theory: [156, 39, 176],         // Purple
      llm: [255, 152, 0],              // Orange
      complementary: [76, 175, 80],    // Green
      tension: [244, 67, 54],          // Red
      llmFailure: [255, 152, 0],       // Orange
      hover: [255, 193, 7],            // Yellow
      background: {
        light: 248,
        dark: 45
      },
      text: {
        light: [50, 50, 50],
        dark: [245, 245, 245]
      }
    }
  };

  p.setup = function() {
    const container = document.getElementById('theory-llm-canvas');
    if (!container) return;

    const canvas = p.createCanvas(container.offsetWidth, 800);
    canvas.parent(container);

    // Load data
    loadMapData();

    // Mark visualization as loaded
    container.classList.add('loaded');
  };

  async function loadMapData() {
    try {
      const response = await fetch('../data/theory-llm-network.json');
      data = await response.json();

      if (data && data.nodes && data.edges) {
        layoutNodes(data.nodes);
        edges = data.edges;
      }
    } catch (error) {
      console.error('Error loading theory-LLM network data:', error);
    }
  }

  function layoutNodes(nodeData) {
    // Separate theories and LLMs
    const theories = nodeData.filter(n => n.type === 'theory');
    const llms = nodeData.filter(n => n.type === 'llm');

    // Theories on left side (arranged in 2 columns of 3)
    const theoryYStart = 150;
    const theoryYSpacing = 200;
    const theoryXLeft = 150;
    const theoryXRight = 350;

    theories.forEach((theory, index) => {
      const col = Math.floor(index / 3);
      const row = index % 3;
      nodes.push({
        ...theory,
        x: col === 0 ? theoryXLeft : theoryXRight,
        y: theoryYStart + (row * theoryYSpacing)
      });
    });

    // LLMs on right side (stacked vertically)
    const llmX = p.width - 200;
    const llmYStart = 200;
    const llmYSpacing = 150;

    llms.forEach((llm, index) => {
      nodes.push({
        ...llm,
        x: llmX,
        y: llmYStart + (index * llmYSpacing)
      });
    });
  }

  p.draw = function() {
    // Theme-aware background
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    p.background(isDark ? config.colors.background.dark : config.colors.background.light);
    const textColor = isDark ? config.colors.text.dark : config.colors.text.light;

    if (!data || nodes.length === 0) {
      // Show loading message
      p.fill(...textColor);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(16);
      p.text('Loading concept map...', p.width / 2, p.height / 2);
      return;
    }

    // Update hovered elements
    updateHover();

    // Draw edges first (behind nodes)
    drawEdges(textColor);

    // Draw nodes
    drawNodes(textColor);

    // Draw legend
    drawLegend(textColor, isDark);

    // Draw hover tooltip
    if (hoveredNode || hoveredEdge) {
      drawTooltip(textColor, isDark);
    }
  };

  function updateHover() {
    hoveredNode = null;
    hoveredEdge = null;

    // Check node hover
    for (let node of nodes) {
      if (isPointInNode(p.mouseX, p.mouseY, node)) {
        hoveredNode = node;
        return;
      }
    }

    // Check edge hover (only if not hovering on node)
    for (let edge of edges) {
      if (isPointNearEdge(p.mouseX, p.mouseY, edge)) {
        hoveredEdge = edge;
        return;
      }
    }
  }

  function isPointInNode(px, py, node) {
    if (node.type === 'theory') {
      return p.dist(px, py, node.x, node.y) < config.theoryNodeRadius;
    } else {
      // Rectangle for LLM nodes
      return px > node.x - config.llmNodeWidth / 2 &&
             px < node.x + config.llmNodeWidth / 2 &&
             py > node.y - config.llmNodeHeight / 2 &&
             py < node.y + config.llmNodeHeight / 2;
    }
  }

  function isPointNearEdge(px, py, edge) {
    const source = nodes.find(n => n.id === edge.source);
    const target = nodes.find(n => n.id === edge.target);

    if (!source || !target) return false;

    // Calculate distance from point to line segment
    const distToLine = distanceToLineSegment(px, py, source.x, source.y, target.x, target.y);
    return distToLine < 10;
  }

  function distanceToLineSegment(px, py, x1, y1, x2, y2) {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;

    if (lenSq !== 0) param = dot / lenSq;

    let xx, yy;

    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function drawEdges(textColor) {
    edges.forEach(edge => {
      const source = nodes.find(n => n.id === edge.source);
      const target = nodes.find(n => n.id === edge.target);

      if (!source || !target) return;

      const isHovered = hoveredEdge === edge;
      const alpha = isHovered ? 255 : 120;

      // Set edge style based on type
      p.strokeWeight(isHovered ? 3 : 2);

      if (edge.type === 'complementary') {
        p.stroke(...config.colors.complementary, alpha);
        p.drawingContext.setLineDash([]);
      } else if (edge.type === 'tension') {
        p.stroke(...config.colors.tension, alpha);
        p.drawingContext.setLineDash([10, 5]);
      } else if (edge.type === 'llm-failure') {
        p.stroke(...config.colors.llmFailure, alpha);
        p.drawingContext.setLineDash([2, 4]);
      }

      p.line(source.x, source.y, target.x, target.y);

      // Reset line dash
      p.drawingContext.setLineDash([]);
    });
  }

  function drawNodes(textColor) {
    nodes.forEach(node => {
      const isHovered = hoveredNode === node;
      const isSelected = selectedNode === node;

      if (node.type === 'theory') {
        // Draw theory node (circle)
        p.strokeWeight(isHovered || isSelected ? 3 : 2);
        p.stroke(isHovered ? ...config.colors.hover : 255);
        p.fill(...node.color, isHovered ? 255 : 200);
        p.ellipse(node.x, node.y, config.theoryNodeRadius * 2);

        // Label below
        p.noStroke();
        p.fill(...textColor);
        p.textAlign(p.CENTER, p.TOP);
        p.textSize(config.labelFontSize);
        const lines = splitText(node.label, 20);
        lines.forEach((line, i) => {
          p.text(line, node.x, node.y + config.theoryNodeRadius + 5 + (i * 12));
        });

      } else if (node.type === 'llm') {
        // Draw LLM node (rounded rectangle)
        p.strokeWeight(isHovered || isSelected ? 3 : 2);
        p.stroke(isHovered ? ...config.colors.hover : 255);
        p.fill(...node.color, isHovered ? 255 : 200);
        p.rect(
          node.x - config.llmNodeWidth / 2,
          node.y - config.llmNodeHeight / 2,
          config.llmNodeWidth,
          config.llmNodeHeight,
          8
        );

        // Label inside
        p.noStroke();
        p.fill(255); // White text on orange background
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(config.fontSize);
        p.text(node.label, node.x, node.y);
      }
    });
  }

  function drawLegend(textColor, isDark) {
    const legendX = 20;
    const legendY = p.height - 100;
    const lineLength = 40;
    const spacing = 120;

    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(11);
    p.fill(...textColor);

    // Complementary
    p.stroke(...config.colors.complementary);
    p.strokeWeight(2);
    p.drawingContext.setLineDash([]);
    p.line(legendX, legendY, legendX + lineLength, legendY);
    p.noStroke();
    p.text('Complementary', legendX + lineLength + 5, legendY);

    // Tension
    p.stroke(...config.colors.tension);
    p.strokeWeight(2);
    p.drawingContext.setLineDash([10, 5]);
    p.line(legendX + spacing, legendY + 25, legendX + spacing + lineLength, legendY + 25);
    p.drawingContext.setLineDash([]);
    p.noStroke();
    p.text('Tension', legendX + spacing + lineLength + 5, legendY + 25);

    // LLM Limitation
    p.stroke(...config.colors.llmFailure);
    p.strokeWeight(2);
    p.drawingContext.setLineDash([2, 4]);
    p.line(legendX + spacing * 2, legendY + 50, legendX + spacing * 2 + lineLength, legendY + 50);
    p.drawingContext.setLineDash([]);
    p.noStroke();
    p.text('LLM Limitation', legendX + spacing * 2 + lineLength + 5, legendY + 50);
  }

  function drawTooltip(textColor, isDark) {
    let tooltipText = '';

    if (hoveredNode) {
      tooltipText = hoveredNode.shortDescription || hoveredNode.label;
    } else if (hoveredEdge) {
      tooltipText = hoveredEdge.relationship ||
                    hoveredEdge.failure ||
                    `${hoveredEdge.source} → ${hoveredEdge.target}`;
    }

    if (!tooltipText) return;

    const padding = 15;
    const maxWidth = 300;
    const lines = wrapText(tooltipText, maxWidth - padding * 2);
    const lineHeight = 16;
    const boxHeight = lines.length * lineHeight + padding * 2;

    let tooltipX = p.mouseX + 15;
    let tooltipY = p.mouseY - 10;

    // Keep tooltip on screen
    if (tooltipX + maxWidth > p.width) tooltipX = p.mouseX - maxWidth - 15;
    if (tooltipY + boxHeight > p.height) tooltipY = p.height - boxHeight - 10;
    if (tooltipY < 0) tooltipY = 10;

    // Draw tooltip box
    p.fill(isDark ? 50 : 255, 250);
    p.stroke(isDark ? 150 : 100);
    p.strokeWeight(1);
    p.rect(tooltipX, tooltipY, maxWidth, boxHeight, 5);

    // Draw text
    p.noStroke();
    p.fill(...textColor);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(12);
    lines.forEach((line, i) => {
      p.text(line, tooltipX + padding, tooltipY + padding + (i * lineHeight));
    });
  }

  function splitText(text, maxChars) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    words.forEach(word => {
      if ((currentLine + word).length > maxChars) {
        if (currentLine) lines.push(currentLine.trim());
        currentLine = word + ' ';
      } else {
        currentLine += word + ' ';
      }
    });

    if (currentLine) lines.push(currentLine.trim());
    return lines;
  }

  function wrapText(text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    p.textSize(12);
    words.forEach(word => {
      const testLine = currentLine + word + ' ';
      const testWidth = p.textWidth(testLine);

      if (testWidth > maxWidth && currentLine !== '') {
        lines.push(currentLine.trim());
        currentLine = word + ' ';
      } else {
        currentLine = testLine;
      }
    });

    if (currentLine) lines.push(currentLine.trim());
    return lines;
  }

  p.mouseClicked = function() {
    if (hoveredNode) {
      selectedNode = hoveredNode;
      showNodeModal(hoveredNode);
      return false;
    }

    if (hoveredEdge) {
      showEdgeModal(hoveredEdge);
      return false;
    }
  };

  function showNodeModal(node) {
    const modal = document.getElementById('concept-modal');
    const modalBody = document.getElementById('modal-body');

    if (!modal || !modalBody) return;

    let content = '';

    if (node.type === 'theory') {
      content = `
        <h3>${node.label}</h3>
        <p><strong>Overview:</strong> ${node.fullDescription}</p>
        <div class="modal-section">
          <h4>LLM Impact</h4>
          <p>${node.llmImpact}</p>
        </div>
        <div class="modal-section">
          <h4>Connection to Women in Timeline</h4>
          <p>${node.timelineConnection}</p>
        </div>
      `;
    } else if (node.type === 'llm') {
      content = `
        <h3>${node.label}</h3>
        <p><strong>How It Functions:</strong> ${node.functionality}</p>
        <div class="modal-section">
          <h4>Rhetorical Implications</h4>
          <p>${node.rhetoricalImplications}</p>
        </div>
        <div class="modal-section">
          <h4>Impact on Timeline Women Contributors</h4>
          <p>${node.timelineWomen}</p>
        </div>
      `;
    }

    modalBody.innerHTML = content;
    modal.style.display = 'block';
  }

  function showEdgeModal(edge) {
    const modal = document.getElementById('concept-modal');
    const modalBody = document.getElementById('modal-body');

    if (!modal || !modalBody) return;

    const source = nodes.find(n => n.id === edge.source);
    const target = nodes.find(n => n.id === edge.target);

    if (!source || !target) return;

    let content = `
      <h3>${source.label} ↔ ${target.label}</h3>
    `;

    if (edge.type === 'complementary') {
      content += `
        <p class="edge-type" style="color: rgb(76, 175, 80);"><strong>Complementary Relationship</strong></p>
        <p>${edge.relationship}</p>
        <div class="modal-section">
          <h4>Implications for Women Contributors</h4>
          <p>${edge.womenImplication}</p>
        </div>
      `;
    } else if (edge.type === 'tension') {
      content += `
        <p class="edge-type" style="color: rgb(244, 67, 54);"><strong>Tension</strong></p>
        <p>${edge.relationship}</p>
        <div class="modal-section">
          <h4>Implications for Women Contributors</h4>
          <p>${edge.womenImplication}</p>
        </div>
      `;
    } else if (edge.type === 'llm-failure') {
      content += `
        <p class="edge-type" style="color: rgb(255, 152, 0);"><strong>LLM Limitation</strong></p>
        <p><strong>How ${target.label} Fails:</strong> ${edge.failure}</p>
        <div class="modal-section">
          <h4>Impact on Latino Women</h4>
          <p>${edge.womenImpact}</p>
        </div>
      `;
    }

    modalBody.innerHTML = content;
    modal.style.display = 'block';
  }

  p.windowResized = function() {
    const container = document.getElementById('theory-llm-canvas');
    if (container && data && data.nodes) {
      p.resizeCanvas(container.offsetWidth, 800);
      // Reposition nodes for new width
      layoutNodes(data.nodes);
    }
  };
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('theory-llm-canvas')) {
    new p5(theoryLLMSketch);

    // Set up modal close functionality
    const modal = document.getElementById('concept-modal');
    const closeBtn = document.querySelector('.modal-close');

    if (closeBtn) {
      closeBtn.onclick = function() {
        modal.style.display = 'none';
      };
    }

    if (modal) {
      window.onclick = function(event) {
        if (event.target === modal) {
          modal.style.display = 'none';
        }
      };
    }
  }
});
