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
                font: {size: 14, align: 'middle', strokeWidth: 0}
            },
            {
                from: 'grammar',
                to: 'translingualism',
                arrows: 'to',
                color: {color: '#e74c3c'},
                width: 3,
                dashes: [5, 3],
                label: 'Fundamentally rejects grammar as fixed, viewing language practices as fluid and negotiated',
                font: {size: 14, align: 'middle', strokeWidth: 0}
            },
            {
                from: 'listening',
                to: 'srtol',
                arrows: 'to,from',
                color: {color: '#27ae60'},
                width: 3,
                label: 'Both emphasize ethical imperative to value and understand different language practices across cultures',
                font: {size: 14, align: 'middle', strokeWidth: 0}
            },
            {
                from: 'listening',
                to: 'translingualism',
                arrows: 'to,from',
                color: {color: '#27ae60'},
                width: 3,
                label: 'Both promote conscious cross-cultural understanding through engagement with linguistic differences',
                font: {size: 14, align: 'middle', strokeWidth: 0}
            },
            {
                from: 'listening',
                to: 'transfer',
                arrows: 'to',
                color: {color: '#3498db'},
                width: 2,
                label: 'Rhetorical listening skills transfer and adapt across different rhetorical contexts and situations',
                font: {size: 14, align: 'middle', strokeWidth: 0}
            },
            {
                from: 'srtol',
                to: 'translingualism',
                arrows: 'to,from',
                color: {color: '#9b59b6'},
                width: 4,
                label: 'Theoretical evolution from rights-based to resource-based framing of language diversity',
                font: {size: 14, align: 'middle', strokeWidth: 0}
            },
            {
                from: 'srtol',
                to: 'transfer',
                arrows: 'to',
                color: {color: '#3498db'},
                width: 2,
                label: 'Student home languages become resources that transfer to and enrich academic writing contexts',
                font: {size: 14, align: 'middle', strokeWidth: 0}
            },
            {
                from: 'transfer',
                to: 'translingualism',
                arrows: 'to,from',
                color: {color: '#27ae60'},
                width: 3,
                label: 'Language practices and strategies transfer across linguistic and cultural boundaries',
                font: {size: 14, align: 'middle', strokeWidth: 0}
            },
            {
                from: 'transfer',
                to: 'multimodality',
                arrows: 'to,from',
                color: {color: '#27ae60'},
                width: 3,
                label: 'Multimodal composing skills and knowledge transfer across different media and contexts',
                font: {size: 14, align: 'middle', strokeWidth: 0}
            },
            {
                from: 'transfer',
                to: 'grammar',
                arrows: 'from',
                color: {color: '#95a5a6'},
                width: 2,
                dashes: [5, 5],
                label: 'Shows that grammatical knowledge does not simply move unchanged across different contexts',
                font: {size: 14, align: 'middle', strokeWidth: 0}
            },
            {
                from: 'translingualism',
                to: 'multimodality',
                arrows: 'to,from',
                color: {color: '#27ae60'},
                width: 3,
                label: 'Both theories recognize multiple resources available for creating meaning beyond single modalities',
                font: {size: 14, align: 'middle', strokeWidth: 0}
            },
            {
                from: 'multimodality',
                to: 'grammar',
                arrows: 'to',
                color: {color: '#f39c12'},
                width: 2,
                label: 'Expands grammar concept to include visual, spatial, and gestural meaning-making systems',
                font: {size: 14, align: 'middle', strokeWidth: 0}
            },
            {
                from: 'multimodality',
                to: 'srtol',
                arrows: 'from',
                color: {color: '#27ae60'},
                width: 2,
                label: 'Multimodal communication expands student rights to include diverse semiotic modes of expression',
                font: {size: 14, align: 'middle', strokeWidth: 0}
            },
            {
                from: 'multimodality',
                to: 'listening',
                arrows: 'to,from',
                color: {color: '#3498db'},
                width: 2,
                label: 'Rhetorical listening extends beyond verbal communication to include visual, spatial, and gestural modes',
                font: {size: 14, align: 'middle', strokeWidth: 0}
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
                        label: "This woman's pioneering work demonstrates how the theory operates in practice and contributes to its development",
                        font: {size: 14, align: 'middle', strokeWidth: 0}
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
                        label: "Training data bias causes this LLM to minimize or overlook this woman's foundational contributions to computing",
                        font: {size: 14, align: 'middle', strokeWidth: 0}
                    });
                });
            }
        });

        // Add LLM failure connections to theories
        const llmTheoryFailures = [
            {from: 'claude', to: 'listening', label: 'This LLM lacks capacity for conscious cross-cultural understanding and ethical engagement'},
            {from: 'claude', to: 'translingualism', label: 'This LLM tends to standardize language toward dominant patterns, erasing translingual sophistication'},
            {from: 'chatgpt', to: 'listening', label: 'This LLM lacks capacity for conscious cross-cultural understanding and ethical engagement'},
            {from: 'chatgpt', to: 'srtol', label: 'This LLM suggests corrections that erase students\' own languages in favor of standard English'},
            {from: 'gemini', to: 'multimodality', label: 'This LLM primarily processes text, struggling to understand multimodal meaning-making practices'},
            {from: 'gemini', to: 'translingualism', label: 'This LLM tends to suggest English translations, erasing the cultural specificity of translingual expression'},
            {from: 'copilot', to: 'transfer', label: 'This LLM fails to recognize how knowledge transforms when transferred across different contexts'},
            {from: 'copilot', to: 'srtol', label: 'This LLM enforces standardized forms, undermining linguistic diversity and student language rights'}
        ];

        llmTheoryFailures.forEach(conn => {
            edges.add({
                from: conn.from,
                to: conn.to,
                color: {color: '#FF8C42'},
                width: 2,
                dashes: [2, 4],
                label: conn.label,
                font: {size: 14, align: 'middle', strokeWidth: 0}
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
