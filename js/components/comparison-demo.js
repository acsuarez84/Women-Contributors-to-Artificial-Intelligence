/**
 * comparison-demo.js - Handle pre-recorded comparison demonstrations
 */

class ComparisonDemo {
  constructor() {
    this.init();
  }

  init() {
    this.setupModeToggle();
    this.setupExampleButtons();
  }

  /**
   * Set up demo mode toggle (pre-recorded vs live)
   */
  setupModeToggle() {
    const prerecordedCard = document.getElementById('mode-prerecorded');
    const liveCard = document.getElementById('mode-live');
    const prerecordedContent = document.getElementById('prerecorded-content');
    const liveContent = document.getElementById('live-content');

    if (!prerecordedCard || !liveCard) return;

    prerecordedCard.addEventListener('click', () => {
      prerecordedCard.classList.add('active');
      liveCard.classList.remove('active');
      if (prerecordedContent) prerecordedContent.hidden = false;
      if (liveContent) liveContent.hidden = true;
    });

    liveCard.addEventListener('click', () => {
      liveCard.classList.add('active');
      prerecordedCard.classList.remove('active');
      if (liveContent) liveContent.hidden = false;
      if (prerecordedContent) prerecordedContent.hidden = true;
    });
  }

  /**
   * Set up example prompt buttons
   */
  setupExampleButtons() {
    const buttons = document.querySelectorAll('.example-btn');
    const display = document.getElementById('example-display');

    if (!display) return;

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const exampleId = btn.dataset.example;
        this.loadExample(exampleId, display);

        // Update active state
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  }

  /**
   * Load and display an example
   */
  loadExample(id, container) {
    const example = window.examplePrompts[id];

    if (!example) {
      container.innerHTML = '<p>Example not found.</p>';
      container.hidden = false;
      return;
    }

    const html = `
      <div class="example-content">
        <h4>${window.utils.sanitizeHTML(example.title)}</h4>

        <div class="prompt-box">
          <h5>Prompt:</h5>
          <p class="prompt-text">${window.utils.sanitizeHTML(example.prompt)}</p>
        </div>

        <div class="responses-grid">
          ${this.renderResponse('Claude', example.responses.claude)}
          ${this.renderResponse('ChatGPT', example.responses.chatgpt)}
          ${example.responses.gemini ? this.renderResponse('Gemini', example.responses.gemini) : ''}
        </div>

        <div class="analysis-box">
          <h5>Analysis</h5>
          <p>${window.utils.sanitizeHTML(example.analysis)}</p>
        </div>
      </div>
    `;

    container.innerHTML = html;
    container.hidden = false;
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /**
   * Render a single LLM response
   */
  renderResponse(llmName, response) {
    const tagsHTML = response.tags.map(tag => {
      const tagClass = this.getTagClass(tag);
      return `<span class="tag ${tagClass}">${window.utils.sanitizeHTML(tag)}</span>`;
    }).join('');

    return `
      <div class="response-panel">
        <h5>${window.utils.sanitizeHTML(llmName)}</h5>
        <div class="response-content">
          <p class="response-text">${window.utils.sanitizeHTML(response.text)}</p>
        </div>
        <div class="response-tags">
          ${tagsHTML}
        </div>
      </div>
    `;
  }

  /**
   * Determine tag class based on content
   */
  getTagClass(tag) {
    const lowerTag = tag.toLowerCase();

    if (lowerTag.includes('validates') ||
        lowerTag.includes('respects') ||
        lowerTag.includes('preserves') ||
        lowerTag.includes('acknowledges')) {
      return 'tag-positive';
    }

    if (lowerTag.includes('suggests translation') ||
        lowerTag.includes('enforces') ||
        lowerTag.includes('erases') ||
        lowerTag.includes('assumes')) {
      return 'tag-negative';
    }

    return 'tag-neutral';
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.demo-interface') ||
      document.querySelector('.mode-selection')) {
    window.comparisonDemo = new ComparisonDemo();
  }
});

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ComparisonDemo;
}
