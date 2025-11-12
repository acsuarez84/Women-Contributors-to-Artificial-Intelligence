// 3D Rhetoric-LLM-Women Interactive Network Visualization using force-graph-3d
// Provides user-controlled 3D rotation with limited zoom and clear text

(function() {
    'use strict';

    let graph3d;
    let womenData = [];
    let currentMode = '2d'; // Track current mode

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    async function init() {
        try {
            // Load women contributors data
            await loadWomenData();

            // Set up toggle button
            setupToggleButton();
        } catch (error) {
            console.error('Error initializing 3D network:', error);
        }
    }

    async function loadWomenData() {
        try {
            const response = await fetch('../data/women-tech-contributors.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            womenData = await response.json();
            console.log('Women contributors data loaded for 3D:', womenData);
        } catch (error) {
            console.error('Error loading women data:', error);
            womenData = [];
        }
    }

    function setupToggleButton() {
        // Create toggle button if it doesn't exist
        let toggleBtn = document.getElementById('toggle-3d-btn');
        if (!toggleBtn) {
            toggleBtn = document.createElement('button');
            toggleBtn.id = 'toggle-3d-btn';
            toggleBtn.className = 'btn btn-secondary';
            toggleBtn.textContent = 'Switch to 3D View';
            toggleBtn.style.marginLeft = '10px';

            // Find visualization controls section
            const controls = document.querySelector('.visualization-controls');
            if (controls) {
                controls.appendChild(toggleBtn);
            }
        }

        toggleBtn.addEventListener('click', toggleVisualization);
    }

    function toggleVisualization() {
        const container = document.getElementById('mynetwork');
        const toggleBtn = document.getElementById('toggle-3d-btn');

        if (!container || !toggleBtn) return;

        if (currentMode === '2d') {
            // Switch to 3D
            currentMode = '3d';
            toggleBtn.textContent = 'Switch to 2D View';
            create3DNetwork();
        } else {
            // Switch back to 2D - reload page to restore vis.js network
            location.reload();
        }
    }

    function create3DNetwork() {
        const container = document.getElementById('mynetwork');
        if (!container) {
            console.error('Network container not found');
            return;
        }

        // Clear existing content
        container.innerHTML = '';

        // Prepare data for force-graph-3d
        const graphData = prepareGraphData();

        // Create 3D graph using force-graph-3d library
        graph3d = ForceGraph3D()(container)
            .graphData(graphData)
            .nodeLabel('name')
            .nodeColor('color')
            .nodeVal('size')
            .nodeRelSize(8)
            .linkColor('linkColor')
            .linkWidth('width')
            .linkOpacity(0.6)
            .linkDirectionalArrowLength(6)
            .linkDirectionalArrowRelPos(1)
            .linkLabel('label')
            .onNodeClick(handleNodeClick)
            .enableNodeDrag(false) // Disable node dragging
            .enableNavigationControls(true)
            // Configure zoom constraints for readability
            .controlsOptions({
                minDistance: 400,  // Minimum zoom (prevent zooming in too close)
                maxDistance: 2000, // Maximum zoom (prevent zooming out too far)
                zoomSpeed: 0.5     // Reduce zoom speed for better control
            })
            .d3Force('charge', d3.forceManyBody().strength(-300))
            .d3Force('link', d3.forceLink().distance(200))
            .nodeThreeObject(node => {
                // Create text sprite for better readability
                const sprite = new SpriteText(node.name);
                sprite.color = '#ffffff';
                sprite.textHeight = 16; // Increased for readability
                sprite.backgroundColor = 'rgba(0,0,0,0.8)';
                sprite.padding = 4;
                sprite.borderRadius = 4;
                sprite.fontFace = 'Arial, sans-serif';
                return sprite;
            })
            .nodeThreeObjectExtend(true);

        // Set initial camera position for optimal view
        setTimeout(() => {
            const distance = 800;
            const angle = Math.PI / 4;
            graph3d.cameraPosition(
                {
                    x: distance * Math.sin(angle),
                    y: distance * 0.5,
                    z: distance * Math.cos(angle)
                },
                { x: 0, y: 0, z: 0 }, // lookAt
                1000 // transition duration
            );
        }, 100);
    }

    function prepareGraphData() {
        const nodes = [];
        const links = [];

        // Add theory nodes
        const theoryNodes = [
            { id: 'grammar', name: 'GRAMMAR', color: '#FF6B6B', size: 90, type: 'theory' },
            { id: 'listening', name: 'RHETORICAL\nLISTENING', color: '#4ECDC4', size: 90, type: 'theory' },
            { id: 'srtol', name: "STUDENTS' RIGHTS\nTO THEIR\nOWN LANGUAGE", color: '#45B7D1', size: 100, type: 'theory' },
            { id: 'transfer', name: 'TRANSFER', color: '#96CEB4', size: 90, type: 'theory' },
            { id: 'translingualism', name: 'TRANSLINGUALISM', color: '#45B7D1', size: 100, type: 'theory' },
            { id: 'multimodality', name: 'MULTIMODALITY', color: '#FECA57', size: 90, type: 'theory' }
        ];

        // Add LLM nodes
        const llmNodes = [
            { id: 'claude', name: 'Claude', color: '#FF8C42', size: 70, type: 'llm' },
            { id: 'chatgpt', name: 'ChatGPT', color: '#FF8C42', size: 70, type: 'llm' },
            { id: 'gemini', name: 'Gemini', color: '#FF8C42', size: 70, type: 'llm' },
            { id: 'copilot', name: 'Co-Pilot', color: '#FF8C42', size: 70, type: 'llm' }
        ];

        // Add women nodes
        const womenNodes = womenData.map(woman => {
            const nameParts = woman.name.split(' ');
            const firstName = nameParts.slice(0, -1).join(' ');
            const lastName = nameParts[nameParts.length - 1];
            const multiLineName = `${firstName}\n${lastName}`;

            return {
                id: woman.id,
                name: multiLineName,
                color: '#00968A',
                size: 60,
                type: 'woman',
                data: woman
            };
        });

        nodes.push(...theoryNodes, ...llmNodes, ...womenNodes);

        // Add theory-to-theory connections
        const theoryLinks = [
            { source: 'grammar', target: 'srtol', linkColor: '#e74c3c', width: 2, label: 'Challenges prescriptive grammar' },
            { source: 'grammar', target: 'translingualism', linkColor: '#e74c3c', width: 2, label: 'Rejects fixed grammar' },
            { source: 'listening', target: 'srtol', linkColor: '#27ae60', width: 2, label: 'Values language diversity' },
            { source: 'listening', target: 'translingualism', linkColor: '#27ae60', width: 2, label: 'Cross-cultural understanding' },
            { source: 'listening', target: 'transfer', linkColor: '#3498db', width: 2, label: 'Listening transfers contexts' },
            { source: 'srtol', target: 'translingualism', linkColor: '#9b59b6', width: 3, label: 'Theoretical evolution' },
            { source: 'srtol', target: 'transfer', linkColor: '#3498db', width: 2, label: 'Home languages transfer' },
            { source: 'transfer', target: 'translingualism', linkColor: '#27ae60', width: 2, label: 'Cross-boundary transfer' },
            { source: 'transfer', target: 'multimodality', linkColor: '#27ae60', width: 2, label: 'Multimodal transfer' },
            { source: 'transfer', target: 'grammar', linkColor: '#95a5a6', width: 2, label: 'Context-dependent grammar' },
            { source: 'translingualism', target: 'multimodality', linkColor: '#27ae60', width: 2, label: 'Multiple resources' },
            { source: 'multimodality', target: 'grammar', linkColor: '#f39c12', width: 2, label: 'Expands grammar' },
            { source: 'multimodality', target: 'srtol', linkColor: '#27ae60', width: 2, label: 'Semiotic expression' },
            { source: 'multimodality', target: 'listening', linkColor: '#3498db', width: 2, label: 'Beyond verbal' }
        ];

        links.push(...theoryLinks);

        // Add woman-to-theory connections (simplified labels for 3D)
        womenData.forEach(woman => {
            if (woman.theoryConnections) {
                woman.theoryConnections.forEach(theory => {
                    links.push({
                        source: woman.id,
                        target: theory,
                        linkColor: '#00BCD4',
                        width: 1.5,
                        label: `${woman.name} → ${theory}`
                    });
                });
            }
        });

        // Add LLM-to-woman connections
        womenData.forEach(woman => {
            if (woman.llmFailures) {
                woman.llmFailures.forEach(llm => {
                    links.push({
                        source: llm,
                        target: woman.id,
                        linkColor: '#FF8C42',
                        width: 1.5,
                        label: `${llm} erases ${woman.name}`
                    });
                });
            }
        });

        // Add LLM-to-theory failure connections
        const llmTheoryLinks = [
            { source: 'claude', target: 'listening', linkColor: '#FF8C42', width: 1.5 },
            { source: 'claude', target: 'translingualism', linkColor: '#FF8C42', width: 1.5 },
            { source: 'chatgpt', target: 'listening', linkColor: '#FF8C42', width: 1.5 },
            { source: 'chatgpt', target: 'srtol', linkColor: '#FF8C42', width: 1.5 },
            { source: 'gemini', target: 'multimodality', linkColor: '#FF8C42', width: 1.5 },
            { source: 'gemini', target: 'translingualism', linkColor: '#FF8C42', width: 1.5 },
            { source: 'copilot', target: 'transfer', linkColor: '#FF8C42', width: 1.5 },
            { source: 'copilot', target: 'srtol', linkColor: '#FF8C42', width: 1.5 }
        ];

        links.push(...llmTheoryLinks);

        return { nodes, links };
    }

    function handleNodeClick(node) {
        // Show modal with node information (reuse existing modal from 2D version)
        if (typeof showNodeModal === 'function') {
            showNodeModal(node, node.id);
        } else {
            // Basic alert if modal function not available
            alert(`${node.name}\nType: ${node.type}\nClick "Switch to 2D View" for detailed information.`);
        }
    }

    // Expose for external use if needed
    window.create3DNetwork = create3DNetwork;

})();
