// Snow effect using Three.js
let scene, camera, renderer, particles, particleCount;
const snowflakes = [];

function initSnow() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    renderer = new THREE.WebGLRenderer({ 
        alpha: true,
        antialias: true 
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.classList.add('snow-canvas');
    document.querySelector('.snow').appendChild(renderer.domElement);

    // Camera position
    camera.position.z = 350;

    // Create particles
    particleCount = 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const sizes = [];

    for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * 1000 - 500;
        const y = Math.random() * 1000 - 500;
        const z = Math.random() * 500 - 250;
        positions.push(x, y, z);
        sizes.push(Math.random() * 2 + 0.5);
        
        snowflakes.push({
            velocity: Math.random() * 0.3 + 0.1, // Slowed down vertical speed
            swing: Math.random() * 0.2 + 0.1,
            originalX: x,
            swingSpeed: Math.random() * 0.01, // Slowed down swing speed
            swingRadius: Math.random() * 3
        });
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

    // Create material
    const material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 2,
        transparent: true,
        opacity: 0.8,
        map: createSnowflakeTexture(),
        blending: THREE.AdditiveBlending,
        depthTest: false
    });

    // Create particle system
    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Start animation
    animate();
}

function createSnowflakeTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const context = canvas.getContext('2d');

    // Create a soft, glowing snowflake
    const gradient = context.createRadialGradient(8, 8, 0, 8, 8, 8);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    context.fillStyle = gradient;
    context.fillRect(0, 0, 16, 16);

    return new THREE.CanvasTexture(canvas);
}

let lastTime = 0;
function animate(currentTime = 0) {
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    requestAnimationFrame(animate);

    const positions = particles.geometry.attributes.position.array;
    let snowVisible = !document.querySelector('.quote-text').classList.contains('active');

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Update Y position
        positions[i3 + 1] -= snowflakes[i].velocity * (deltaTime * 0.1);

        // Add gentle swinging motion
        snowflakes[i].swing += snowflakes[i].swingSpeed;
        positions[i3] = snowflakes[i].originalX + Math.sin(snowflakes[i].swing) * snowflakes[i].swingRadius * 0.1;

        // Reset if below screen
        if (positions[i3 + 1] < -500) {
            positions[i3 + 1] = 500;
        }
    }

    // Update opacity based on quote state
    particles.material.opacity = snowVisible ? 0.8 : 0.2;

    particles.geometry.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Initialize snow effect
initSnow();