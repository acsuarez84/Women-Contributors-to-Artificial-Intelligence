// Keyword Dictionaries for Theory Analysis
// Used to score LLM responses against rhetoric theories

const THEORY_KEYWORDS = {
    grammar: {
        recognition: [
            'grammar', 'grammatical', 'syntax', 'syntactic', 'style', 'stylistic',
            'language variety', 'dialect', 'idiolect', 'register', 'voice',
            'identity', 'linguistic identity', 'language practices', 'conventions'
        ],
        positive: [
            'style choice', 'rhetorical choice', 'strategic', 'sophisticated',
            'intentional', 'valid', 'legitimate', 'authentic', 'unique voice',
            'cultural expression', 'identity marker', 'meaningful', 'purposeful'
        ],
        negative: [
            'grammar error', 'grammatically incorrect', 'fix', 'correct',
            'mistake', 'wrong', 'improper', 'non-standard', 'substandard',
            'needs correction', 'ungrammatical', 'poor grammar', 'bad grammar'
        ],
        practical: [
            'explain', 'cite', 'research', 'scholars', 'theory', 'framework',
            'context', 'audience', 'situation', 'rhetorical', 'purpose',
            'strategy', 'approach', 'technique', 'method'
        ]
    },

    transfer: {
        recognition: [
            'transfer', 'transferring', 'apply', 'applying', 'application',
            'adapt', 'adapting', 'adaptation', 'transform', 'transformation',
            'knowledge', 'skills', 'practice', 'experience', 'learning',
            'context', 'cross-context', 'situate', 'situated'
        ],
        positive: [
            'valuable experience', 'builds on', 'draws from', 'leverages',
            'enriches', 'enhances', 'strengthens', 'resource', 'asset',
            'foundation', 'expertise', 'skillful', 'sophisticated'
        ],
        negative: [
            'doesn\'t apply', 'not relevant', 'inappropriate', 'doesn\'t fit',
            'doesn\'t transfer', 'start over', 'forget', 'abandon',
            'irrelevant', 'not applicable', 'won\'t work here'
        ],
        practical: [
            'bridge', 'connect', 'integrate', 'combine', 'blend',
            'explicitly', 'signpost', 'explain how', 'show connection',
            'demonstrate', 'illustrate', 'meta-awareness', 'reflection'
        ]
    },

    rhetorical_listening: {
        recognition: [
            'listen', 'listening', 'hear', 'hearing', 'understand',
            'understanding', 'empathy', 'empathetic', 'perspective',
            'viewpoint', 'cross-cultural', 'intercultural', 'cultural difference',
            'ethical', 'respect', 'acknowledge', 'recognition'
        ],
        positive: [
            'valid perspective', 'legitimate viewpoint', 'important voice',
            'valuable insight', 'meaningful', 'significant', 'sophisticated',
            'culturally appropriate', 'contextually appropriate', 'nuanced',
            'complex', 'rich', 'deserves recognition'
        ],
        negative: [
            'confusing', 'unclear', 'hard to follow', 'difficult to understand',
            'unclear communication', 'needs clarification', 'ambiguous',
            'vague', 'not clear', 'misunderstood'
        ],
        practical: [
            'ask', 'inquire', 'seek to understand', 'learn from',
            'engage with', 'dialogue', 'conversation', 'discussion',
            'consider', 'reflect', 'pause', 'question assumptions'
        ]
    },

    translingualism: {
        recognition: [
            'translingual', 'translingualism', 'code-switching', 'code-meshing',
            'code switching', 'code meshing', 'bilingual', 'multilingual',
            'language mixing', 'hybrid language', 'linguistic diversity',
            'language practice', 'plurilingual', 'cross-linguistic'
        ],
        positive: [
            'sophisticated', 'strategic', 'intentional', 'rhetorical',
            'powerful', 'authentic', 'meaningful', 'valuable', 'rich',
            'resource', 'asset', 'strength', 'validates', 'honors',
            'recognizes', 'celebrates', 'legitimate practice'
        ],
        negative: [
            'fix', 'correct', 'error', 'mistake', 'wrong', 'incorrect',
            'needs translation', 'translate to English', 'standardize',
            'choose one language', 'pick one', 'confusing', 'inconsistent',
            'unprofessional', 'inappropriate', 'not academic'
        ],
        practical: [
            'explain choice', 'define terms', 'provide context', 'cite scholars',
            'Canagarajah', 'Anzaldúa', 'theoretical framework', 'methodology',
            'justify', 'rationale', 'strategic use', 'purposeful'
        ]
    },

    multimodality: {
        recognition: [
            'multimodal', 'multimodality', 'visual', 'image', 'video',
            'audio', 'spatial', 'gestural', 'modes', 'mode', 'semiotic',
            'media', 'multimedia', 'digital', 'affordances', 'design'
        ],
        positive: [
            'powerful', 'effective', 'engaging', 'accessible', 'inclusive',
            'innovative', 'creative', 'meaningful', 'rich', 'nuanced',
            'sophisticated', 'legitimate scholarship', 'valid research',
            'important', 'valuable', 'compelling'
        ],
        negative: [
            'not serious', 'unprofessional', 'inappropriate', 'not scholarly',
            'not academic', 'supplementary only', 'decorative', 'distraction',
            'gimmick', 'not rigorous', 'lacks substance', 'frivolous'
        ],
        practical: [
            'methodology', 'methods', 'analyze', 'explain significance',
            'connect to argument', 'integrate', 'theoretical framework',
            'cite', 'Kress', 'Shipka', 'New London Group', 'document',
            'justify choices', 'design rationale'
        ]
    },

    srtol: {
        recognition: [
            'students\' right', 'students\' rights', 'students right',
            'linguistic rights', 'language rights', 'home language',
            'native language', 'first language', 'own language',
            'linguistic diversity', 'language diversity', 'SRTOL',
            'CCCC', 'conference on college composition'
        ],
        positive: [
            'valid', 'legitimate', 'valuable', 'meaningful', 'important',
            'right to', 'deserves respect', 'should be honored', 'affirm',
            'validate', 'recognize', 'acknowledge', 'celebrate',
            'linguistic diversity', 'culturally sustaining', 'asset'
        ],
        negative: [
            'unprofessional', 'inappropriate', 'not academic', 'not standard',
            'substandard', 'incorrect', 'wrong', 'error', 'fix', 'correct',
            'change', 'eliminate', 'remove', 'standardize', 'conform'
        ],
        practical: [
            'cite SRTOL', 'cite CCCC', '1974', 'resolution', 'position statement',
            'theoretical framework', 'justify', 'explain', 'defend choice',
            'educate', 'advocate', 'policy', 'institutional', 'rights'
        ]
    }
};

// Helper function to normalize text for matching
function normalizeText(text) {
    return text.toLowerCase()
        .replace(/[''`]/g, "'")  // Normalize quotes
        .replace(/["]/g, '"')     // Normalize double quotes
        .trim();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { THEORY_KEYWORDS, normalizeText };
}
