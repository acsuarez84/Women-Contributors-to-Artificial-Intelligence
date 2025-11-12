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
                font: {size: 27, color: 'white', bold: false},
                title: 'Click for full description',
                size: 90,
                shape: 'circle',
                type: 'theory'
            },
            {
                id: 'listening',
                label: 'RHETORICAL\nLISTENING',
                color: '#4ECDC4',
                font: {size: 27, color: 'white', bold: false},
                title: 'Click for full description',
                size: 90,
                shape: 'circle',
                type: 'theory'
            },
            {
                id: 'srtol',
                label: "STUDENTS' RIGHTS\nTO THEIR\nOWN LANGUAGE",
                color: '#45B7D1',
                font: {size: 27, color: 'white', bold: false},
                title: 'Click for full description',
                size: 100,
                shape: 'circle',
                type: 'theory'
            },
            {
                id: 'transfer',
                label: 'TRANSFER',
                color: '#96CEB4',
                font: {size: 27, color: 'white', bold: false},
                title: 'Click for full description',
                size: 90,
                shape: 'circle',
                type: 'theory'
            },
            {
                id: 'translingualism',
                label: 'TRANSLINGUALISM',
                color: '#45B7D1',
                font: {size: 27, color: 'white', bold: false},
                title: 'Click for full description',
                size: 100,
                shape: 'circle',
                type: 'theory'
            },
            {
                id: 'multimodality',
                label: 'MULTIMODALITY',
                color: '#FECA57',
                font: {size: 27, color: 'white', bold: false},
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
                font: {size: 27, color: 'white', bold: false},
                title: 'Click to see how Claude functions',
                size: 70,
                shape: 'box',
                type: 'llm'
            },
            {
                id: 'chatgpt',
                label: 'ChatGPT',
                color: '#FF8C42',
                font: {size: 27, color: 'white', bold: false},
                title: 'Click to see how ChatGPT functions',
                size: 70,
                shape: 'box',
                type: 'llm'
            },
            {
                id: 'gemini',
                label: 'Gemini',
                color: '#FF8C42',
                font: {size: 27, color: 'white', bold: false},
                title: 'Click to see how Gemini functions',
                size: 70,
                shape: 'box',
                type: 'llm'
            },
            {
                id: 'copilot',
                label: 'Co-Pilot',
                color: '#FF8C42',
                font: {size: 27, color: 'white', bold: false},
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

            // Split name into first and last name for two-line display
            const nameParts = woman.name.split(' ');
            const firstName = nameParts.slice(0, -1).join(' '); // Everything except last word
            const lastName = nameParts[nameParts.length - 1]; // Last word
            const multiLineName = `${firstName}\n${lastName}`;

            nodes.add({
                id: woman.id,
                label: multiLineName, // Multi-line name: first on top, last on bottom
                color: '#00968A',
                font: {size: 27, color: 'white', bold: false},
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
                label: 'Directly challenges prescriptive grammar\nby rejecting monolingual standards\nand affirming linguistic diversity',
                font: {size: 14, align: 'middle', color: 'white', background: 'rgba(0,0,0,0.7)', multi: 'html', maxWidth: 200, bold: false}
            },
            {
                from: 'grammar',
                to: 'translingualism',
                arrows: 'to',
                color: {color: '#e74c3c'},
                width: 3,
                dashes: [5, 3],
                label: 'Fundamentally rejects grammar as\nfixed, viewing language practices\nas fluid and negotiated',
                font: {size: 14, align: 'middle', color: 'white', background: 'rgba(0,0,0,0.7)', multi: 'html', maxWidth: 200, bold: false}
            },
            {
                from: 'listening',
                to: 'srtol',
                arrows: 'to,from',
                color: {color: '#27ae60'},
                width: 3,
                label: 'Both emphasize ethical imperative\nto value and understand\ndifferent language practices across\ncultures',
                font: {size: 14, align: 'middle', color: 'white', background: 'rgba(0,0,0,0.7)', multi: 'html', maxWidth: 200, bold: false}
            },
            {
                from: 'listening',
                to: 'translingualism',
                arrows: 'to,from',
                color: {color: '#27ae60'},
                width: 3,
                label: 'Both promote conscious cross-cultural\nunderstanding through engagement with\nlinguistic differences',
                font: {size: 14, align: 'middle', color: 'white', background: 'rgba(0,0,0,0.7)', multi: 'html', maxWidth: 200, bold: false}
            },
            {
                from: 'listening',
                to: 'transfer',
                arrows: 'to',
                color: {color: '#3498db'},
                width: 2,
                label: 'Rhetorical listening skills transfer\nand adapt across different\nrhetorical contexts and situations',
                font: {size: 14, align: 'middle', color: 'white', background: 'rgba(0,0,0,0.7)', multi: 'html', maxWidth: 200, bold: false}
            },
            {
                from: 'srtol',
                to: 'translingualism',
                arrows: 'to,from',
                color: {color: '#9b59b6'},
                width: 4,
                label: 'Theoretical evolution from rights-based\nto resource-based framing of\nlanguage diversity',
                font: {size: 14, align: 'middle', color: 'white', background: 'rgba(0,0,0,0.7)', multi: 'html', maxWidth: 200, bold: false}
            },
            {
                from: 'srtol',
                to: 'transfer',
                arrows: 'to',
                color: {color: '#3498db'},
                width: 2,
                label: 'Student home languages become\nresources that transfer to\nand enrich academic writing\ncontexts',
                font: {size: 14, align: 'middle', color: 'white', background: 'rgba(0,0,0,0.7)', multi: 'html', maxWidth: 200, bold: false}
            },
            {
                from: 'transfer',
                to: 'translingualism',
                arrows: 'to,from',
                color: {color: '#27ae60'},
                width: 3,
                label: 'Language practices and strategies\ntransfer across linguistic and\ncultural boundaries',
                font: {size: 14, align: 'middle', color: 'white', background: 'rgba(0,0,0,0.7)', multi: 'html', maxWidth: 200, bold: false}
            },
            {
                from: 'transfer',
                to: 'multimodality',
                arrows: 'to,from',
                color: {color: '#27ae60'},
                width: 3,
                label: 'Multimodal composing skills and\nknowledge transfer across different\nmedia and contexts',
                font: {size: 14, align: 'middle', color: 'white', background: 'rgba(0,0,0,0.7)', multi: 'html', maxWidth: 200, bold: false}
            },
            {
                from: 'transfer',
                to: 'grammar',
                arrows: 'from',
                color: {color: '#95a5a6'},
                width: 2,
                dashes: [5, 5],
                label: 'Shows that grammatical knowledge\ndoes not simply move\nunchanged across different contexts',
                font: {size: 14, align: 'middle', color: 'white', background: 'rgba(0,0,0,0.7)', multi: 'html', maxWidth: 200, bold: false}
            },
            {
                from: 'translingualism',
                to: 'multimodality',
                arrows: 'to,from',
                color: {color: '#27ae60'},
                width: 3,
                label: 'Both theories recognize multiple\nresources available for creating\nmeaning beyond single modalities',
                font: {size: 14, align: 'middle', color: 'white', background: 'rgba(0,0,0,0.7)', multi: 'html', maxWidth: 200, bold: false}
            },
            {
                from: 'multimodality',
                to: 'grammar',
                arrows: 'to',
                color: {color: '#f39c12'},
                width: 2,
                label: 'Expands grammar concept to\ninclude visual, spatial, and\ngestural meaning-making systems',
                font: {size: 14, align: 'middle', color: 'white', background: 'rgba(0,0,0,0.7)', multi: 'html', maxWidth: 200, bold: false}
            },
            {
                from: 'multimodality',
                to: 'srtol',
                arrows: 'from',
                color: {color: '#27ae60'},
                width: 2,
                label: 'Multimodal communication expands student\nrights to include diverse\nsemiotic modes of expression',
                font: {size: 14, align: 'middle', color: 'white', background: 'rgba(0,0,0,0.7)', multi: 'html', maxWidth: 200, bold: false}
            },
            {
                from: 'multimodality',
                to: 'listening',
                arrows: 'to,from',
                color: {color: '#3498db'},
                width: 2,
                label: 'Rhetorical listening extends beyond\nverbal communication to include\nvisual, spatial, and gestural\nmodes',
                font: {size: 14, align: 'middle', color: 'white', background: 'rgba(0,0,0,0.7)', multi: 'html', maxWidth: 200, bold: false}
            }
        ]);

        // Add woman-to-theory connections with unique explanations
        const womanTheoryConnections = {
            'ada-lovelace-transfer': {from: 'ada-lovelace', to: 'transfer', label: "Lovelace transferred mathematical concepts\ninto computational thinking, pioneering\nalgorithmic logic that crossed\ndisciplinary boundaries"},
            'ada-lovelace-multimodality': {from: 'ada-lovelace', to: 'multimodality', label: "Her extensive annotations and\ndiagrams exemplify multimodal technical\ncommunication, combining text, notation,\nand visual representation"},
            'grace-hopper-translingualism': {from: 'grace-hopper', to: 'translingualism', label: "Hopper's COBOL embodies translingual\nprinciples by making code\nreadable across technical and\nnon-technical communities"},
            'grace-hopper-grammar': {from: 'grace-hopper', to: 'grammar', label: "She established grammatical conventions\nfor programming languages, creating\nsyntax rules that balanced\nstructure with accessibility"},
            'grace-hopper-transfer': {from: 'grace-hopper', to: 'transfer', label: "Her compiler work demonstrated\nhow natural language concepts\ntransfer into machine-readable instructions"},
            'katherine-johnson-listening': {from: 'katherine-johnson', to: 'listening', label: "Johnson practiced rhetorical listening\nby understanding unspoken technical\nneeds and translating them\ninto precise mathematical solutions"},
            'katherine-johnson-srtol': {from: 'katherine-johnson', to: 'srtol', label: "Her erasure from NASA\nnarratives exemplifies the need\nfor recognizing all contributors'\nintellectual languages and rights\nto recognition"},
            'margaret-hamilton-grammar': {from: 'margaret-hamilton', to: 'grammar', label: "Hamilton established rigorous grammatical\nstandards for software engineering,\nlegitimizing code as a\nformal engineering language"},
            'margaret-hamilton-multimodality': {from: 'margaret-hamilton', to: 'multimodality', label: "Her extensive documentation combined\ncode, diagrams, flowcharts, and\nwritten explanations in multimodal\nengineering practice"},
            'margaret-hamilton-srtol': {from: 'margaret-hamilton', to: 'srtol', label: "She fought for software\ndevelopers' right to be\nrecognized as engineers, validating\ntheir technical language and\nintellectual contributions"},
            'radia-perlman-transfer': {from: 'radia-perlman', to: 'transfer', label: "Perlman transferred biological concepts\n(trees, roots, spanning) into\nnetwork engineering, demonstrating cross-domain\nknowledge application"},
            'radia-perlman-multimodality': {from: 'radia-perlman', to: 'multimodality', label: "Her playful, accessible technical\nwriting combines poetry, diagrams,\nand prose, challenging gatekeeping\ntechnical communication norms"},
            'fei-fei-li-listening': {from: 'fei-fei-li', to: 'listening', label: "Li's work on human-centered\nAI demands rhetorical listening\nto diverse communities about\ndataset bias and representation"},
            'fei-fei-li-multimodality': {from: 'fei-fei-li', to: 'multimodality', label: "ImageNet revolutionized how machines\nprocess multimodal visual information,\nthough it perpetuated existing\nvisual biases"},
            'fei-fei-li-srtol': {from: 'fei-fei-li', to: 'srtol', label: "Her advocacy for inclusive\nAI echoes students' rights\narguments—both assert the legitimacy\nof diverse voices against\ndominant norms"},
            'joy-buolamwini-listening': {from: 'joy-buolamwini', to: 'listening', label: "Buolamwini's research requires rhetorical\nlistening to marginalized communities'\nlived experiences with biased\nAI systems"},
            'joy-buolamwini-srtol': {from: 'joy-buolamwini', to: 'srtol', label: "She exposes how AI\nsystems fail to recognize\ndarker-skinned faces, paralleling how\ninstitutions fail to recognize\nmarginalized voices"},
            'joy-buolamwini-translingualism': {from: 'joy-buolamwini', to: 'translingualism', label: "Her work reveals how\nAI systems privilege dominant\nvisual 'languages' while erasing\nculturally-specific modes of expression"},
            'timnit-gebru-listening': {from: 'timnit-gebru', to: 'listening', label: "Gebru's 'Stochastic Parrots' demands\nwe listen to how\nLLMs perpetuate linguistic and\ncultural bias at scale"},
            'timnit-gebru-srtol': {from: 'timnit-gebru', to: 'srtol', label: "Her silencing by Google\nmirrors institutional suppression of\nthose who assert their\nright to critique technological\nhegemony"},
            'timnit-gebru-grammar': {from: 'timnit-gebru', to: 'grammar', label: "She reveals how LLM\ntraining imposes dominant grammatical\npatterns, erasing the legitimacy\nof diverse linguistic practices"}
        };

        Object.values(womanTheoryConnections).forEach(conn => {
            edges.add({
                from: conn.from,
                to: conn.to,
                color: {color: '#00BCD4'},
                width: 2,
                dashes: [5, 3],
                label: conn.label,
                font: {size: 14, align: 'middle', color: 'white', background: 'rgba(0,0,0,0.7)', multi: 'html', maxWidth: 200, bold: false}
            });
        });

        // Add LLM-to-woman erasure connections with unique explanations
        const llmWomanConnections = {
            'claude-ada-lovelace': {from: 'claude', to: 'ada-lovelace', label: "Claude's training data underrepresents\nwomen's foundational computing work,\noften attributing Lovelace's algorithm\nto Babbage"},
            'claude-katherine-johnson': {from: 'claude', to: 'katherine-johnson', label: "Claude lacks contextual understanding\nto recognize how Johnson's\ncalculations required cross-cultural technical\ntranslation"},
            'claude-margaret-hamilton': {from: 'claude', to: 'margaret-hamilton', label: "Claude perpetuates narratives that\nminimize Hamilton's software engineering\nleadership, focusing on astronauts\nover ground control"},
            'claude-fei-fei-li': {from: 'claude', to: 'fei-fei-li', label: "Claude fails to connect\nLi's ImageNet work to\nbroader implications about bias\nin its own training\ndatasets"},
            'claude-joy-buolamwini': {from: 'claude', to: 'joy-buolamwini', label: "Claude cannot engage with\nBuolamwini's critiques of AI\nbias because it lacks\ncapacity for genuine self-reflection"},
            'claude-timnit-gebru': {from: 'claude', to: 'timnit-gebru', label: "Claude was trained during\nthe controversy of Gebru's\nfiring, yet its training\nprocess embodies the problems\nshe exposed"},
            'chatgpt-ada-lovelace': {from: 'chatgpt', to: 'ada-lovelace', label: "ChatGPT often presents Lovelace\nas Babbage's assistant rather\nthan independent mathematician and\npioneering programmer"},
            'chatgpt-grace-hopper': {from: 'chatgpt', to: 'grace-hopper', label: "ChatGPT's code suggestions favor\nterse, exclusive styles over\nHopper's accessible, documentation-rich approach"},
            'chatgpt-fei-fei-li': {from: 'chatgpt', to: 'fei-fei-li', label: "ChatGPT uses ImageNet-influenced models\nwhile failing to acknowledge\nLi's warnings about perpetuating\ndataset bias"},
            'chatgpt-joy-buolamwini': {from: 'chatgpt', to: 'joy-buolamwini', label: "ChatGPT cannot recognize how\nits own design perpetuates\nthe algorithmic injustice Buolamwini\ndocuments"},
            'chatgpt-timnit-gebru': {from: 'chatgpt', to: 'timnit-gebru', label: "ChatGPT exemplifies the 'stochastic\nparrot' phenomenon Gebru warned\nabout—producing fluent text without\ngenuine understanding"},
            'gemini-katherine-johnson': {from: 'gemini', to: 'katherine-johnson', label: "Gemini's training emphasizes space\ntechnology hardware over Johnson's\nintellectual labor as a\nBlack woman mathematician"},
            'gemini-radia-perlman': {from: 'gemini', to: 'radia-perlman', label: "Gemini's technical responses reflect\ngatekeeping jargon rather than\nPerlman's playful, accessible communication\nstyle"},
            'gemini-fei-fei-li': {from: 'gemini', to: 'fei-fei-li', label: "Gemini processes multimodal inputs\nwhile ignoring Li's research\non how visual AI\nperpetuates bias against people\nof color"},
            'gemini-joy-buolamwini': {from: 'gemini', to: 'joy-buolamwini', label: "Gemini's image recognition builds\non systems Buolamwini proved\nfail for darker-skinned faces,\nyet Google continued deployment"},
            'gemini-timnit-gebru': {from: 'gemini', to: 'timnit-gebru', label: "Gemini represents Google's continued\ninvestment in LLMs despite\nGebru's warnings about their\nenvironmental and social costs"},
            'copilot-grace-hopper': {from: 'copilot', to: 'grace-hopper', label: "Co-Pilot suggests terse code\nover documented, readable approaches\nthat honor Hopper's translingual\naccessibility principles"},
            'copilot-margaret-hamilton': {from: 'copilot', to: 'margaret-hamilton', label: "Co-Pilot's code suggestions often\nskip rigorous validation and\ndocumentation that Hamilton established\nas essential"},
            'copilot-joy-buolamwini': {from: 'copilot', to: 'joy-buolamwini', label: "Co-Pilot trains on GitHub\nrepositories that reflect systemic\nexclusion of women and\npeople of color that\nBuolamwini exposes"}
        };

        Object.values(llmWomanConnections).forEach(conn => {
            edges.add({
                from: conn.from,
                to: conn.to,
                color: {color: '#FF8C42'},
                width: 2,
                dashes: [3, 6],
                label: conn.label,
                font: {size: 14, align: 'middle', color: 'white', background: 'rgba(0,0,0,0.7)', multi: 'html', maxWidth: 200, bold: false}
            });
        });

        // Add LLM failure connections to theories with specific explanations
        const llmTheoryFailures = [
            {from: 'claude', to: 'listening', label: 'Claude lacks capacity for\nconscious cross-cultural understanding because\nit cannot engage in\ngenuine ethical reflection about\nwhose voices it amplifies\nor erases'},
            {from: 'claude', to: 'translingualism', label: 'Claude standardizes language toward\ndominant English patterns, treating\ncode-switching as error rather\nthan sophisticated rhetorical strategy'},
            {from: 'chatgpt', to: 'listening', label: 'ChatGPT cannot practice rhetorical\nlistening because it has\nno awareness of its\nown positionality or the\npower dynamics embedded in\nits training data'},
            {from: 'chatgpt', to: 'srtol', label: 'ChatGPT systematically corrects nonstandard\nEnglish and code-meshing, violating\nstudents\' rights to their\nown linguistic practices'},
            {from: 'gemini', to: 'multimodality', label: 'Gemini processes multimodal inputs\nthrough text-centric understanding, missing\nhow images, gestures, and\nspatial arrangements create culturally-specific\nmeaning'},
            {from: 'gemini', to: 'translingualism', label: 'Gemini offers English translations\ninstead of preserving translingual\ncomplexity, erasing the cultural\nwork that language-mixing performs'},
            {from: 'copilot', to: 'transfer', label: 'Co-Pilot suggests code without\nrecognizing how programming knowledge\ntransforms across contexts, treating\ntransfer as simple copy-paste'},
            {from: 'copilot', to: 'srtol', label: 'Co-Pilot enforces standardized naming\nconventions and style guides,\nerasing programmers\' rights to\ntheir own expressive and\ncultural coding practices'}
        ];

        llmTheoryFailures.forEach(conn => {
            edges.add({
                from: conn.from,
                to: conn.to,
                color: {color: '#FF8C42'},
                width: 2,
                dashes: [2, 4],
                label: conn.label,
                font: {size: 14, align: 'middle', color: 'white', background: 'rgba(0,0,0,0.7)', multi: 'html', maxWidth: 200, bold: false}
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
