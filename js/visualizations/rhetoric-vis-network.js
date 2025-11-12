// Rhetoric-LLM-Women Interactive Network Visualization using Vis.js
// Integrates theories, LLMs, and women contributors from timeline

(function() {
    'use strict';

    let network;
    let womenData = [];

    // Initialize the visualization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    async function init() {
        try {
            // Load women contributors data
            await loadWomenData();

            // Create the network
            createNetwork();
        } catch (error) {
            console.error('Error initializing network:', error);
        }
    }

    async function loadWomenData() {
        try {
            const response = await fetch('../data/women-tech-contributors.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            womenData = await response.json();
            console.log('Women contributors data loaded:', womenData);
        } catch (error) {
            console.error('Error loading women data:', error);
            womenData = []; // Continue with empty array if loading fails
        }
    }

    function createNetwork() {
        const container = document.getElementById('mynetwork');
        if (!container) {
            console.error('Network container not found');
            return;
        }

        // Create nodes array
        const nodes = new vis.DataSet([
            // Main theory nodes
            {
                id: 'grammar',
                label: 'GRAMMAR',
                color: '#FF6B6B',
                font: {size: 27, color: 'white', bold: true},
                title: 'Click for full description',
                size: 90,
                shape: 'circle',
                type: 'theory'
            },
            {
                id: 'listening',
                label: 'RHETORICAL\nLISTENING',
                color: '#4ECDC4',
                font: {size: 27, color: 'white', bold: true},
                title: 'Click for full description',
                size: 90,
                shape: 'circle',
                type: 'theory'
            },
            {
                id: 'srtol',
                label: "STUDENTS' RIGHTS\nTO THEIR\nOWN LANGUAGE",
                color: '#45B7D1',
                font: {size: 27, color: 'white', bold: true},
                title: 'Click for full description',
                size: 100,
                shape: 'circle',
                type: 'theory'
            },
            {
                id: 'transfer',
                label: 'TRANSFER',
                color: '#96CEB4',
                font: {size: 27, color: 'white', bold: true},
                title: 'Click for full description',
                size: 90,
                shape: 'circle',
                type: 'theory'
            },
            {
                id: 'translingualism',
                label: 'TRANSLINGUALISM',
                color: '#45B7D1',
                font: {size: 27, color: 'white', bold: true},
                title: 'Click for full description',
                size: 100,
                shape: 'circle',
                type: 'theory'
            },
            {
                id: 'multimodality',
                label: 'MULTIMODALITY',
                color: '#FECA57',
                font: {size: 27, color: 'white', bold: true},
                title: 'Click for full description',
                size: 90,
                shape: 'circle',
                type: 'theory'
            },

            // LLM nodes
            {
                id: 'claude',
                label: 'Claude',
                color: '#FF8C42',
                font: {size: 27, color: 'white', bold: true},
                title: 'Click to see how Claude functions',
                size: 70,
                shape: 'box',
                type: 'llm'
            },
            {
                id: 'chatgpt',
                label: 'ChatGPT',
                color: '#FF8C42',
                font: {size: 27, color: 'white', bold: true},
                title: 'Click to see how ChatGPT functions',
                size: 70,
                shape: 'box',
                type: 'llm'
            },
            {
                id: 'gemini',
                label: 'Gemini',
                color: '#FF8C42',
                font: {size: 27, color: 'white', bold: true},
                title: 'Click to see how Gemini functions',
                size: 70,
                shape: 'box',
                type: 'llm'
            },
            {
                id: 'copilot',
                label: 'Co-Pilot',
                color: '#FF8C42',
                font: {size: 27, color: 'white', bold: true},
                title: 'Click to see how Co-Pilot functions',
                size: 70,
                shape: 'box',
                type: 'llm'
            }
        ]);

        // Add women nodes
        womenData.forEach(woman => {
            // Create comprehensive tooltip
            const theoryNames = woman.theoryConnections ? woman.theoryConnections.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(', ') : 'None';
            const llmNames = woman.llmFailures ? woman.llmFailures.map(l => l.charAt(0).toUpperCase() + l.slice(1)).join(', ') : 'None';
            const tooltip = `${woman.name} (${woman.year}): ${woman.contribution}. Exemplifies: ${theoryNames}. Erased by: ${llmNames}`;

            nodes.add({
                id: woman.id,
                label: woman.name, // Full name
                color: '#00968A',
                font: {size: 27, color: 'white', bold: true},
                title: tooltip,
                size: 60,
                shape: 'diamond',
                type: 'woman',
                data: woman
            });
        });

        // Create edges array
        const edges = new vis.DataSet([
            // Theory-to-theory connections
            {
                from: 'grammar',
                to: 'srtol',
                arrows: 'to',
                color: {color: '#e74c3c'},
                width: 3,
                dashes: [5, 3],
                label: 'Directly challenges prescriptive grammar by rejecting monolingual standards and affirming linguistic diversity',
                font: {size: 14, align: 'middle', color: 'white', background: 'rgba(0,0,0,0.7)', multi: 'html', maxWidth: 200}
            },
            {
                from: 'grammar',
                to: 'translingualism',
                arrows: 'to',
                color: {color: '#e74c3c'},
                width: 3,
                dashes: [5, 3],
                label: 'Fundamentally rejects grammar as fixed, viewing language practices as fluid and negotiated',
                font: {size: 14, align: 'middle', color: 'white', background: 'rgba(0,0,0,0.7)', multi: 'html', maxWidth: 200}
            },
            {
                from: 'listening',
                to: 'srtol',
                arrows: 'to,from',
                color: {color: '#27ae60'},
                width: 3,
                label: 'Both emphasize ethical imperative to value and understand different language practices across cultures',
                font: {size: 14, align: 'middle', color: 'white', background: 'rgba(0,0,0,0.7)', multi: 'html', maxWidth: 200}
            },
            {
                from: 'listening',
                to: 'translingualism',
                arrows: 'to,from',
                color: {color: '#27ae60'},
                width: 3,
                label: 'Both promote conscious cross-cultural understanding through engagement with linguistic differences',
                font: {size: 14, align: 'middle', color: 'white', background: 'rgba(0,0,0,0.7)', multi: 'html', maxWidth: 200}
            },
            {
                from: 'listening',
                to: 'transfer',
                arrows: 'to',
                color: {color: '#3498db'},
                width: 2,
                label: 'Rhetorical listening skills transfer and adapt across different rhetorical contexts and situations',
                font: {size: 14, align: 'middle', color: 'white', background: 'rgba(0,0,0,0.7)', multi: 'html', maxWidth: 200}
            },
            {
                from: 'srtol',
                to: 'translingualism',
                arrows: 'to,from',
                color: {color: '#9b59b6'},
                width: 4,
                label: 'Theoretical evolution from rights-based to resource-based framing of language diversity',
                font: {size: 14, align: 'middle', color: 'white', background: 'rgba(0,0,0,0.7)', multi: 'html', maxWidth: 200}
            },
            {
                from: 'srtol',
                to: 'transfer',
                arrows: 'to',
                color: {color: '#3498db'},
                width: 2,
                label: 'Student home languages become resources that transfer to and enrich academic writing contexts',
                font: {size: 14, align: 'middle', color: 'white', background: 'rgba(0,0,0,0.7)', multi: 'html', maxWidth: 200}
            },
            {
                from: 'transfer',
                to: 'translingualism',
                arrows: 'to,from',
                color: {color: '#27ae60'},
                width: 3,
                label: 'Language practices and strategies transfer across linguistic and cultural boundaries',
                font: {size: 14, align: 'middle', color: 'white', background: 'rgba(0,0,0,0.7)', multi: 'html', maxWidth: 200}
            },
            {
                from: 'transfer',
                to: 'multimodality',
                arrows: 'to,from',
                color: {color: '#27ae60'},
                width: 3,
                label: 'Multimodal composing skills and knowledge transfer across different media and contexts',
                font: {size: 14, align: 'middle', color: 'white', background: 'rgba(0,0,0,0.7)', multi: 'html', maxWidth: 200}
            },
            {
                from: 'transfer',
                to: 'grammar',
                arrows: 'from',
                color: {color: '#95a5a6'},
                width: 2,
                dashes: [5, 5],
                label: 'Shows that grammatical knowledge does not simply move unchanged across different contexts',
                font: {size: 14, align: 'middle', color: 'white', background: 'rgba(0,0,0,0.7)', multi: 'html', maxWidth: 200}
            },
            {
                from: 'translingualism',
                to: 'multimodality',
                arrows: 'to,from',
                color: {color: '#27ae60'},
                width: 3,
                label: 'Both theories recognize multiple resources available for creating meaning beyond single modalities',
                font: {size: 14, align: 'middle', color: 'white', background: 'rgba(0,0,0,0.7)', multi: 'html', maxWidth: 200}
            },
            {
                from: 'multimodality',
                to: 'grammar',
                arrows: 'to',
                color: {color: '#f39c12'},
                width: 2,
                label: 'Expands grammar concept to include visual, spatial, and gestural meaning-making systems',
                font: {size: 14, align: 'middle', color: 'white', background: 'rgba(0,0,0,0.7)', multi: 'html', maxWidth: 200}
            },
            {
                from: 'multimodality',
                to: 'srtol',
                arrows: 'from',
                color: {color: '#27ae60'},
                width: 2,
                label: 'Multimodal communication expands student rights to include diverse semiotic modes of expression',
                font: {size: 14, align: 'middle', color: 'white', background: 'rgba(0,0,0,0.7)', multi: 'html', maxWidth: 200}
            },
            {
                from: 'multimodality',
                to: 'listening',
                arrows: 'to,from',
                color: {color: '#3498db'},
                width: 2,
                label: 'Rhetorical listening extends beyond verbal communication to include visual, spatial, and gestural modes',
                font: {size: 14, align: 'middle', color: 'white', background: 'rgba(0,0,0,0.7)', multi: 'html', maxWidth: 200}
            }
        ]);

        // Add woman-to-theory connections with unique explanations
        const womanTheoryConnections = {
            'ada-lovelace-transfer': {from: 'ada-lovelace', to: 'transfer', label: "Lovelace transferred mathematical concepts into computational thinking, pioneering algorithmic logic that crossed disciplinary boundaries"},
            'ada-lovelace-multimodality': {from: 'ada-lovelace', to: 'multimodality', label: "Her extensive annotations and diagrams exemplify multimodal technical communication, combining text, notation, and visual representation"},
            'grace-hopper-translingualism': {from: 'grace-hopper', to: 'translingualism', label: "Hopper's COBOL embodies translingual principles by making code readable across technical and non-technical communities"},
            'grace-hopper-grammar': {from: 'grace-hopper', to: 'grammar', label: "She established grammatical conventions for programming languages, creating syntax rules that balanced structure with accessibility"},
            'grace-hopper-transfer': {from: 'grace-hopper', to: 'transfer', label: "Her compiler work demonstrated how natural language concepts transfer into machine-readable instructions"},
            'katherine-johnson-listening': {from: 'katherine-johnson', to: 'listening', label: "Johnson practiced rhetorical listening by understanding unspoken technical needs and translating them into precise mathematical solutions"},
            'katherine-johnson-srtol': {from: 'katherine-johnson', to: 'srtol', label: "Her erasure from NASA narratives exemplifies the need for recognizing all contributors' intellectual languages and rights to recognition"},
            'margaret-hamilton-grammar': {from: 'margaret-hamilton', to: 'grammar', label: "Hamilton established rigorous grammatical standards for software engineering, legitimizing code as a formal engineering language"},
            'margaret-hamilton-multimodality': {from: 'margaret-hamilton', to: 'multimodality', label: "Her extensive documentation combined code, diagrams, flowcharts, and written explanations in multimodal engineering practice"},
            'margaret-hamilton-srtol': {from: 'margaret-hamilton', to: 'srtol', label: "She fought for software developers' right to be recognized as engineers, validating their technical language and intellectual contributions"},
            'radia-perlman-transfer': {from: 'radia-perlman', to: 'transfer', label: "Perlman transferred biological concepts (trees, roots, spanning) into network engineering, demonstrating cross-domain knowledge application"},
            'radia-perlman-multimodality': {from: 'radia-perlman', to: 'multimodality', label: "Her playful, accessible technical writing combines poetry, diagrams, and prose, challenging gatekeeping technical communication norms"},
            'fei-fei-li-listening': {from: 'fei-fei-li', to: 'listening', label: "Li's work on human-centered AI demands rhetorical listening to diverse communities about dataset bias and representation"},
            'fei-fei-li-multimodality': {from: 'fei-fei-li', to: 'multimodality', label: "ImageNet revolutionized how machines process multimodal visual information, though it perpetuated existing visual biases"},
            'fei-fei-li-srtol': {from: 'fei-fei-li', to: 'srtol', label: "Her advocacy for inclusive AI echoes students' rights arguments—both assert the legitimacy of diverse voices against dominant norms"},
            'joy-buolamwini-listening': {from: 'joy-buolamwini', to: 'listening', label: "Buolamwini's research requires rhetorical listening to marginalized communities' lived experiences with biased AI systems"},
            'joy-buolamwini-srtol': {from: 'joy-buolamwini', to: 'srtol', label: "She exposes how AI systems fail to recognize darker-skinned faces, paralleling how institutions fail to recognize marginalized voices"},
            'joy-buolamwini-translingualism': {from: 'joy-buolamwini', to: 'translingualism', label: "Her work reveals how AI systems privilege dominant visual 'languages' while erasing culturally-specific modes of expression"},
            'timnit-gebru-listening': {from: 'timnit-gebru', to: 'listening', label: "Gebru's 'Stochastic Parrots' demands we listen to how LLMs perpetuate linguistic and cultural bias at scale"},
            'timnit-gebru-srtol': {from: 'timnit-gebru', to: 'srtol', label: "Her silencing by Google mirrors institutional suppression of those who assert their right to critique technological hegemony"},
            'timnit-gebru-grammar': {from: 'timnit-gebru', to: 'grammar', label: "She reveals how LLM training imposes dominant grammatical patterns, erasing the legitimacy of diverse linguistic practices"}
        };

        Object.values(womanTheoryConnections).forEach(conn => {
            edges.add({
                from: conn.from,
                to: conn.to,
                color: {color: '#00BCD4'},
                width: 2,
                dashes: [5, 3],
                label: conn.label,
                font: {size: 14, align: 'middle', color: 'white', background: 'rgba(0,0,0,0.7)', multi: 'html', maxWidth: 200}
            });
        });

        // Add LLM-to-woman erasure connections with unique explanations
        const llmWomanConnections = {
            'claude-ada-lovelace': {from: 'claude', to: 'ada-lovelace', label: "Claude's training data underrepresents women's foundational computing work, often attributing Lovelace's algorithm to Babbage"},
            'claude-katherine-johnson': {from: 'claude', to: 'katherine-johnson', label: "Claude lacks contextual understanding to recognize how Johnson's calculations required cross-cultural technical translation"},
            'claude-margaret-hamilton': {from: 'claude', to: 'margaret-hamilton', label: "Claude perpetuates narratives that minimize Hamilton's software engineering leadership, focusing on astronauts over ground control"},
            'claude-fei-fei-li': {from: 'claude', to: 'fei-fei-li', label: "Claude fails to connect Li's ImageNet work to broader implications about bias in its own training datasets"},
            'claude-joy-buolamwini': {from: 'claude', to: 'joy-buolamwini', label: "Claude cannot engage with Buolamwini's critiques of AI bias because it lacks capacity for genuine self-reflection"},
            'claude-timnit-gebru': {from: 'claude', to: 'timnit-gebru', label: "Claude was trained during the controversy of Gebru's firing, yet its training process embodies the problems she exposed"},
            'chatgpt-ada-lovelace': {from: 'chatgpt', to: 'ada-lovelace', label: "ChatGPT often presents Lovelace as Babbage's assistant rather than independent mathematician and pioneering programmer"},
            'chatgpt-grace-hopper': {from: 'chatgpt', to: 'grace-hopper', label: "ChatGPT's code suggestions favor terse, exclusive styles over Hopper's accessible, documentation-rich approach"},
            'chatgpt-fei-fei-li': {from: 'chatgpt', to: 'fei-fei-li', label: "ChatGPT uses ImageNet-influenced models while failing to acknowledge Li's warnings about perpetuating dataset bias"},
            'chatgpt-joy-buolamwini': {from: 'chatgpt', to: 'joy-buolamwini', label: "ChatGPT cannot recognize how its own design perpetuates the algorithmic injustice Buolamwini documents"},
            'chatgpt-timnit-gebru': {from: 'chatgpt', to: 'timnit-gebru', label: "ChatGPT exemplifies the 'stochastic parrot' phenomenon Gebru warned about—producing fluent text without genuine understanding"},
            'gemini-katherine-johnson': {from: 'gemini', to: 'katherine-johnson', label: "Gemini's training emphasizes space technology hardware over Johnson's intellectual labor as a Black woman mathematician"},
            'gemini-radia-perlman': {from: 'gemini', to: 'radia-perlman', label: "Gemini's technical responses reflect gatekeeping jargon rather than Perlman's playful, accessible communication style"},
            'gemini-fei-fei-li': {from: 'gemini', to: 'fei-fei-li', label: "Gemini processes multimodal inputs while ignoring Li's research on how visual AI perpetuates bias against people of color"},
            'gemini-joy-buolamwini': {from: 'gemini', to: 'joy-buolamwini', label: "Gemini's image recognition builds on systems Buolamwini proved fail for darker-skinned faces, yet Google continued deployment"},
            'gemini-timnit-gebru': {from: 'gemini', to: 'timnit-gebru', label: "Gemini represents Google's continued investment in LLMs despite Gebru's warnings about their environmental and social costs"},
            'copilot-grace-hopper': {from: 'copilot', to: 'grace-hopper', label: "Co-Pilot suggests terse code over documented, readable approaches that honor Hopper's translingual accessibility principles"},
            'copilot-margaret-hamilton': {from: 'copilot', to: 'margaret-hamilton', label: "Co-Pilot's code suggestions often skip rigorous validation and documentation that Hamilton established as essential"},
            'copilot-joy-buolamwini': {from: 'copilot', to: 'joy-buolamwini', label: "Co-Pilot trains on GitHub repositories that reflect systemic exclusion of women and people of color that Buolamwini exposes"}
        };

        Object.values(llmWomanConnections).forEach(conn => {
            edges.add({
                from: conn.from,
                to: conn.to,
                color: {color: '#FF8C42'},
                width: 2,
                dashes: [3, 6],
                label: conn.label,
                font: {size: 14, align: 'middle', color: 'white', background: 'rgba(0,0,0,0.7)', multi: 'html', maxWidth: 200}
            });
        });

        // Add LLM failure connections to theories with specific explanations
        const llmTheoryFailures = [
            {from: 'claude', to: 'listening', label: 'Claude lacks capacity for conscious cross-cultural understanding because it cannot engage in genuine ethical reflection about whose voices it amplifies or erases'},
            {from: 'claude', to: 'translingualism', label: 'Claude standardizes language toward dominant English patterns, treating code-switching as error rather than sophisticated rhetorical strategy'},
            {from: 'chatgpt', to: 'listening', label: 'ChatGPT cannot practice rhetorical listening because it has no awareness of its own positionality or the power dynamics embedded in its training data'},
            {from: 'chatgpt', to: 'srtol', label: 'ChatGPT systematically corrects nonstandard English and code-meshing, violating students\' rights to their own linguistic practices'},
            {from: 'gemini', to: 'multimodality', label: 'Gemini processes multimodal inputs through text-centric understanding, missing how images, gestures, and spatial arrangements create culturally-specific meaning'},
            {from: 'gemini', to: 'translingualism', label: 'Gemini offers English translations instead of preserving translingual complexity, erasing the cultural work that language-mixing performs'},
            {from: 'copilot', to: 'transfer', label: 'Co-Pilot suggests code without recognizing how programming knowledge transforms across contexts, treating transfer as simple copy-paste'},
            {from: 'copilot', to: 'srtol', label: 'Co-Pilot enforces standardized naming conventions and style guides, erasing programmers\' rights to their own expressive and cultural coding practices'}
        ];

        llmTheoryFailures.forEach(conn => {
            edges.add({
                from: conn.from,
                to: conn.to,
                color: {color: '#FF8C42'},
                width: 2,
                dashes: [2, 4],
                label: conn.label,
                font: {size: 14, align: 'middle', color: 'white', background: 'rgba(0,0,0,0.7)', multi: 'html', maxWidth: 200}
            });
        });

        // Network data
        const data = {
            nodes: nodes,
            edges: edges
        };

        // Network options
        const options = {
            nodes: {
                borderWidth: 3,
                borderWidthSelected: 5,
                shadow: {
                    enabled: true,
                    size: 10,
                    x: 5,
                    y: 5
                }
            },
            edges: {
                smooth: {
                    type: 'curvedCW',
                    roundness: 0.2
                },
                hoverWidth: 4
            },
            physics: {
                stabilization: {
                    iterations: 2000
                },
                barnesHut: {
                    gravitationalConstant: -5000,
                    springConstant: 0.001,
                    springLength: 300,
                    avoidOverlap: 0.5
                }
            },
            layout: {
                improvedLayout: true,
                hierarchical: {
                    enabled: false
                }
            },
            interaction: {
                hover: true,
                tooltipDelay: 200,
                zoomView: true,
                dragView: true,
                dragNodes: true
            }
        };

        // Create network
        network = new vis.Network(container, data, options);

        // Position nodes after stabilization
        network.on('stabilizationIterationsDone', function() {
            network.setOptions({physics: false});

            // Position main nodes (increased spacing - tripled for more breathing room)
            const positions = [
                {id: 'grammar', x: -900, y: -600},
                {id: 'listening', x: 900, y: -600},
                {id: 'srtol', x: -1350, y: 300},
                {id: 'transfer', x: 0, y: 0},
                {id: 'translingualism', x: 1350, y: 300},
                {id: 'multimodality', x: 0, y: 900}
            ];

            // Position LLMs on right side (increased spacing)
            const llmPositions = [
                {id: 'claude', x: 1650, y: -450},
                {id: 'chatgpt', x: 1650, y: -150},
                {id: 'gemini', x: 1650, y: 150},
                {id: 'copilot', x: 1650, y: 450}
            ];

            // Position women in circular pattern (increased radius for more space)
            const womenCount = womenData.length;
            womenData.forEach((woman, index) => {
                const angle = (index / womenCount) * Math.PI * 2 - Math.PI / 2;
                const radius = 600;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                network.moveNode(woman.id, x, y);
            });

            positions.forEach(pos => network.moveNode(pos.id, pos.x, pos.y));
            llmPositions.forEach(pos => network.moveNode(pos.id, pos.x, pos.y));

            setTimeout(() => {
                network.fit({animation: true});
            }, 100);
        });

        // Handle node clicks
        network.on('click', function(params) {
            if (params.nodes.length > 0) {
                const nodeId = params.nodes[0];
                const node = nodes.get(nodeId);

                if (node && node.type) {
                    showNodeModal(node, nodeId);
                }
            }
        });
    }

    function showNodeModal(node, nodeId) {
        // Create or get modal
        let modal = document.getElementById('concept-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'concept-modal';
            modal.className = 'modal';
            modal.style.display = 'none';
            modal.setAttribute('role', 'dialog');
            modal.setAttribute('aria-modal', 'true');

            const modalContent = document.createElement('div');
            modalContent.className = 'modal-content';

            const closeBtn = document.createElement('span');
            closeBtn.className = 'modal-close';
            closeBtn.innerHTML = '&times;';
            closeBtn.setAttribute('aria-label', 'Close modal');
            closeBtn.onclick = () => { modal.style.display = 'none'; };

            const modalBody = document.createElement('div');
            modalBody.id = 'modal-body';

            modalContent.appendChild(closeBtn);
            modalContent.appendChild(modalBody);
            modal.appendChild(modalContent);
            document.body.appendChild(modal);

            // Close on outside click
            modal.onclick = function(event) {
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            };
        }

        const modalBody = document.getElementById('modal-body');
        let content = '';

        if (node.type === 'theory') {
            const descriptions = {
                'grammar': 'GRAMMAR: Traditional prescriptive rules and structures of language that have historically dominated composition instruction. Emphasizes correctness, standardization, and adherence to established conventions, often privileging certain language varieties over others.',
                'listening': 'RHETORICAL LISTENING: Krista Ratcliffe framework for ethical cross-cultural communication that emphasizes conscious identification and acknowledgment of both commonalities and differences. Promotes understanding across cultural boundaries through intentional, ethical engagement with diverse perspectives.',
                'srtol': "STUDENTS' RIGHTS TO THEIR OWN LANGUAGE: The 1974 CCCC position statement affirming the linguistic diversity all students bring to the classroom. Advocates for respecting and valuing home languages, dialects, and varieties as legitimate forms of expression and learning resources.",
                'transfer': 'TRANSFER: The application, adaptation, or transformation of writing knowledge, skills, and practices from one context to another. Central to understanding how students develop as writers across disciplines, genres, and rhetorical situations.',
                'translingualism': 'TRANSLINGUALISM: An approach viewing language differences not as barriers to overcome but as resources for meaning-making. Emphasizes the fluid, dynamic nature of language practices and challenges monolingual assumptions in writing pedagogy.',
                'multimodality': 'MULTIMODALITY: Recognition that meaning is created through multiple modes including visual, aural, spatial, gestural, and linguistic elements. Acknowledges how digital technologies have expanded compositional possibilities beyond traditional alphabetic text.'
            };
            content = `<h3>${node.label}</h3><p>${descriptions[nodeId]}</p>`;
        } else if (node.type === 'llm') {
            const llmInfo = {
                'claude': {
                    name: 'Claude (Anthropic)',
                    functionality: 'Constitutional AI trained with human feedback, designed for helpful, harmless, and honest responses. Processes text-based inputs with focus on safety and reducing harmful outputs.',
                    implications: 'Despite safety measures, Claude inherits biases from training data. May not recognize culturally-specific rhetorical strategies from underrepresented communities, particularly Latino women\'s translingual practices and multimodal communication patterns.'
                },
                'chatgpt': {
                    name: 'ChatGPT (OpenAI)',
                    functionality: 'GPT-4 based conversational AI trained on diverse internet text. Generates human-like responses across various topics with emphasis on coherence and relevance.',
                    implications: 'Training data predominantly reflects dominant linguistic patterns. Often "corrects" code-switching and non-standard varieties toward Standard English, potentially erasing the rhetorical sophistication of students\' own languages and cultural expression.'
                },
                'gemini': {
                    name: 'Gemini (Google)',
                    functionality: 'Multimodal AI capable of processing text, images, and other formats. Designed for broad task performance with integration across Google services.',
                    implications: 'While technically multimodal, still primarily text-centric in understanding rhetoric. May miss the cultural significance of how Latino communities use visual, spatial, and embodied modes of communication that don\'t translate to text.'
                },
                'copilot': {
                    name: 'Co-Pilot (Microsoft/OpenAI)',
                    functionality: 'AI pair programmer trained on GitHub code repositories. Assists with code completion, generation, and documentation across programming languages.',
                    implications: 'In documentation and comments, tends toward standardized technical English. May not recognize transfer of rhetorical skills from other contexts, reinforcing narrow definitions of "professional" communication that exclude diverse voices.'
                }
            };

            const info = llmInfo[nodeId];
            content = `
                <h3>${info.name}</h3>
                <div class="modal-section">
                    <h4>How It Functions</h4>
                    <p>${info.functionality}</p>
                </div>
                <div class="modal-section">
                    <h4>Rhetorical Implications</h4>
                    <p>${info.implications}</p>
                </div>
            `;
        } else if (node.type === 'woman') {
            const woman = node.data;
            content = `
                <h3>${woman.name}</h3>
                <p style="color: #00968A; font-weight: 600;">${woman.year} | ${woman.field}</p>
                <p><strong>Key Contribution:</strong> ${woman.contribution}</p>
                <div class="modal-section">
                    <h4>Biography</h4>
                    <p>${woman.fullBio}</p>
                </div>
                <div class="modal-section">
                    <h4>Rhetorical Significance & LLM Implications</h4>
                    <p>${woman.rhetoricalSignificance}</p>
                </div>
            `;
        }

        modalBody.innerHTML = content;
        modal.style.display = 'block';
    }

    // Feedback analysis functions
    window.analyzeFeedback = function() {
        try {
            const feedbackText = document.getElementById('feedbackInput').value.trim();

            if (!feedbackText) {
                alert('Please enter some feedback before analyzing.');
                return;
            }

            // Theory-related keywords
            const theoryKeywords = [
                'grammar', 'rhetorical listening', 'students rights', 'srtol', 'transfer',
                'translingualism', 'multimodality', 'language', 'dialect', 'literacy',
                'composition', 'rhetoric', 'pedagogy', 'writing', 'communication',
                'code-switching', 'code-meshing', 'multilingual', 'bilingual'
            ];

            // Pedagogical concepts
            const pedagogyKeywords = [
                'teaching', 'learning', 'classroom', 'students', 'instruction',
                'curriculum', 'assessment', 'practice', 'engagement', 'scaffolding',
                'feedback', 'assignment', 'education'
            ];

            // Connection words
            const relationshipKeywords = [
                'challenges', 'supports', 'extends', 'complements', 'transforms',
                'enables', 'facilitates', 'complicates', 'intersects', 'aligns',
                'evolves', 'relates', 'connects', 'opposes', 'builds'
            ];

            const lowerText = feedbackText.toLowerCase();
            const found = {
                theories: [],
                pedagogy: [],
                relationships: []
            };

            theoryKeywords.forEach(term => {
                if (lowerText.includes(term)) found.theories.push(term);
            });

            pedagogyKeywords.forEach(term => {
                if (lowerText.includes(term)) found.pedagogy.push(term);
            });

            relationshipKeywords.forEach(term => {
                if (lowerText.includes(term)) found.relationships.push(term);
            });

            displayKeywords(found);
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred: ' + error.message);
        }
    };

    function displayKeywords(keywords) {
        const keywordsList = document.getElementById('keywordsList');
        if (!keywordsList) return;

        keywordsList.innerHTML = '';

        if (!keywords.theories.length && !keywords.pedagogy.length && !keywords.relationships.length) {
            keywordsList.innerHTML = '<div class="keywords-placeholder">No keywords found. Try using theory-specific terms.</div>';
            return;
        }

        let html = '';

        keywords.theories.forEach(k => {
            html += `<span class="keyword-tag tag-theory">${k.charAt(0).toUpperCase() + k.slice(1)}</span> `;
        });

        keywords.pedagogy.forEach(k => {
            html += `<span class="keyword-tag tag-pedagogy">${k.charAt(0).toUpperCase() + k.slice(1)}</span> `;
        });

        keywords.relationships.forEach(k => {
            html += `<span class="keyword-tag tag-relationship">${k.charAt(0).toUpperCase() + k.slice(1)}</span> `;
        });

        keywordsList.innerHTML = html;
    }

    window.clearFeedback = function() {
        const input = document.getElementById('feedbackInput');
        const list = document.getElementById('keywordsList');
        if (input) input.value = '';
        if (list) list.innerHTML = '<div class="keywords-placeholder">Enter feedback and click "Analyze" to extract key terms and concepts</div>';
    };

})();
