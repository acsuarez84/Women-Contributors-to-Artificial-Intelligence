/**
 * timeline-data.js - Load and manage Latino women contributors data
 */

class TimelineDataLoader {
  constructor() {
    this.data = [];
    this.allData = [];
    this.isLoaded = false;
  }

  async loadLatino() {
    try {
      const response = await fetch('../data/contributors-latino.json');
      if (!response.ok) throw new Error('Failed to load Latino contributors data');
      this.data = await response.json();
      this.isLoaded = true;
      return this.data;
    } catch (error) {
      console.error('Error loading Latino contributors:', error);
      return [];
    }
  }

  filterByEra(startYear, endYear) {
    return this.data.filter(contributor => {
      return contributor.birthYear >= startYear &&
             contributor.birthYear <= endYear;
    });
  }

  filterByField(field) {
    if (field === 'all') return this.data;
    return this.data.filter(contributor => {
      return contributor.field.toLowerCase().includes(field.toLowerCase());
    });
  }

  search(query) {
    const lowerQuery = query.toLowerCase();
    return this.data.filter(contributor => {
      return contributor.name.toLowerCase().includes(lowerQuery) ||
             contributor.contributions.some(c => c.toLowerCase().includes(lowerQuery)) ||
             contributor.culturalImpact.toLowerCase().includes(lowerQuery);
    });
  }

  sortByYear(ascending = true) {
    return [...this.data].sort((a, b) => {
      return ascending ? a.birthYear - b.birthYear : b.birthYear - a.birthYear;
    });
  }

  getById(id) {
    return this.data.find(contributor => contributor.id === id);
  }

  getAll() {
    return this.data;
  }
}

// Make globally available
if (typeof window !== 'undefined') {
  window.TimelineDataLoader = TimelineDataLoader;
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TimelineDataLoader;
}
