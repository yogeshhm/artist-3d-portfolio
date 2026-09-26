/**
 * AuraArt Studio - 3D WebGL Background Scene
 * Built with Three.js
 */

(function init3DScene() {
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    // 1. Scene, Camera, Renderer Setup
    const scene = new THREE.Scene();
    
    // Add subtle ambient fog for depth
    scene.fog = new THREE.FogExp2(0x07080d, 0.0015);

    const camera = new THREE.PerspectiveCamera(
        75, 
        window.innerWidth / window.innerHeight, 
        0.1, 
        1000
    );
    camera.position.z = 400;

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 2. Mouse Interactive Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (e) => {
        targetMouseX = (e.clientX - windowHalfX) * 0.08;
        targetMouseY = (e.clientY - windowHalfY) * 0.08;
    });

    // 3. Create 3D Floating Particle Constellation
    const particleCount = 700;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorCyan = new THREE.Color(0x00f0ff);
    const colorPurple = new THREE.Color(0x9d4edd);
    const colorGold = new THREE.Color(0xffaa00);

    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 1200;
        positions[i + 1] = (Math.random() - 0.5) * 1200;
        positions[i + 2] = (Math.random() - 0.5) * 800;

        // Mix particle colors
        const rand = Math.random();
        let pColor = rand > 0.6 ? colorCyan : (rand > 0.3 ? colorPurple : colorGold);

        colors[i] = pColor.r;
        colors[i + 1] = pColor.g;
        colors[i + 2] = pColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle texture point material
    const material = new THREE.PointsMaterial({
        size: 3.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    // 4. Create Interactive 3D Wireframe Icosahedron (Geometric Sculpture)
    const shapeGeo = new THREE.IcosahedronGeometry(120, 1);
    const shapeMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        wireframe: true,
        transparent: true,
        opacity: 0.12
    });
    const icosahedron = new THREE.Mesh(shapeGeo, shapeMat);
    icosahedron.position.set(200, -50, 0);
    scene.add(icosahedron);

    // Outer accent ring
    const ringGeo = new THREE.TorusGeometry(180, 1.2, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
        color: 0x9d4edd,
        wireframe: true,
        transparent: true,
        opacity: 0.2
    });
    const torusRing = new THREE.Mesh(ringGeo, ringMat);
    torusRing.position.set(200, -50, 0);
    torusRing.rotation.x = Math.PI / 4;
    scene.add(torusRing);

    // 5. Animation Loop
    let clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        // Smooth mouse inertia
        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;

        // Rotate particles slowly & shift with mouse
        particleSystem.rotation.y = elapsedTime * 0.03;
        particleSystem.rotation.x = elapsedTime * 0.015;

        particleSystem.position.x = mouseX * 0.5;
        particleSystem.position.y = -mouseY * 0.5;

        // Rotate 3D geometric art sculptures
        icosahedron.rotation.x = elapsedTime * 0.1;
        icosahedron.rotation.y = elapsedTime * 0.15;

        torusRing.rotation.y = elapsedTime * -0.08;
        torusRing.rotation.z = elapsedTime * 0.05;

        // Camera subtle sway
        camera.position.x += (mouseX - camera.position.x) * 0.02;
        camera.position.y += (-mouseY - camera.position.y) * 0.02;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    animate();

    // 6. Handle Window Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
})();
