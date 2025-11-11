/**
 * llm-apis.js - Integration with LLM APIs (Claude, OpenAI, Gemini)
 * Uses user-provided API keys stored in localStorage
 */

class LLMAPIManager {
  constructor() {
    this.storage = new LocalStorageManager('llm-api-keys');
  }

  /**
   * Get stored API keys
   */
  getKeys() {
    return {
      claude: this.storage.getItem('claude') || '',
      openai: this.storage.getItem('openai') || '',
      gemini: this.storage.getItem('gemini') || ''
    };
  }

  /**
   * Save API keys
   */
  saveKeys(keys) {
    if (keys.claude) this.storage.setItem('claude', keys.claude);
    if (keys.openai) this.storage.setItem('openai', keys.openai);
    if (keys.gemini) this.storage.setItem('gemini', keys.gemini);
  }

  /**
   * Clear all API keys
   */
  clearKeys() {
    this.storage.clear();
  }

  /**
   * Check which APIs have keys configured
   */
  getAvailableAPIs() {
    const keys = this.getKeys();
    return {
      claude: !!keys.claude,
      openai: !!keys.openai,
      gemini: !!keys.gemini
    };
  }

  /**
   * Call Claude API
   */
  async callClaude(prompt) {
    const key = this.storage.getItem('claude');
    if (!key) {
      return { error: 'No Claude API key configured' };
    }

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': key,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1024,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, text: data.content[0].text };
    } catch (error) {
      console.error('Claude API error:', error);
      return { error: error.message };
    }
  }

  /**
   * Call OpenAI API
   */
  async callOpenAI(prompt) {
    const key = this.storage.getItem('openai');
    if (!key) {
      return { error: 'No OpenAI API key configured' };
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1024
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, text: data.choices[0].message.content };
    } catch (error) {
      console.error('OpenAI API error:', error);
      return { error: error.message };
    }
  }

  /**
   * Call Gemini API
   */
  async callGemini(prompt) {
    const key = this.storage.getItem('gemini');
    if (!key) {
      return { error: 'No Gemini API key configured' };
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${key}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, text: data.candidates[0].content.parts[0].text };
    } catch (error) {
      console.error('Gemini API error:', error);
      return { error: error.message };
    }
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.llmAPI = new LLMAPIManager();

  // Set up API keys form if it exists
  const apiForm = document.getElementById('api-keys-form');
  if (apiForm) {
    setupAPIKeysForm(apiForm);
  }

  // Set up live prompt form if it exists
  const liveForm = document.getElementById('live-prompt-form');
  if (liveForm) {
    setupLivePromptForm(liveForm);
  }
});

/**
 * Set up API keys form
 */
function setupAPIKeysForm(form) {
  // Load existing keys (masked)
  const keys = window.llmAPI.getKeys();
  if (keys.claude) document.getElementById('claude-key').placeholder = '••••••••';
  if (keys.openai) document.getElementById('openai-key').placeholder = '••••••••';
  if (keys.gemini) document.getElementById('gemini-key').placeholder = '••••••••';

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const newKeys = {
      claude: document.getElementById('claude-key').value,
      openai: document.getElementById('openai-key').value,
      gemini: document.getElementById('gemini-key').value
    };

    window.llmAPI.saveKeys(newKeys);

    const statusDiv = document.getElementById('api-status');
    statusDiv.innerHTML = `
      <div class="status-message status-success">
        <p>✓ API keys saved securely in your browser's localStorage</p>
        <p><small>Note: These keys never leave your browser and are not sent to our servers.</small></p>
      </div>
    `;

    // Clear form
    form.reset();

    window.a11y.announce('API keys saved');
  });

  // Clear keys button
  const clearBtn = document.getElementById('clear-keys');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Clear all saved API keys?')) {
        window.llmAPI.clearKeys();
        form.reset();
        document.getElementById('claude-key').placeholder = 'sk-ant-...';
        document.getElementById('openai-key').placeholder = 'sk-...';
        document.getElementById('gemini-key').placeholder = 'AIza...';

        const statusDiv = document.getElementById('api-status');
        statusDiv.innerHTML = `
          <div class="status-message status-info">
            <p>All API keys cleared</p>
          </div>
        `;

        window.a11y.announce('API keys cleared');
      }
    });
  }
}

/**
 * Set up live prompt form
 */
function setupLivePromptForm(form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const prompt = document.getElementById('live-prompt').value;
    const selectedLLMs = Array.from(form.querySelectorAll('input[name="llm"]:checked'))
      .map(cb => cb.value);

    if (!prompt || selectedLLMs.length === 0) {
      alert('Please enter a prompt and select at least one LLM');
      return;
    }

    const resultsDiv = document.getElementById('live-results');
    resultsDiv.innerHTML = '<div class="loading-message">Querying LLMs...</div>';

    const results = {};

    // Query each selected LLM
    for (const llm of selectedLLMs) {
      let result;
      switch (llm) {
        case 'claude':
          result = await window.llmAPI.callClaude(prompt);
          break;
        case 'openai':
          result = await window.llmAPI.callOpenAI(prompt);
          break;
        case 'gemini':
          result = await window.llmAPI.callGemini(prompt);
          break;
      }
      results[llm] = result;
    }

    // Display results
    displayLiveResults(results, resultsDiv);
  });
}

/**
 * Display live API results
 */
function displayLiveResults(results, container) {
  const llmNames = {
    claude: 'Claude',
    openai: 'ChatGPT',
    gemini: 'Gemini'
  };

  const html = Object.entries(results).map(([llm, result]) => {
    if (result.error) {
      return `
        <div class="response-panel error">
          <h5>${llmNames[llm]}</h5>
          <p class="error-message">Error: ${window.utils.sanitizeHTML(result.error)}</p>
        </div>
      `;
    } else {
      return `
        <div class="response-panel">
          <h5>${llmNames[llm]}</h5>
          <div class="response-content">
            <p>${window.utils.sanitizeHTML(result.text)}</p>
          </div>
        </div>
      `;
    }
  }).join('');

  container.innerHTML = `<div class="responses-grid">${html}</div>`;
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LLMAPIManager;
}
