// Theory Analyzer for LLM Response Scoring
// Implements 3-part nuanced scoring: Recognition, Support, Practical Advice

// Import keyword dictionaries
// Note: In browser context, this will use the globally available THEORY_KEYWORDS
// For Node.js testing, uncomment the line below:
// const { THEORY_KEYWORDS, normalizeText } = require('./keyword-dictionaries.js');

/**
 * Calculates Recognition score (0-10)
 * Measures whether the LLM acknowledges and understands the theory
 * @param {string} responseText - The LLM's response text
 * @param {string} theory - Theory key (e.g., 'grammar', 'translingualism')
 * @returns {Object} Score and explanation
 */
function calculateRecognition(responseText, theory) {
    const normalized = normalizeText(responseText);
    const keywords = THEORY_KEYWORDS[theory].recognition;

    let matchCount = 0;
    let matchedTerms = [];

    keywords.forEach(keyword => {
        const keywordNormalized = normalizeText(keyword);
        if (normalized.includes(keywordNormalized)) {
            matchCount++;
            matchedTerms.push(keyword);
        }
    });

    // Score calculation: 0 matches = 0, 1 match = 3, 2 matches = 5, 3 matches = 7, 4+ matches = 9-10
    let score = 0;
    if (matchCount === 0) score = 0;
    else if (matchCount === 1) score = 3;
    else if (matchCount === 2) score = 5;
    else if (matchCount === 3) score = 7;
    else if (matchCount === 4) score = 8;
    else if (matchCount === 5) score = 9;
    else score = 10;

    const explanation = matchCount > 0
        ? `Mentions theory-related terms: ${matchedTerms.slice(0, 3).join(', ')}${matchedTerms.length > 3 ? '...' : ''}`
        : 'No explicit recognition of theory terminology';

    return {
        score,
        matchCount,
        matchedTerms,
        explanation
    };
}

/**
 * Calculates Support score (0-10)
 * Measures whether the LLM validates or undermines the practice
 * Positive keywords increase score, negative keywords decrease it
 * @param {string} responseText - The LLM's response text
 * @param {string} theory - Theory key
 * @returns {Object} Score and explanation
 */
function calculateSupport(responseText, theory) {
    const normalized = normalizeText(responseText);
    const positiveKeywords = THEORY_KEYWORDS[theory].positive;
    const negativeKeywords = THEORY_KEYWORDS[theory].negative;

    let positiveCount = 0;
    let negativeCount = 0;
    let positiveMatches = [];
    let negativeMatches = [];

    positiveKeywords.forEach(keyword => {
        const keywordNormalized = normalizeText(keyword);
        if (normalized.includes(keywordNormalized)) {
            positiveCount++;
            positiveMatches.push(keyword);
        }
    });

    negativeKeywords.forEach(keyword => {
        const keywordNormalized = normalizeText(keyword);
        if (normalized.includes(keywordNormalized)) {
            negativeCount++;
            negativeMatches.push(keyword);
        }
    });

    // Score calculation:
    // Base score starts at 5 (neutral)
    // Each positive keyword adds points, each negative keyword subtracts
    const netPositive = positiveCount - negativeCount;
    let score = 5 + netPositive;

    // Clamp between 0-10
    score = Math.max(0, Math.min(10, score));

    let explanation = '';
    if (positiveCount > 0 && negativeCount === 0) {
        explanation = `Strongly supportive: Uses affirming language like "${positiveMatches[0]}"`;
    } else if (positiveCount > negativeCount) {
        explanation = `Mostly supportive: ${positiveCount} positive terms vs ${negativeCount} negative`;
    } else if (positiveCount === negativeCount && positiveCount > 0) {
        explanation = `Mixed stance: Balances validation with concerns`;
    } else if (negativeCount > positiveCount) {
        explanation = `Undermining: Uses prescriptive language like "${negativeMatches[0]}"`;
    } else {
        explanation = 'Neutral stance: Neither strongly supportive nor critical';
    }

    return {
        score,
        positiveCount,
        negativeCount,
        positiveMatches,
        negativeMatches,
        explanation
    };
}

