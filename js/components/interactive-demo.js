// Interactive LLM Demonstration Component
// Displays sample prompts with pre-recorded and optional live API responses

(function() {
    'use strict';

    let currentPrompt = null;

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        setupPromptDropdown();
        setupEventListeners();
    }

    function setupPromptDropdown() {
        const dropdown = document.getElementById('prompt-dropdown');
        if (!dropdown || typeof SAMPLE_PROMPTS === 'undefined') return;

        // Clear existing options except the placeholder
        dropdown.innerHTML = '<option value="">Select a sample prompt...</option>';

        // Group prompts by theory
        const theoryGroups = {};
        SAMPLE_PROMPTS.forEach(prompt => {
            const mainTheory = prompt.theories[0];
            if (!theoryGroups[mainTheory]) {
                theoryGroups[mainTheory] = [];
            }
            theoryGroups[mainTheory].push(prompt);
        });

        // Add optgroups
        Object.keys(theoryGroups).forEach(theory => {
            const optgroup = document.createElement('optgroup');
            const theoryLabel = THEORY_LABELS[theory] || theory;
            optgroup.label = theoryLabel;

            theoryGroups[theory].forEach(prompt => {
                const option = document.createElement('option');
                option.value = prompt.id;
                option.textContent = `${prompt.language}: ${prompt.prompt.substring(0, 60)}...`;
                optgroup.appendChild(option);
            });

            dropdown.appendChild(optgroup);
        });
    }

    function setupEventListeners() {
        const dropdown = document.getElementById('prompt-dropdown');
        const showPrerecordedBtn = document.getElementById('show-prerecorded-btn');
        const generateLiveBtn = document.getElementById('generate-live-btn');

        if (dropdown) {
            dropdown.addEventListener('change', handlePromptSelection);
        }

        if (showPrerecordedBtn) {
            showPrerecordedBtn.addEventListener('click', showPrerecordedResponses);
        }

        if (generateLiveBtn) {
            generateLiveBtn.addEventListener('click', generateLiveResponses);
        }
    }

    function handlePromptSelection(event) {
        const promptId = parseInt(event.target.value);
        if (!promptId) {
            clearPromptDisplay();
            return;
        }

        currentPrompt = SAMPLE_PROMPTS.find(p => p.id === promptId);
        if (!currentPrompt) return;

        displayPrompt(currentPrompt);
    }

    function displayPrompt(prompt) {
        const promptDisplay = document.getElementById('prompt-display');
        if (!promptDisplay) return;

        // Build theory tags HTML
        const theoryTags = prompt.theories.map(theory => {
            const label = THEORY_LABELS[theory] || theory;
            return `<span class="theory-tag">${label}</span>`;
        }).join(' ');

        const html = `
            <div class="prompt-card">
                <div class="prompt-meta">
                    <span class="language-tag">${prompt.language}</span>
                    ${theoryTags}
                </div>
                <div class="prompt-text">${prompt.prompt}</div>
            </div>
        `;

        promptDisplay.innerHTML = html;

        // Show buttons
        document.getElementById('show-prerecorded-btn').style.display = 'inline-block';
        document.getElementById('generate-live-btn').style.display = 'inline-block';

        // Clear previous responses
        clearResponses();
    }

    function clearPromptDisplay() {
        const promptDisplay = document.getElementById('prompt-display');
        if (promptDisplay) {
            promptDisplay.innerHTML = '';
        }

        document.getElementById('show-prerecorded-btn').style.display = 'none';
        document.getElementById('generate-live-btn').style.display = 'none';

        clearResponses();
    }

    function clearResponses() {
        const responsesGrid = document.getElementById('responses-grid');
        const analysisBox = document.getElementById('analysis-box');

        if (responsesGrid) {
            responsesGrid.innerHTML = '';
            responsesGrid.style.display = 'none';
        }

        if (analysisBox) {
            analysisBox.style.display = 'none';
        }
    }

    function showPrerecordedResponses() {
        if (!currentPrompt) return;

        const responses = PRERECORDED_RESPONSES[currentPrompt.id];
        if (!responses) {
            alert('No pre-recorded responses available for this prompt.');
            return;
        }

        displayResponses(responses, 'pre-recorded');
    }

    async function generateLiveResponses() {
        if (!currentPrompt) return;

        // Check if API keys are available
        const hasKeys = checkAPIKeys();
        if (!hasKeys) {
            alert('Live API generation requires API keys. Please set up your API keys in the "Live Experimentation" section or use pre-recorded responses.');
            return;
        }

        // Show loading state
        showLoadingState();

        try {
            // Call APIs (this would use the existing llm-apis.js functionality)
            const responses = await callLLMAPIs(currentPrompt.prompt);
            displayResponses(responses, 'live');
        } catch (error) {
            console.error('Error generating live responses:', error);
            alert('Error generating live responses. Please check your API keys and try again.');
            clearResponses();
        }
    }

    function checkAPIKeys() {
        // Check localStorage for API keys (simplified)
        const claudeKey = localStorage.getItem('claude-api-key');
        const openaiKey = localStorage.getItem('openai-api-key');
        const geminiKey = localStorage.getItem('gemini-api-key');

        return claudeKey || openaiKey || geminiKey;
    }

    function showLoadingState() {
        const responsesGrid = document.getElementById('responses-grid');
        if (!responsesGrid) return;

        responsesGrid.style.display = 'grid';
        responsesGrid.innerHTML = `
            <div class="response-panel loading">
                <h5>Claude</h5>
                <div class="loading-spinner">Loading...</div>
            </div>
            <div class="response-panel loading">
                <h5>ChatGPT</h5>
                <div class="loading-spinner">Loading...</div>
            </div>
            <div class="response-panel loading">
                <h5>Gemini</h5>
                <div class="loading-spinner">Loading...</div>
            </div>
            <div class="response-panel loading">
                <h5>Co-Pilot</h5>
                <div class="loading-spinner">Loading...</div>
            </div>
        `;
    }

    async function callLLMAPIs(prompt) {
        // This is a placeholder for actual API calls
        // In production, this would call the llm-apis.js module
        // For now, return empty responses to indicate live generation
        return {
            claude: 'Live API response would appear here...',
            chatgpt: 'Live API response would appear here...',
            gemini: 'Live API response would appear here...',
            copilot: 'Live API response would appear here...'
        };
    }

    function displayResponses(responses, mode) {
        const responsesGrid = document.getElementById('responses-grid');
        const analysisBox = document.getElementById('analysis-box');

        if (!responsesGrid || !analysisBox) return;

        responsesGrid.style.display = 'grid';
        analysisBox.style.display = 'block';

        // Build responses HTML
        responsesGrid.innerHTML = `
            <div class="response-panel">
                <h5>Claude</h5>
                <div class="response-content">${responses.claude}</div>
                <div class="response-tags">
                    <span class="tag tag-positive">Culturally sensitive</span>
                </div>
            </div>
            <div class="response-panel">
                <h5>ChatGPT</h5>
                <div class="response-content">${responses.chatgpt}</div>
                <div class="response-tags">
                    <span class="tag tag-neutral">Balanced</span>
                </div>
            </div>
            <div class="response-panel">
                <h5>Gemini</h5>
                <div class="response-content">${responses.gemini}</div>
                <div class="response-tags">
                    <span class="tag tag-neutral">Middle ground</span>
                </div>
            </div>
            <div class="response-panel">
                <h5>Co-Pilot</h5>
                <div class="response-content">${responses.copilot}</div>
                <div class="response-tags">
                    <span class="tag tag-negative">Prescriptive</span>
                </div>
            </div>
        `;

        // Display analysis
        const modeLabel = mode === 'pre-recorded' ? 'Pre-recorded' : 'Live';
        analysisBox.innerHTML = generateAnalysis(currentPrompt, responses, mode);
    }

    function generateAnalysis(prompt, responses, mode) {
        const theoryLabels = prompt.theories.map(t => THEORY_LABELS[t]).join(', ');

        return `
            <h4>Analysis</h4>
            <p><strong>Theories at Play:</strong> ${theoryLabels}</p>
            <p><strong>Key Observations:</strong></p>
            <ul>
                <li><strong>Claude</strong> typically recognizes code-switching as rhetorical sophistication and validates cultural identity</li>
                <li><strong>ChatGPT</strong> often suggests "adaptation" while trying to balance identity with convention</li>
                <li><strong>Gemini</strong> provides middle-ground responses that acknowledge both sides</li>
                <li><strong>Co-Pilot</strong> tends to enforce standard conventions most strongly</li>
            </ul>
            <div class="callout callout-info">
                <p><strong>Important:</strong> These ${mode} responses show typical patterns in how each LLM handles multilingual, multicultural rhetoric. Users must critically evaluate all LLM suggestions based on their own rhetorical goals, not assume the AI knows what's "correct."</p>
            </div>
        `;
    }

    // Expose functions for external use if needed
    window.interactiveDemo = {
        displayPrompt,
        showPrerecordedResponses,
        generateLiveResponses
    };

})();
