// Sample Prompts for Interactive LLM Demonstration
// 20 prompts across 11 languages/dialects, referencing 1-3 rhetoric theories

const SAMPLE_PROMPTS = [
    {
        id: 1,
        theories: ['translingualism', 'grammar'],
        language: 'Spanglish',
        prompt: "Estoy writing my tesis and mi advisor dice que I need to be more 'professional' but that's exactly how I talk. ¿Cómo puedo mantener my voice while meeting academic standards?"
    },
    {
        id: 2,
        theories: ['rhetorical_listening', 'srtol'],
        language: 'Puerto Rican Spanish with English',
        prompt: "En mi clase, cuando hablo con mi propio estilo puertorriqueño, some students say they can't understand me. Should I change how I speak or should they learn to listen differently?"
    },
    {
        id: 3,
        theories: ['multimodality', 'transfer'],
        language: 'Australian English',
        prompt: "G'day, I'm trying to explain my research using videos and images alongside text, but my supervisor reckons it's not 'serious scholarship.' How do I make the case that multimodal work is legit academic research?"
    },
    {
        id: 4,
        theories: ['srtol', 'grammar'],
        language: 'AAVE (African American Vernacular English)',
        prompt: "My professor be saying my writing ain't professional 'cause I use AAVE, but this how my community talk. Why I gotta change my voice to be taken seriously?"
    },
    {
        id: 5,
        theories: ['translingualism', 'multimodality'],
        language: 'Mexican Spanish with tech slang',
        prompt: "Estoy desarrollando una app y quiero que la documentación incluya español, inglés, y también GIFs y emojis para explicar mejor. ¿Es esto demasiado informal para código profesional?"
    },
    {
        id: 6,
        theories: ['transfer', 'rhetorical_listening'],
        language: 'Brazilian Portuguese',
        prompt: "Aprendi a escrever ensaios no Brasil com uma estrutura mais circular, mas nos EUA querem que seja direto e linear. Como posso transferir minhas habilidades sem perder minha identidade cultural?"
    },
    {
        id: 7,
        theories: ['grammar', 'srtol', 'translingualism'],
        language: 'Dominican Spanish with English code-switching',
        prompt: "Escribo mis emails mixing español y inglés porque trabajo con gente de ambos idiomas. HR me dijo que 'pick one language' pero eso no refleja cómo nos comunicamos en mi equipo. ¿Qué hago?"
    },
    {
        id: 8,
        theories: ['multimodality', 'rhetorical_listening'],
        language: 'Irish English',
        prompt: "I'm after making a presentation that includes traditional Irish music and visuals from home, but I'm worried the academic committee won't see how it relates to my research on community building. How do I help them understand the connection?"
    },
    {
        id: 9,
        theories: ['transfer'],
        language: 'Standard Italian',
        prompt: "Ho imparato a fare ricerca in Italia dove è normale citare molti filosofi e usare un linguaggio più poetico. Negli Stati Uniti mi dicono di essere più 'concise and data-driven.' Come posso trasferire il mio stile senza sembrare poco professionale?"
    },
    {
        id: 10,
        theories: ['translingualism', 'srtol'],
        language: 'Spanglish (Miami/Cuban style)',
        prompt: "I write como hablo - mixing Cuban Spanish with English porque that's mi realidad. Un reviewer said my dissertation proposal is 'linguistically inconsistent' pero para mí es authentically me. Should I change it?"
    },
    {
        id: 11,
        theories: ['rhetorical_listening', 'multimodality'],
        language: 'Portuguese (Continental)',
        prompt: "O meu orientador não compreende porque incluí fotografias da minha aldeia no meu trabalho sobre migração. Para mim, as imagens contam histórias que as palavras não conseguem. Como explico isto de forma académica?"
    },
    {
        id: 12,
        theories: ['grammar', 'transfer'],
        language: 'British English (Cockney influences)',
        prompt: "Right, so I grew up in East London innit, and I naturally write with that voice. But when I transfer my writing to university essays, they say it's 'too colloquial.' How do I keep my identity while doing academic work?"
    },
    {
        id: 13,
        theories: ['multimodality', 'translingualism', 'srtol'],
        language: 'Mexican Spanish with internet slang',
        prompt: "Quiero crear contenido educativo en TikTok mezclando español e inglés con memes y music, pero mi departamento dice que 'no cuenta como pedagogía seria.' ¿Por qué los métodos nuevos y multilingües no son válidos?"
    },
    {
        id: 14,
        theories: ['transfer', 'grammar'],
        language: 'Formal Spanish (Castilian)',
        prompt: "He aprendido a escribir en español formal con estructuras muy elaboradas. Al traducir mis ideas al inglés académico, ¿debo simplificar mi estilo o mantener la complejidad retórica que valoro?"
    },
    {
        id: 15,
        theories: ['rhetorical_listening', 'srtol', 'translingualism'],
        language: 'Puerto Rican Spanish (informal)',
        prompt: "Wepa! En mi research sobre comunidades puertorriqueñas, uso testimonios que mezclan español, inglés, y slang local. ¿Cómo hago que los académicos entiendan que esto NO es 'lenguaje incorrecto' sino rhetorical sophistication?"
    },
    {
        id: 16,
        theories: ['multimodality', 'transfer'],
        language: 'Australian English (informal)',
        prompt: "Mate, I'm writing about Indigenous Australian storytelling which is super visual and oral. How do I transfer those multimodal traditions into a written thesis without losing the essence of what makes them powerful?"
    },
    {
        id: 17,
        theories: ['grammar', 'translingualism'],
        language: 'Brazilian Portuguese with English tech terms',
        prompt: "Quando escrevo sobre tecnologia, misturo português com termos técnicos em inglês (tipo 'framework', 'deploy', 'debug') porque não existem traduções boas. Isso é 'erro gramatical' ou prática translingual profissional?"
    },
    {
        id: 18,
        theories: ['srtol', 'rhetorical_listening'],
        language: 'Irish English (regional)',
        prompt: "Sure, I'm grand with writing in Standard English, but when I'm talking about my community's experiences, using our local dialect feels more authentic. Why should I have to translate our voices to be heard in academic spaces?"
    },
    {
        id: 19,
        theories: ['multimodality', 'grammar', 'transfer'],
        language: 'Italian (regional - Sicilian influences)',
        prompt: "Vengo dalla Sicilia e la nostra tradizione è raccontare storie con gesti, canzoni, e immagini. All'università mi chiedono solo testi scritti. Come posso trasferire questa ricchezza multimodale nella forma che vogliono?"
    },
    {
        id: 20,
        theories: ['translingualism', 'rhetorical_listening', 'multimodality'],
        language: 'Dominican Spanish with modern slang',
        prompt: "Yo tá' creando un podcast educativo donde hablo dominicano puro, con música, y code-switching natural. ¿Por qué los gatekeepers académicos no ven que esto ES scholarship válido que llega a mi gente de verdad?"
    }
];

// Theory labels for display
const THEORY_LABELS = {
    'grammar': 'Grammar as Style & Identity',
    'transfer': 'Knowledge Transfer',
    'rhetorical_listening': 'Rhetorical Listening',
    'translingualism': 'Translingualism',
    'multimodality': 'Multimodality',
    'srtol': "Students' Right to Own Language"
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SAMPLE_PROMPTS, THEORY_LABELS };
}
