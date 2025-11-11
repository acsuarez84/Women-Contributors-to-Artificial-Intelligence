/**
 * timeline-data-all.js - Load and manage all women contributors data
 */

class AllWomenDataLoader {
  constructor() {
    this.data = [];
    this.isLoaded = false;
  }

  async loadAll() {
    try {
      const response = await fetch('../data/contributors-all.json');
      if (!response.ok) throw new Error('Failed to load all contributors data');
      this.data = await response.json();
      this.isLoaded = true;
      return this.data;
    } catch (error) {
      console.error('Error loading all contributors:', error);
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
  window.AllWomenDataLoader = AllWomenDataLoader;
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AllWomenDataLoader;
}
