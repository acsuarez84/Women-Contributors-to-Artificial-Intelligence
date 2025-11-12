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
                id: 'desc-grammar',
                label: 'Traditional prescriptive rules\n• Standardized forms\n• Correctness emphasis\n• Fixed structures\n• Privileged varieties',
                color: {background: '#f0f0f0', border: '#ccc'},
                font: {size: 27, color: '#333', multi: true},
                shape: 'box',
                shapeProperties: {borderRadius: 8},
                size: 50,
                type: 'description'
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
                id: 'desc-listening',
                label: 'Krista Ratcliffe framework\n• Conscious identification\n• Cross-cultural understanding\n• Acknowledging differences\n• Ethical engagement',
                color: {background: '#f0f0f0', border: '#ccc'},
                font: {size: 27, color: '#333', multi: true},
                shape: 'box',
                shapeProperties: {borderRadius: 8},
                size: 50,
                type: 'description'
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
                id: 'desc-srtol',
                label: '1974 CCCC Statement\n• Linguistic diversity valued\n• Home languages affirmed\n• Code-meshing supported\n• Dialect rights recognized',
                color: {background: '#f0f0f0', border: '#ccc'},
                font: {size: 27, color: '#333', multi: true},
                shape: 'box',
                shapeProperties: {borderRadius: 8},
                size: 50,
                type: 'description'
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
                id: 'desc-transfer',
                label: 'Knowledge application\n• Context adaptation\n• Writing development\n• Prior knowledge use\n• Boundary crossing',
                color: {background: '#f0f0f0', border: '#ccc'},
                font: {size: 27, color: '#333', multi: true},
                shape: 'box',
                shapeProperties: {borderRadius: 8},
                size: 50,
                type: 'description'
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
                id: 'desc-translingualism',
                label: 'Language as resource\n• Fluid practices\n• Dynamic negotiation\n• Difference as norm\n• Meaning negotiation',
                color: {background: '#f0f0f0', border: '#ccc'},
                font: {size: 27, color: '#333', multi: true},
                shape: 'box',
                shapeProperties: {borderRadius: 8},
                size: 50,
                type: 'description'
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
            {
                id: 'desc-multimodality',
                label: 'Multiple modes\n• Visual/Spatial/Aural\n• Digital composing\n• Design thinking\n• Semiotic resources',
                color: {background: '#f0f0f0', border: '#ccc'},
                font: {size: 27, color: '#333', multi: true},
                shape: 'box',
                shapeProperties: {borderRadius: 8},
                size: 50,
                type: 'description'
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
            nodes.add({
                id: woman.id,
                label: woman.name.split(' ')[0], // First name only for label
                color: '#00968A',
                font: {size: 27, color: 'white', bold: true},
                title: `${woman.name}: ${woman.contribution}`,
                size: 60,
                shape: 'diamond',
                type: 'woman',
                data: woman
            });
        });

        // Create edges array
        const edges = new vis.DataSet([
            // Connections from main nodes to their description boxes
            {from: 'grammar', to: 'desc-grammar', color: {color: '#cccccc'}, width: 2, dashes: false, smooth: {type: 'discrete'}, physics: false},
            {from: 'listening', to: 'desc-listening', color: {color: '#cccccc'}, width: 2, dashes: false, smooth: {type: 'discrete'}, physics: false},
            {from: 'srtol', to: 'desc-srtol', color: {color: '#cccccc'}, width: 2, dashes: false, smooth: {type: 'discrete'}, physics: false},
            {from: 'transfer', to: 'desc-transfer', color: {color: '#cccccc'}, width: 2, dashes: false, smooth: {type: 'discrete'}, physics: false},
            {from: 'translingualism', to: 'desc-translingualism', color: {color: '#cccccc'}, width: 2, dashes: false, smooth: {type: 'discrete'}, physics: false},
            {from: 'multimodality', to: 'desc-multimodality', color: {color: '#cccccc'}, width: 2, dashes: false, smooth: {type: 'discrete'}, physics: false},

            // Theory-to-theory connections
            {
                from: 'grammar',
                to: 'srtol',
                arrows: 'to',
                color: {color: '#e74c3c'},
                width: 3,
                dashes: [5, 3],
                title: 'SRTOL directly opposes prescriptive grammar as the sole legitimate standard',
                label: 'challenges:\nrejects monolingual\nstandard',
                font: {size: 27, align: 'middle', background: 'white', strokeWidth: 2, strokeColor: 'white'}
            },
            {
                from: 'grammar',
                to: 'translingualism',
                arrows: 'to',
                color: {color: '#e74c3c'},
                width: 3,
                dashes: [5, 3],
                title: 'Translingualism fundamentally rejects grammar as a fixed, bounded system',
                label: 'challenged by:\nfluidity vs.\nfixity',
                font: {size: 27, align: 'middle', background: 'white', strokeWidth: 2, strokeColor: 'white'}
            },
            {
                from: 'listening',
                to: 'srtol',
                arrows: 'to,from',
                color: {color: '#27ae60'},
                width: 3,
                title: 'Both emphasize the ethical imperative to value different language practices',
                label: 'mutual support:\nethical stance\non difference',
                font: {size: 27, align: 'middle', background: 'white', strokeWidth: 2, strokeColor: 'white'}
            },
            {
                from: 'listening',
                to: 'translingualism',
                arrows: 'to,from',
                color: {color: '#27ae60'},
                width: 3,
                title: 'Both promote cross-cultural understanding through conscious engagement',
                label: 'aligns:\ncross-cultural\nengagement',
                font: {size: 27, align: 'middle', background: 'white', strokeWidth: 2, strokeColor: 'white'}
            },
            {
                from: 'listening',
                to: 'transfer',
                arrows: 'to',
                color: {color: '#3498db'},
                width: 2,
                title: 'Rhetorical listening skills transfer and adapt across different contexts',
                label: 'enables:\nadaptive listening\nacross contexts',
                font: {size: 27, align: 'middle', background: 'white', strokeWidth: 2, strokeColor: 'white'}
            },
            {
                from: 'srtol',
                to: 'translingualism',
                arrows: 'to,from',
                color: {color: '#9b59b6'},
                width: 4,
                title: 'Translingualism represents theoretical evolution of SRTOL',
                label: 'evolves into:\nrights → resources\nparadigm',
                font: {size: 27, align: 'middle', background: 'white', strokeWidth: 2, strokeColor: 'white'}
            },
            {
                from: 'srtol',
                to: 'transfer',
                arrows: 'to',
                color: {color: '#3498db'},
                width: 2,
                title: 'Student home languages become resources that transfer to academic contexts',
                label: 'facilitates:\nhome language\nas scaffold',
                font: {size: 27, align: 'middle', background: 'white', strokeWidth: 2, strokeColor: 'white'}
            },
            {
                from: 'transfer',
                to: 'translingualism',
                arrows: 'to,from',
                color: {color: '#27ae60'},
                width: 3,
                title: 'Language practices transfer across linguistic boundaries',
                label: 'intersects:\nboundary crossing\npractices',
                font: {size: 27, align: 'middle', background: 'white', strokeWidth: 2, strokeColor: 'white'}
            },
            {
                from: 'transfer',
                to: 'multimodality',
                arrows: 'to,from',
                color: {color: '#27ae60'},
                width: 3,
                title: 'Multimodal composing skills transfer across different media',
                label: 'includes:\nmodal knowledge\ntransfer',
                font: {size: 27, align: 'middle', background: 'white', strokeWidth: 2, strokeColor: 'white'}
            },
            {
                from: 'transfer',
                to: 'grammar',
                arrows: 'from',
                color: {color: '#95a5a6'},
                width: 2,
                dashes: [5, 5],
                title: 'Transfer complicates grammar by showing it doesn\'t move unchanged across contexts',
                label: 'complicates:\ncontext changes\napplication',
                font: {size: 27, align: 'middle', background: 'white', strokeWidth: 2, strokeColor: 'white'}
            },
            {
                from: 'translingualism',
                to: 'multimodality',
                arrows: 'to,from',
                color: {color: '#27ae60'},
                width: 3,
                title: 'Both recognize multiple resources for meaning-making',
                label: 'complements:\nmultiple meaning\nresources',
                font: {size: 27, align: 'middle', background: 'white', strokeWidth: 2, strokeColor: 'white'}
            },
            {
                from: 'multimodality',
                to: 'grammar',
                arrows: 'to',
                color: {color: '#f39c12'},
                width: 2,
                title: 'Multimodality extends grammar to include visual, spatial grammars',
                label: 'extends:\nvisual/spatial\ngrammars',
                font: {size: 27, align: 'middle', background: 'white', strokeWidth: 2, strokeColor: 'white'}
            },
            {
                from: 'multimodality',
                to: 'srtol',
                arrows: 'from',
                color: {color: '#27ae60'},
                width: 2,
                title: 'Multimodal communication expands student rights to diverse semiotic modes',
                label: 'broadens:\nsemiotic\nrights',
                font: {size: 27, align: 'middle', background: 'white', strokeWidth: 2, strokeColor: 'white'}
            },
            {
                from: 'multimodality',
                to: 'listening',
                arrows: 'to,from',
                color: {color: '#3498db'},
                width: 2,
                title: 'Rhetorical listening extends beyond verbal to multimodal modes',
                label: 'expands:\nmultimodal\nlistening',
                font: {size: 27, align: 'middle', background: 'white', strokeWidth: 2, strokeColor: 'white'}
            }
        ]);

        // Add woman-to-theory connections
        womenData.forEach(woman => {
            if (woman.theoryConnections) {
                woman.theoryConnections.forEach(theoryId => {
                    edges.add({
                        from: woman.id,
                        to: theoryId,
                        color: {color: '#00BCD4'},
                        width: 2,
                        dashes: [5, 3],
                        title: `${woman.name}'s work exemplifies this theory`,
                        label: 'exemplifies',
                        font: {size: 27, align: 'middle', background: 'white', strokeWidth: 2, strokeColor: 'white'}
                    });
                });
            }

            // Add LLM-to-woman erasure connections
            if (woman.llmFailures) {
                woman.llmFailures.forEach(llmId => {
                    edges.add({
                        from: llmId,
                        to: woman.id,
                        color: {color: '#FF8C42'},
                        width: 2,
                        dashes: [3, 6],
                        title: `${llmId} perpetuates erasure of ${woman.name}'s contributions`,
                        label: 'erases',
                        font: {size: 27, align: 'middle', background: 'white', strokeWidth: 2, strokeColor: 'white'}
                    });
                });
            }
        });

        // Add LLM failure connections to theories
        const llmTheoryFailures = [
            {from: 'claude', to: 'listening', label: 'cannot practice'},
            {from: 'claude', to: 'translingualism', label: 'homogenizes'},
            {from: 'chatgpt', to: 'listening', label: 'cannot practice'},
            {from: 'chatgpt', to: 'srtol', label: 'corrects away'},
            {from: 'gemini', to: 'multimodality', label: 'text-centric'},
            {from: 'gemini', to: 'translingualism', label: 'anglicizes'},
            {from: 'copilot', to: 'transfer', label: 'ignores context'},
            {from: 'copilot', to: 'srtol', label: 'standardizes'}
        ];

        llmTheoryFailures.forEach(conn => {
            edges.add({
                from: conn.from,
                to: conn.to,
                color: {color: '#FF8C42'},
                width: 2,
                dashes: [2, 4],
                title: `${conn.from} fails to uphold this theory`,
                label: conn.label,
                font: {size: 10, align: 'middle', background: 'white', strokeWidth: 2, strokeColor: 'white'}
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

            // Position main nodes (doubled for larger canvas)
            const positions = [
                {id: 'grammar', x: -600, y: -400},
                {id: 'listening', x: 600, y: -400},
                {id: 'srtol', x: -900, y: 200},
                {id: 'transfer', x: 0, y: 0},
                {id: 'translingualism', x: 900, y: 200},
                {id: 'multimodality', x: 0, y: 600}
            ];

            // Position description boxes (doubled for larger canvas)
            const descPositions = [
                {id: 'desc-grammar', x: -600, y: -700},
                {id: 'desc-listening', x: 600, y: -700},
                {id: 'desc-srtol', x: -1300, y: 200},
                {id: 'desc-transfer', x: 0, y: -300},
                {id: 'desc-translingualism', x: 1300, y: 200},
                {id: 'desc-multimodality', x: 0, y: 900}
            ];

            // Position LLMs on right side (doubled for larger canvas)
            const llmPositions = [
                {id: 'claude', x: 1100, y: -300},
                {id: 'chatgpt', x: 1100, y: -100},
                {id: 'gemini', x: 1100, y: 100},
                {id: 'copilot', x: 1100, y: 300}
            ];

            // Position women in circular pattern (doubled radius)
            const womenCount = womenData.length;
            womenData.forEach((woman, index) => {
                const angle = (index / womenCount) * Math.PI * 2 - Math.PI / 2;
                const radius = 400;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                network.moveNode(woman.id, x, y);
            });

            positions.forEach(pos => network.moveNode(pos.id, pos.x, pos.y));
            descPositions.forEach(pos => network.moveNode(pos.id, pos.x, pos.y));
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
