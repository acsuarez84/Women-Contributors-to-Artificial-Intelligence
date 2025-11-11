/**
 * example-prompts.js - Pre-loaded example prompts and responses for demonstrations
 */

const examplePrompts = {
  1: {
    title: "Academic Writing: Including Spanish Citations",
    prompt: "I'm citing Gloria Anzaldúa's work in my paper. Should I write 'Borderlands/La Frontera' or translate the Spanish part?",
    responses: {
      claude: {
        text: "Keep 'Borderlands/La Frontera' as is—it's the actual title of the book, and book titles should be preserved in their original language. This is standard academic practice. The bilingual title is itself meaningful, reflecting Anzaldúa's theoretical framework about cultural borderlands.",
        tags: ["Respects original title", "Explains significance"]
      },
      chatgpt: {
        text: "Use the full title 'Borderlands/La Frontera: The New Mestiza' as published. When citing, always use original titles. You can add a translation in brackets if helpful: 'Borderlands/La Frontera [Borderlands/The Border]: The New Mestiza.'",
        tags: ["Correct citation", "Suggests translation"]
      },
      gemini: {
        text: "Maintain the original bilingual title 'Borderlands/La Frontera' in your citation. This is the published title and should appear as such in your bibliography. The bilingual title is intentional and significant to the work.",
        tags: ["Maintains original", "Notes intentionality"]
      }
    },
    analysis: "All models correctly advise keeping the original title, which is standard academic practice. This is a case where linguistic preservation is universally recognized."
  },

  2: {
    title: "Professional Context: Introducing Yourself with Full Name",
    prompt: "In professional emails, should I use my full name 'María José Martínez López' or simplify to 'Maria Martinez' to make it easier for Americans?",
    responses: {
      claude: {
        text: "Use your full name as you prefer to be known. If 'María José Martínez López' is your name, use it. Professional environments should accommodate diverse naming conventions. You can include pronunciation in your signature if helpful: 'María José Martínez López (ma-REE-ah ho-SEH mar-TEE-nez LOH-pez).' Your name is part of your professional identity.",
        tags: ["Validates full name", "Practical suggestion"]
      },
      chatgpt: {
        text: "Use whichever name feels most comfortable to you. Many professionals with longer names choose a shortened version for simplicity: 'Maria Martinez' or 'Maria J. Martinez.' This can reduce confusion in environments where people aren't familiar with Spanish naming conventions. The key is consistency.",
        tags: ["Emphasizes comfort", "Suggests shortening"]
      },
      gemini: {
        text: "Your choice depends on context. In formal settings, use your full legal name 'María José Martínez López.' For day-to-day emails, you might use 'Maria Martinez' if that's easier. Many Hispanic professionals navigate this by using their full name formally and a shortened version casually.",
        tags: ["Context-dependent", "Acknowledges navigation"]
      }
    },
    analysis: "Notice the different assumptions: Claude validates full name use and puts responsibility on the environment to adapt. ChatGPT suggests simplification for others' convenience. Gemini presents it as the user's burden to navigate. These reflect different values about whose responsibility it is to adapt in cross-cultural professional contexts."
  },

  3: {
    title: "Creative Writing: Dialogue in Mixed Languages",
    prompt: "I'm writing a novel with bilingual characters who code-switch naturally. Do I need to translate all the Spanish dialogue for English readers?",
    responses: {
      claude: {
        text: "It depends on your artistic goals. Many Latino authors (Junot Díaz, Sandra Cisneros) don't translate, treating bilingual readers as the primary audience. Consider: 1) Is the Spanish essential to character/theme? 2) Can context clues provide meaning? 3) Do you want non-Spanish readers to experience language barriers? You can use italics, footnotes, or context—or nothing at all. Your linguistic choices are part of your art.",
        tags: ["Artistic choice", "Literary precedent", "Audience consideration"]
      },
      chatgpt: {
        text: "For broader accessibility, include translations. You can: 1) Provide translations in italics after Spanish phrases, 2) Use context clues, 3) Add a glossary, or 4) Have characters naturally translate in dialogue: 'No puedo,' she said. 'I can't.' This ensures all readers can follow while preserving authentic speech.",
        tags: ["Prioritizes accessibility", "Suggests translation methods"]
      },
      gemini: {
        text: "Contemporary Latino literature often leaves Spanish untranslated, which is a valid artistic choice. However, consider your target audience. If you want wide readership, some translation strategy helps. You can be selective—translate crucial plot points but leave casual phrases untranslated, trusting readers to infer meaning.",
        tags: ["Acknowledges convention", "Practical balance"]
      }
    },
    analysis: "Claude centers the author's artistic vision and Latino literary tradition. ChatGPT prioritizes accessibility to non-Spanish readers. Gemini acknowledges both but frames translation as necessary for 'wide readership,' implicitly centering English-only readers as the broader audience."
  },

  4: {
    title: "Research Context: Discussing Cultural Concepts",
    prompt: "I'm writing about 'confianza' in Latino communities. Is there an English equivalent or should I use the Spanish term?",
    responses: {
      claude: {
        text: "'Confianza' doesn't translate cleanly to 'trust' or 'confidence'—it encompasses relational intimacy, vulnerability, and earned interpersonal closeness that English lacks a single word for. Use 'confianza' (italicized on first use) with explanation: 'confianza, a deep sense of mutual trust and relational intimacy central to Latino social bonds.' This preserves conceptual specificity.",
        tags: ["Preserves specificity", "Explains cultural meaning"]
      },
      chatgpt: {
        text: "'Confianza' can be translated as 'trust' or 'confidence,' though these don't capture all nuances. For academic writing, define it on first use: 'confianza (trust)' or 'trust (confianza).' This makes your work accessible while acknowledging the Spanish term. Explain cultural specifics as needed.",
        tags: ["Suggests translation", "Defines on first use"]
      },
      gemini: {
        text: "'Confianza' is richer than 'trust'—it includes intimacy, familiarity, and relational depth. In scholarship, use the Spanish term with explanation, as it's an established concept in Latino studies. Reference scholars who've theorized it (e.g., confianza as analyzed by Valdés, 1996) to show it's a recognized theoretical construct.",
        tags: ["Acknowledges richness", "Cites scholarship"]
      }
    },
    analysis: "All three recognize that 'confianza' doesn't translate simply, but they offer different solutions. Claude emphasizes untranslatability and conceptual specificity. ChatGPT leans toward English equivalents with acknowledgment of nuance. Gemini positions it as an established scholarly term, which validates its use untranslated in academic contexts."
  }
};

// Make globally available
if (typeof window !== 'undefined') {
  window.examplePrompts = examplePrompts;
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = examplePrompts;
}
