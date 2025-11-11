/**
 * rhetoric-network.js - P5.js network visualization of rhetoric concepts
 * This creates an interactive node-link diagram showing relationships between concepts
 */

let rhetoricSketch = function(p) {
  let nodes = [];
  let edges = [];
  let selectedNode = null;
  let dragging = null;
  let offsetX = 0, offsetY = 0;
  let showLabels = true;

  // Configuration
  const config = {
    nodeRadius: 30,
    fontSize: 12,
    nodeColors: {
      1: [156, 39, 176],   // Level 1: Purple
      2: [233, 30, 99],    // Level 2: Pink
      3: [33, 150, 243]    // Level 3: Blue
    },
    edgeColor: [180, 180, 180],
    selectedColor: [255, 193, 7],
    textColor: [50, 50, 50]
  };

  p.setup = function() {
    const container = document.getElementById('rhetoric-network-canvas');
    const canvas = p.createCanvas(container.offsetWidth, 600);
    canvas.parent(container);

    // Load data
    loadNetworkData();

    // Set up control buttons
    setupControls();

    // Mark visualization as loaded
    container.classList.add('loaded');
  };

  async function loadNetworkData() {
    const loader = new RhetoricConceptsLoader();
    const data = await loader.load();

    if (data.nodes.length > 0) {
      // Position nodes in a hierarchical layout
      layoutNodes(data.nodes, data.edges);
      edges = data.edges;
    }
  }

  function layoutNodes(nodeData, edgeData) {
    // Simple hierarchical layout by level
    const levels = {};

    nodeData.forEach(node => {
      if (!levels[node.level]) {
        levels[node.level] = [];
      }
      levels[node.level].push(node);
    });

    const levelCount = Object.keys(levels).length;
    const ySpacing = p.height / (levelCount + 1);

    Object.keys(levels).forEach(level => {
      const nodesInLevel = levels[level];
      const xSpacing = p.width / (nodesInLevel.length + 1);

      nodesInLevel.forEach((node, index) => {
        nodes.push({
          ...node,
          x: xSpacing * (index + 1),
          y: ySpacing * parseInt(level),
          vx: 0,
          vy: 0
        });
      });
    });
  }

  p.draw = function() {
    // Theme-aware background
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    p.background(isDark ? 45 : 248);

    // Update text color for theme
    config.textColor = isDark ? [245, 245, 245] : [50, 50, 50];

    // Draw edges
    p.strokeWeight(2);
    p.stroke(...config.edgeColor, 100);
    edges.forEach(edge => {
      const source = nodes.find(n => n.id === edge.source);
      const target = nodes.find(n => n.id === edge.target);

      if (source && target) {
        p.line(source.x, source.y, target.x, target.y);
      }
    });

    // Draw nodes
    nodes.forEach(node => {
      const isSelected = selectedNode && selectedNode.id === node.id;
      const isHovered = !dragging && p.dist(p.mouseX, p.mouseY, node.x, node.y) < config.nodeRadius;

      // Node circle
      p.strokeWeight(isSelected || isHovered ? 3 : 1);
      p.stroke(isSelected ? ...config.selectedColor : 255);
      p.fill(...(config.nodeColors[node.level] || [100, 100, 100]), isHovered ? 255 : 200);
      p.ellipse(node.x, node.y, config.nodeRadius * 2);

      // Node label
      if (showLabels || isHovered || isSelected) {
        p.noStroke();
        p.fill(...config.textColor);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(config.fontSize);
        p.text(node.label, node.x, node.y + config.nodeRadius + 15);
      }
    });

    // Show description for selected node
    if (selectedNode) {
      showNodeDescription(selectedNode);
    }
  };

  function showNodeDescription(node) {
    const padding = 20;
    const boxWidth = 300;
    const boxHeight = 100;

    p.fill(255, 255, 255, 240);
    p.stroke(100);
    p.strokeWeight(1);
    p.rect(10, p.height - boxHeight - 10, boxWidth, boxHeight, 5);

    p.noStroke();
    p.fill(...config.textColor);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(14);
    p.text(node.label, 20, p.height - boxHeight);
    p.textSize(12);
    p.text(node.description, 20, p.height - boxHeight + 25, boxWidth - 20, boxHeight - 40);
  }

  p.mousePressed = function() {
    // Check if clicking on a node
    for (let node of nodes) {
      const d = p.dist(p.mouseX, p.mouseY, node.x, node.y);
      if (d < config.nodeRadius) {
        selectedNode = node;
        dragging = node;
        offsetX = node.x - p.mouseX;
        offsetY = node.y - p.mouseY;
        return false; // Prevent default
      }
    }

    selectedNode = null;
  };

  p.mouseDragged = function() {
    if (dragging) {
      dragging.x = p.mouseX + offsetX;
      dragging.y = p.mouseY + offsetY;
      return false;
    }
  };

  p.mouseReleased = function() {
    dragging = null;
  };

  p.windowResized = function() {
    const container = document.getElementById('rhetoric-network-canvas');
    if (container) {
      p.resizeCanvas(container.offsetWidth, 600);
    }
  };

  function setupControls() {
    const resetBtn = document.getElementById('reset-network');
    const toggleBtn = document.getElementById('toggle-labels');

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        selectedNode = null;
        loadNetworkData();
      });
    }

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        showLabels = !showLabels;
        toggleBtn.textContent = showLabels ? 'Hide Labels' : 'Show Labels';
      });
    }
  }
};

// Initialize the sketch when on the about page
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('rhetoric-network-canvas')) {
    new p5(rhetoricSketch);
  }
});
