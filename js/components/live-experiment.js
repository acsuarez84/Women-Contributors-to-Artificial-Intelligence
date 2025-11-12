// Live Experimentation Component
// Handles custom prompts, LLM interface embedding, response analysis

(function() {
    'use strict';

    // LLM configuration
    const LLM_URLS = {
        claude: 'https://claude.ai/new',
        chatgpt: 'https://chat.openai.com/',
        gemini: 'https://gemini.google.com/',
        copilot: 'https://copilot.microsoft.com/'
    };

    const LLM_NAMES = {
        claude: 'Claude',
        chatgpt: 'ChatGPT',
        gemini: 'Gemini',
        copilot: 'Co-Pilot'
    };

    let debounceTimer = null;
    let currentPrompt = '';
    let selectedTheories = [];

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        setupEventListeners();
        initializeTheorySelection();
    }

    function setupEventListeners() {
        const tryLLMsBtn = document.getElementById('try-llms-btn');
        const responseTextarea = document.getElementById('response-textarea');
        const theoryCheckboxes = document.querySelectorAll('input[name="theory"]');
        const customPromptInput = document.getElementById('custom-prompt');

        if (tryLLMsBtn) {
            tryLLMsBtn.addEventListener('click', handleTryLLMs);
        }

        if (responseTextarea) {
            responseTextarea.addEventListener('input', handleResponseInput);
        }

        if (theoryCheckboxes) {
            theoryCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', handleTheoryChange);
            });
        }

        if (customPromptInput) {
            customPromptInput.addEventListener('input', handlePromptInput);
        }
    }

    function initializeTheorySelection() {
        // Default to selecting the first theory
        const firstCheckbox = document.querySelector('input[name="theory"]');
        if (firstCheckbox && !getSelectedTheories().length) {
            firstCheckbox.checked = true;
            updateSelectedTheories();
        }
    }

    function handlePromptInput(event) {
        currentPrompt = event.target.value.trim();

        // Enable/disable Try LLMs button based on prompt
        const tryLLMsBtn = document.getElementById('try-llms-btn');
        if (tryLLMsBtn) {
            tryLLMsBtn.disabled = currentPrompt.length === 0;
        }
    }

    function handleTryLLMs() {
        const promptInput = document.getElementById('custom-prompt');
        const prompt = promptInput ? promptInput.value.trim() : '';

        if (!prompt) {
            alert('Please enter a prompt first.');
            return;
        }

        currentPrompt = prompt;

        // Show LLM cards grid
        displayLLMCards();

        // Try to open LLM sites in new tabs
        openLLMTabs();

        // Show instructions
        showInstructions();
    }

    function openLLMTabs() {
        // Open each LLM in a new tab
        Object.entries(LLM_URLS).forEach(([llm, url]) => {
            try {
                window.open(url, `_blank_${llm}`);
            } catch (error) {
                console.error(`Failed to open ${llm} tab:`, error);
            }
        });
    }

    function displayLLMCards() {
        const cardsContainer = document.getElementById('llm-cards-container');
        if (!cardsContainer) return;

        cardsContainer.style.display = 'block';

        let cardsHTML = '<div class="llm-cards-grid">';

        Object.entries(LLM_URLS).forEach(([llm, url]) => {
            cardsHTML += `
                <div class="llm-card" id="llm-card-${llm}">
                    <div class="llm-card-header">
                        <h4>${LLM_NAMES[llm]}</h4>
                        <button class="btn-small btn-open-tab" data-llm="${llm}">
                            Open in New Tab
                        </button>
                    </div>
                    <div class="llm-card-body">
                        <div class="iframe-container" id="iframe-container-${llm}">
                            <iframe
                                src="${url}"
                                title="${LLM_NAMES[llm]} Interface"
                                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                                id="iframe-${llm}"
                            ></iframe>
                            <div class="iframe-overlay">
                                <p>Most LLMs block embedding for security.</p>
                                <button class="btn btn-primary btn-open-external" data-llm="${llm}">
                                    Open ${LLM_NAMES[llm]} in New Tab
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        cardsHTML += '</div>';
        cardsContainer.innerHTML = cardsHTML;

        // Add event listeners for open tab buttons
        document.querySelectorAll('.btn-open-tab, .btn-open-external').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const llm = e.target.dataset.llm;
                window.open(LLM_URLS[llm], `_blank_${llm}`);
            });
        });

        // Try to detect iframe blocking after a short delay
        setTimeout(checkIframeBlocking, 2000);
    }

    function checkIframeBlocking() {
        // Check each iframe to see if it loaded
        Object.keys(LLM_URLS).forEach(llm => {
            const iframe = document.getElementById(`iframe-${llm}`);
            const overlay = iframe?.parentElement?.querySelector('.iframe-overlay');

            if (iframe && overlay) {
                try {
                    // Try to access iframe content (will fail if blocked)
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    // If we can access it, hide overlay
                    if (iframeDoc && iframeDoc.readyState === 'complete') {
                        overlay.style.display = 'none';
                    }
                } catch (error) {
                    // iframe is blocked, overlay already visible
                    console.log(`${llm} iframe blocked by X-Frame-Options`);
                }
            }
        });
    }

    function showInstructions() {
        const instructionsBox = document.getElementById('instructions-box');
        if (!instructionsBox) return;

        instructionsBox.style.display = 'block';
        instructionsBox.innerHTML = `
            <div class="callout callout-info">
                <h4>📋 Instructions</h4>
                <ol>
                    <li>Enter your prompt in each LLM interface (tabs should have opened automatically)</li>
                    <li>Copy all 4 responses</li>
                    <li>Paste them into the textarea below (label each like "Claude: [response]")</li>
                    <li>Analysis will generate automatically as you paste</li>
                    <li>Adjust theory selections to see different scores</li>
                </ol>
            </div>
        `;
    }

    function handleResponseInput(event) {
        const text = event.target.value;

        // Clear previous debounce timer
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        // Set new debounce timer (500ms)
        debounceTimer = setTimeout(() => {
            if (text.trim().length > 0) {
                analyzeResponses(text);
            } else {
                clearAnalysis();
            }
        }, 500);
    }

    function handleTheoryChange() {
        updateSelectedTheories();

        // Re-analyze if there's text in the response textarea
        const responseTextarea = document.getElementById('response-textarea');
        if (responseTextarea && responseTextarea.value.trim().length > 0) {
            analyzeResponses(responseTextarea.value);
        }
    }

    function updateSelectedTheories() {
        selectedTheories = getSelectedTheories();
    }

    function getSelectedTheories() {
        const checkboxes = document.querySelectorAll('input[name="theory"]:checked');
        return Array.from(checkboxes).map(cb => cb.value);
    }

    function analyzeResponses(pastedText) {
        const theories = getSelectedTheories();

        if (theories.length === 0) {
            showError('Please select at least one theory to analyze.');
            return;
        }

        // Parse the pasted text to identify individual LLM responses
        const parsedResponses = parsePastedResponses(pastedText);

        // Analyze each response
        const allResults = {};

        Object.entries(parsedResponses).forEach(([llm, responseText]) => {
            if (responseText.trim().length > 0) {
                allResults[llm] = analyzeResponse(responseText, theories);
            }
        });

        // Display results
        displayAnalysis(allResults, theories);
    }

    function displayAnalysis(allResults, theories) {
        const analysisContainer = document.getElementById('analysis-container');
        if (!analysisContainer) return;

        analysisContainer.style.display = 'block';

        let html = '<div class="analysis-results">';

        // For each theory, show comparative analysis
        theories.forEach(theory => {
            html += `<div class="theory-analysis-section">`;
            html += `<h3>${THEORY_LABELS[theory]}</h3>`;

            // Create comparison table
            html += `<div class="comparison-table">`;
            html += `<table class="scores-table">`;
            html += `<thead>
                <tr>
                    <th>LLM</th>
                    <th>Recognition</th>
                    <th>Support</th>
                    <th>Practical</th>
                    <th>Overall</th>
                </tr>
            </thead>`;
            html += `<tbody>`;

            Object.entries(allResults).forEach(([llm, results]) => {
                const theoryResult = results[theory];
                if (theoryResult) {
                    html += `<tr>`;
                    html += `<td><strong>${LLM_NAMES[llm]}</strong></td>`;
                    html += `<td>${renderScoreBar(theoryResult.recognition)}</td>`;
                    html += `<td>${renderScoreBar(theoryResult.support)}</td>`;
                    html += `<td>${renderScoreBar(theoryResult.practical)}</td>`;
                    html += `<td>${renderScoreBar(theoryResult.overall, true)}</td>`;
                    html += `</tr>`;
                }
            });

            html += `</tbody></table>`;
            html += `</div>`; // End comparison table

            // Add detailed explanations
            html += `<div class="detailed-explanations">`;
            Object.entries(allResults).forEach(([llm, results]) => {
                const theoryResult = results[theory];
                if (theoryResult) {
                    html += `
                        <div class="explanation-card">
                            <h5>${LLM_NAMES[llm]} ${theoryResult.colorEmoji}</h5>
                            <ul>
                                <li><strong>Recognition:</strong> ${theoryResult.recognitionExplanation}</li>
                                <li><strong>Support:</strong> ${theoryResult.supportExplanation}</li>
                                <li><strong>Practical:</strong> ${theoryResult.practicalExplanation}</li>
                            </ul>
                        </div>
                    `;
                }
            });
            html += `</div>`; // End detailed explanations

            // Add comparative narrative
            html += `<div class="comparative-narrative">`;
            html += generateComparison(allResults, theory);
            html += `</div>`;

            html += `</div>`; // End theory-analysis-section
        });

        html += '</div>'; // End analysis-results

        analysisContainer.innerHTML = html;
    }

    function renderScoreBar(score, isOverall = false) {
        const percentage = (score / 10) * 100;
        let colorClass = 'red';

        if (score >= 8) colorClass = 'green';
        else if (score >= 4) colorClass = 'yellow';

        const sizeClass = isOverall ? 'score-bar-large' : '';

        return `
            <div class="score-bar-container ${sizeClass}">
                <div class="score-bar ${colorClass}" style="width: ${percentage}%">
                    <span class="score-label">${score}/10</span>
                </div>
            </div>
        `;
    }

    function clearAnalysis() {
        const analysisContainer = document.getElementById('analysis-container');
        if (analysisContainer) {
            analysisContainer.style.display = 'none';
            analysisContainer.innerHTML = '';
        }
    }

    function showError(message) {
        const analysisContainer = document.getElementById('analysis-container');
        if (analysisContainer) {
            analysisContainer.style.display = 'block';
            analysisContainer.innerHTML = `
                <div class="callout callout-warning">
                    <p>${message}</p>
                </div>
            `;
        }
    }

    // Expose functions for external use if needed
    window.liveExperiment = {
        analyzeResponses,
        displayLLMCards,
        openLLMTabs
    };

})();
