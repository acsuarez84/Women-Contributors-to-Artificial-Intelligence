/**
 * rhetoric-concepts.js - Load and manage rhetoric concepts network data
 */

class RhetoricConceptsLoader {
  constructor() {
    this.nodes = [];
    this.edges = [];
    this.isLoaded = false;
  }

  async load() {
    try {
      const response = await fetch('../data/rhetoric-concepts.json');
      if (!response.ok) throw new Error('Failed to load rhetoric concepts data');
      const data = await response.json();
      this.nodes = data.nodes;
      this.edges = data.edges;
      this.isLoaded = true;
      return { nodes: this.nodes, edges: this.edges };
    } catch (error) {
      console.error('Error loading rhetoric concepts:', error);
      return { nodes: [], edges: [] };
    }
  }

  getNodeById(id) {
    return this.nodes.find(node => node.id === id);
  }

  getConnectedNodes(nodeId) {
    const connected = new Set();

    this.edges.forEach(edge => {
      if (edge.source === nodeId) {
        connected.add(edge.target);
      }
      if (edge.target === nodeId) {
        connected.add(edge.source);
      }
    });

    return Array.from(connected).map(id => this.getNodeById(id));
  }

  getNodesByLevel(level) {
    return this.nodes.filter(node => node.level === level);
  }

  getEdgesBetween(sourceId, targetId) {
    return this.edges.filter(edge =>
      (edge.source === sourceId && edge.target === targetId) ||
      (edge.source === targetId && edge.target === sourceId)
    );
  }

  getAllNodes() {
    return this.nodes;
  }

  getAllEdges() {
    return this.edges;
  }
}

// Make globally available
if (typeof window !== 'undefined') {
  window.RhetoricConceptsLoader = RhetoricConceptsLoader;
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RhetoricConceptsLoader;
}
