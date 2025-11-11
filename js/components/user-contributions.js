/**
 * user-contributions.js - Additional user contribution handlers and utilities
 */

// This file can be used for additional contribution-related functionality
// such as validation, formatting, or advanced features

class ContributionValidator {
  static validateTimelineEntry(entry) {
    const errors = [];

    if (!entry.name || entry.name.trim() === '') {
      errors.push('Name is required');
    }

    if (!entry.birthYear || isNaN(entry.birthYear)) {
      errors.push('Valid birth year is required');
    }

    if (entry.deathYear && isNaN(entry.deathYear)) {
      errors.push('Death year must be a valid number');
    }

    if (!entry.field || entry.field.trim() === '') {
      errors.push('Field is required');
    }

    if (!entry.contributions || entry.contributions.length === 0) {
      errors.push('At least one contribution is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static sanitizeEntry(entry) {
    return {
      name: window.utils.sanitizeHTML(entry.name),
      birthYear: parseInt(entry.birthYear),
      deathYear: entry.deathYear ? parseInt(entry.deathYear) : null,
      field: window.utils.sanitizeHTML(entry.field),
      contributions: entry.contributions.map(c => window.utils.sanitizeHTML(c)),
      culturalImpact: window.utils.sanitizeHTML(entry.culturalImpact),
      sources: entry.sources ? entry.sources.map(s => window.utils.sanitizeHTML(s)) : []
    };
  }
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ContributionValidator;
}
