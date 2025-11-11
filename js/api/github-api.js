/**
 * github-api.js - GitHub Issues API integration for user contributions
 */

class GitHubAPI {
  constructor() {
    this.owner = 'acsuarez84';
    this.repo = 'Women-Contributors-to-Artificial-Intelligence';
    this.baseURL = 'https://api.github.com';
  }

  /**
   * Create a new issue (contribution)
   */
  async createIssue(title, body, labels = ['contribution']) {
    try {
      const url = `${this.baseURL}/repos/${this.owner}/${this.repo}/issues`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
          title,
          body,
          labels
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, issueUrl: data.html_url, issueNumber: data.number };
    } catch (error) {
      console.error('Error creating issue:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get recent issues (contributions)
   */
  async getRecentIssues(limit = 10) {
    try {
      const url = `${this.baseURL}/repos/${this.owner}/${this.repo}/issues?state=all&per_page=${limit}&labels=contribution`;

      const response = await fetch(url, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, issues: data };
    } catch (error) {
      console.error('Error fetching issues:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Format contribution as issue body
   */
  formatContributionBody(contribution) {
    let body = `## Contribution Type\n${contribution.type}\n\n`;

    if (contribution.page) {
      body += `## Related Page\n${contribution.page}\n\n`;
    }

    if (contribution.currentContent) {
      body += `## Current Content\n\`\`\`\n${contribution.currentContent}\n\`\`\`\n\n`;
    }

    body += `## Proposed Change\n${contribution.proposedChange}\n\n`;

    if (contribution.sources) {
      body += `## Sources\n${contribution.sources}\n\n`;
    }

    if (contribution.contributorName) {
      body += `## Submitted by\n${contribution.contributorName}\n\n`;
    }

    body += `---\n*This contribution was submitted via the site's contribution form.*`;

    return body;
  }
}

// Initialize and set up form if on contribute page
document.addEventListener('DOMContentLoaded', () => {
  window.githubAPI = new GitHubAPI();

  const githubForm = document.getElementById('github-contribution-form');
  if (githubForm) {
    setupGitHubForm(githubForm);
  }

  // Load recent contributions
  const contributionsList = document.getElementById('contributions-list');
  if (contributionsList) {
    loadRecentContributions(contributionsList);
  }
});

/**
 * Set up GitHub contribution form
 */
function setupGitHubForm(form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const statusDiv = document.getElementById('github-status');
    const submitBtn = form.querySelector('button[type="submit"]');

    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    const contribution = {
      type: document.getElementById('contribution-type').value,
      page: document.getElementById('contribution-page').value,
      currentContent: document.getElementById('current-content').value,
      proposedChange: document.getElementById('proposed-change').value,
      sources: document.getElementById('contribution-sources').value,
      contributorName: document.getElementById('contributor-name').value
    };

    // Create issue title
    const title = `[Contribution] ${contribution.type}: ${contribution.page || 'General'}`;
    const body = window.githubAPI.formatContributionBody(contribution);

    // Submit to GitHub
    const result = await window.githubAPI.createIssue(title, body);

    if (result.success) {
      statusDiv.innerHTML = `
        <div class="status-message status-success">
          <h4>✓ Contribution Submitted Successfully!</h4>
          <p>Thank you for your contribution. You can track it here:</p>
          <a href="${result.issueUrl}" target="_blank" rel="noopener" class="btn btn-primary">
            View Your Contribution (Issue #${result.issueNumber}) →
          </a>
        </div>
      `;

      // Clear form
      form.reset();

      // Announce success
      window.a11y.announce('Contribution submitted successfully');
    } else {
      statusDiv.innerHTML = `
        <div class="status-message status-error">
          <h4>Submission Error</h4>
          <p>${window.utils.sanitizeHTML(result.error)}</p>
          <p>Please try again or <a href="https://github.com/${window.githubAPI.owner}/${window.githubAPI.repo}/issues/new" target="_blank" rel="noopener">submit directly on GitHub</a>.</p>
        </div>
      `;
    }

    // Re-enable submit button
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit via GitHub Issues';
  });

  // Cancel button
  const cancelBtn = document.getElementById('cancel-github');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      form.reset();
      const section = document.getElementById('github-contribution-section');
      if (section) section.hidden = true;
    });
  }
}

/**
 * Load and display recent contributions
 */
async function loadRecentContributions(container) {
  window.utils.showLoading(container);

  const result = await window.githubAPI.getRecentIssues(5);

  if (result.success && result.issues.length > 0) {
    const html = result.issues.map(issue => `
      <div class="contribution-item">
        <h4><a href="${issue.html_url}" target="_blank" rel="noopener">${window.utils.sanitizeHTML(issue.title)}</a></h4>
        <p class="contribution-meta">
          #${issue.number} • ${issue.state} • ${new Date(issue.created_at).toLocaleDateString()}
        </p>
        ${issue.labels.length > 0 ? `
          <div class="contribution-labels">
            ${issue.labels.map(label => `<span class="label">${window.utils.sanitizeHTML(label.name)}</span>`).join('')}
          </div>
        ` : ''}
      </div>
    `).join('');

    container.innerHTML = html;
  } else {
    container.innerHTML = `
      <p>No recent contributions found. Be the first to contribute!</p>
      <a href="https://github.com/${window.githubAPI.owner}/${window.githubAPI.repo}/issues" target="_blank" rel="noopener" class="btn btn-secondary">
        View All Contributions on GitHub →
      </a>
    `;
  }
}

// Show/hide contribution forms
document.addEventListener('DOMContentLoaded', () => {
  const showLocalBtn = document.getElementById('show-local-form');
  const showGitHubBtn = document.getElementById('show-github-form');
  const localSection = document.getElementById('local-contribution-section');
  const githubSection = document.getElementById('github-contribution-section');

  if (showLocalBtn && localSection) {
    showLocalBtn.addEventListener('click', () => {
      localSection.hidden = false;
      if (githubSection) githubSection.hidden = true;
      localSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (showGitHubBtn && githubSection) {
    showGitHubBtn.addEventListener('click', () => {
      githubSection.hidden = false;
      if (localSection) localSection.hidden = true;
      githubSection.scrollIntoView({ behavior: 'smooth' });
    });
  }
});

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GitHubAPI;
}
