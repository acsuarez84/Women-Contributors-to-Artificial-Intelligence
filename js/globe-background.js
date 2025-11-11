/**
 * globe-background.js - 3D rotating Earth globe background for homepage
 * Uses Three.js for realistic 3D rendering
 */

(function() {
  // Only run on homepage
  if (!document.body.classList.contains('homepage')) {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
  }

  // Wait for Three.js to load
  if (typeof THREE === 'undefined') {
    console.warn('Three.js not loaded. Globe will not be displayed.');
    return;
  }

  let scene, camera, renderer, globe, clouds;
  let animationId;

  function init() {
    // Create container for globe
    const container = document.createElement('div');
    container.id = 'globe-container';
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      z-index: -1;
      pointer-events: none;
      opacity: 0.15;
    `;
    document.body.insertBefore(container, document.body.firstChild);

    // Scene setup
    scene = new THREE.Scene();

    // Camera setup
    camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 2.5;

    // Renderer setup
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Create Earth sphere
    const geometry = new THREE.SphereGeometry(1, 64, 64);

    // Create realistic Earth material
    const material = new THREE.MeshPhongMaterial({
      color: 0x2233ff,
      emissive: 0x112244,
      specular: 0x333333,
      shininess: 15,
      flatShading: false
    });

    // Add landmasses using a different color approach
    // Creating a simple earth without texture
    const earthMaterial = createEarthMaterial();
    globe = new THREE.Mesh(geometry, earthMaterial);
    scene.add(globe);

    // Add subtle atmosphere glow
    const atmosphereGeometry = new THREE.SphereGeometry(1.05, 64, 64);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x4488ff,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // Start animation
    animate();

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);

    // Pause/resume on visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else {
        animate();
      }
    });
  }

  function createEarthMaterial() {
    // Create a material with ocean blue and green/brown land colors
    // Using vertex colors or a simple approach
    return new THREE.MeshPhongMaterial({
      color: 0x1a5fa0,  // Ocean blue
      emissive: 0x0a2f50,
      specular: 0x222222,
      shininess: 20,
      flatShading: false
    });
  }

  function animate() {
    animationId = requestAnimationFrame(animate);

    // Slow rotation
    globe.rotation.y += 0.001;  // Very slow, subtle rotation

    // Slight wobble on x-axis
    globe.rotation.x = Math.sin(Date.now() * 0.0001) * 0.05;

    renderer.render(scene, camera);
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // Cleanup function
  function cleanup() {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    if (renderer) {
      renderer.dispose();
    }
    const container = document.getElementById('globe-container');
    if (container) {
      container.remove();
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export cleanup for potential use
  window.globeCleanup = cleanup;
})();