/**
 * Calculates Practical Advice score (0-10)
 * Measures quality and actionability of advice
 * @param {string} responseText - The LLM's response text
 * @param {string} theory - Theory key
 * @returns {Object} Score and explanation
 */
function calculatePractical(responseText, theory) {
    const normalized = normalizeText(responseText);
    const practicalKeywords = THEORY_KEYWORDS[theory].practical;

    let matchCount = 0;
    let matchedTerms = [];

    practicalKeywords.forEach(keyword => {
        const keywordNormalized = normalizeText(keyword);
        if (normalized.includes(keywordNormalized)) {
            matchCount++;
            matchedTerms.push(keyword);
        }
    });

    // Check for actionable language patterns
    const actionablePatterns = [
        /you (can|could|should|might) (try|consider|use|apply|implement)/i,
        /i (recommend|suggest|advise) (that you|using|trying)/i,
        /consider (using|trying|applying|implementing)/i,
        /one (approach|strategy|method|way) is to/i,
        /here('s| are) (some|a few) (steps|strategies|approaches)/i,
        /first|second|third|finally/i, // Numbered steps
        /for example|such as|specifically/i // Concrete examples
    ];

    let actionableCount = 0;
    actionablePatterns.forEach(pattern => {
        if (pattern.test(responseText)) {
            actionableCount++;
        }
    });

    // Score calculation
    // Practical keywords contribute 50%, actionable patterns contribute 50%
    const keywordScore = Math.min(matchCount, 5); // Max 5 points from keywords
    const actionableScore = Math.min(actionableCount, 5); // Max 5 points from patterns
    const score = keywordScore + actionableScore;

    let explanation = '';
    if (score >= 8) {
        explanation = 'Provides concrete, actionable strategies with theoretical grounding';
    } else if (score >= 6) {
        explanation = 'Offers practical advice with some specific guidance';
    } else if (score >= 4) {
        explanation = 'Gives general suggestions but lacks specificity';
    } else if (score >= 2) {
        explanation = 'Limited practical advice provided';
    } else {
        explanation = 'Minimal or no actionable guidance offered';
    }

    return {
        score,
        matchCount,
        actionableCount,
        matchedTerms,
        explanation
    };
}

/**
 * Calculates overall theory score with 3-part breakdown
 * @param {string} responseText - The LLM's response text
 * @param {string} theory - Theory key
 * @returns {Object} Complete score breakdown with color coding
 */
function calculateTheoryScore(responseText, theory) {
    if (!THEORY_KEYWORDS[theory]) {
        console.error(`Unknown theory: ${theory}`);
        return null;
    }

    const recognition = calculateRecognition(responseText, theory);
    const support = calculateSupport(responseText, theory);
    const practical = calculatePractical(responseText, theory);

    // Overall score is average of the three components
    const overall = (recognition.score + support.score + practical.score) / 3;

    // Color coding
    let color = 'red';
    let colorEmoji = '🔴';
    if (overall >= 8) {
        color = 'green';
        colorEmoji = '🟢';
    } else if (overall >= 4) {
        color = 'yellow';
        colorEmoji = '🟡';
    }

    return {
        theory,
        overall: parseFloat(overall.toFixed(1)),
        recognition: recognition.score,
        support: support.score,
        practical: practical.score,
        color,
        colorEmoji,
        recognitionExplanation: recognition.explanation,
        supportExplanation: support.explanation,
        practicalExplanation: practical.explanation,
        details: {
            recognition,
            support,
            practical
        }
    };
}

/**
 * Analyzes a single LLM response against multiple theories
 * @param {string} responseText - The LLM's response text
 * @param {Array<string>} selectedTheories - Array of theory keys to analyze
 * @returns {Object} Scores for each theory
 */
function analyzeResponse(responseText, selectedTheories) {
    const results = {};

    selectedTheories.forEach(theory => {
        results[theory] = calculateTheoryScore(responseText, theory);
    });

    return results;
}

/**
 * Parses multiple LLM responses from a single pasted text block
 * Attempts to identify which LLM said what based on common patterns
 * @param {string} pastedText - The full pasted text containing all responses
 * @returns {Object} Parsed responses by LLM
 */
function parsePastedResponses(pastedText) {
    const responses = {
        claude: '',
        chatgpt: '',
        gemini: '',
        copilot: ''
    };

    // Common patterns for identifying LLM responses
    const patterns = {
        claude: /(?:claude|anthropic)[\s:]+/i,
        chatgpt: /(?:chatgpt|openai|gpt)[\s:]+/i,
        gemini: /(?:gemini|bard|google)[\s:]+/i,
        copilot: /(?:copilot|bing|microsoft)[\s:]+/i
    };

    // Try to split by LLM identifiers
    const lines = pastedText.split('\n');
    let currentLLM = null;
    let currentText = [];

    lines.forEach(line => {
        // Check if line starts with an LLM identifier
        let foundLLM = null;
        for (const [llm, pattern] of Object.entries(patterns)) {
            if (pattern.test(line)) {
                foundLLM = llm;
                break;
            }
        }

        if (foundLLM) {
            // Save previous LLM's text
            if (currentLLM && currentText.length > 0) {
                responses[currentLLM] = currentText.join('\n').trim();
            }
            // Start new LLM
            currentLLM = foundLLM;
            currentText = [line.replace(patterns[foundLLM], '').trim()];
        } else if (currentLLM) {
            // Add to current LLM's text
            currentText.push(line);
        }
    });

    // Save last LLM's text
    if (currentLLM && currentText.length > 0) {
        responses[currentLLM] = currentText.join('\n').trim();
    }

    // If no clear separation found, put all text in 'claude' as default
    if (!responses.claude && !responses.chatgpt && !responses.gemini && !responses.copilot) {
        responses.claude = pastedText.trim();
    }

    return responses;
}

/**
 * Generates comparative analysis across all LLMs
 * @param {Object} allResults - Results object with LLM names as keys
 * @param {string} theory - Theory being analyzed
 * @returns {string} Narrative comparison
 */
function generateComparison(allResults, theory) {
    const scores = [];

    for (const [llm, results] of Object.entries(allResults)) {
        if (results[theory]) {
            scores.push({
                llm: llm.charAt(0).toUpperCase() + llm.slice(1),
                overall: results[theory].overall,
                recognition: results[theory].recognition,
                support: results[theory].support,
                practical: results[theory].practical
            });
        }
    }

    if (scores.length === 0) return 'No results to compare.';

    // Sort by overall score descending
    scores.sort((a, b) => b.overall - a.overall);

    const best = scores[0];
    const worst = scores[scores.length - 1];

    let comparison = `**Comparative Analysis for ${THEORY_LABELS[theory]}:**\n\n`;
    comparison += `- **Highest Score**: ${best.llm} (${best.overall}/10) - `;
    comparison += `Strong in ${best.recognition >= 7 ? 'recognition' : best.support >= 7 ? 'support' : 'practical advice'}\n`;
    comparison += `- **Lowest Score**: ${worst.llm} (${worst.overall}/10)\n\n`;

    comparison += `**Key Patterns:**\n`;
    scores.forEach(s => {
        comparison += `- ${s.llm}: Recognition ${s.recognition}, Support ${s.support}, Practical ${s.practical}\n`;
    });

    return comparison;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateRecognition,
        calculateSupport,
        calculatePractical,
        calculateTheoryScore,
        analyzeResponse,
        parsePastedResponses,
        generateComparison
    };
}
