import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
const container = document.getElementById('canvas-container');

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
container.appendChild(renderer.domElement);

// Particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 5000;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 5;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.005,
    color: 0x1a237e,
    transparent: true,
    opacity: 0.8
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Create floating shapes
const shapes = [];
const shapeGeometries = [
    new THREE.IcosahedronGeometry(0.3, 0),
    new THREE.OctahedronGeometry(0.3, 0),
    new THREE.TetrahedronGeometry(0.3, 0)
];

for(let i = 0; i < 10; i++) {
    const geometry = shapeGeometries[Math.floor(Math.random() * shapeGeometries.length)];
    const material = new THREE.MeshPhongMaterial({
        color: 0x304ffe,
        shininess: 100,
        transparent: true,
        opacity: 0.7
    });
    const shape = new THREE.Mesh(geometry, material);
    
    shape.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
    );
    
    shape.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
    );
    
    shapes.push(shape);
    scene.add(shape);
}

// Load 3D Text
const fontLoader = new FontLoader();
fontLoader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', function(font) {
    const textGeometry = new TextGeometry('ISM 50', {
        font: font,
        size: 1,
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5
    });
    
    const textMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x1a237e,
        specular: 0x050505,
        shininess: 100
    });
    
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textGeometry.center();
    scene.add(textMesh);
    
    // Add glow effect
    const glowMaterial = new THREE.ShaderMaterial({
        uniforms: {
            coefficient: { value: 0.5 },
            color: { value: new THREE.Color(0x304ffe) },
            power: { value: 2.0 }
        },
        vertexShader: `
            varying vec3 vNormal;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float coefficient;
            uniform vec3 color;
            uniform float power;
            varying vec3 vNormal;
            void main() {
                float intensity = pow(coefficient - dot(vNormal, vec3(0.0, 0.0, 1.0)), power);
                gl_FragColor = vec4(color, intensity);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending
    });
    
    const glowMesh = new THREE.Mesh(textGeometry, glowMaterial);
    glowMesh.scale.multiplyScalar(1.1);
    scene.add(glowMesh);
});

// Lighting
const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(5, 5, 5);
pointLight.castShadow = true;
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

// Add spotlight
const spotlight = new THREE.SpotLight(0x304ffe, 1);
spotlight.position.set(0, 10, 0);
spotlight.angle = Math.PI / 4;
spotlight.penumbra = 0.1;
spotlight.decay = 2;
spotlight.distance = 200;
spotlight.castShadow = true;
scene.add(spotlight);

// Camera position
camera.position.z = 5;

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;

// Mouse movement effect
let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX / window.innerWidth - 0.5;
    mouseY = event.clientY / window.innerHeight - 0.5;
});

// Animation
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate particles
    particlesMesh.rotation.y += 0.001;
    
    // Animate shapes
    shapes.forEach((shape, i) => {
        shape.rotation.x += 0.01 * (i % 2 ? 1 : -1);
        shape.rotation.y += 0.01 * (i % 3 ? 1 : -1);
        shape.position.y += Math.sin(Date.now() * 0.001 + i) * 0.002;
    });
    
    // Mouse movement effect
    camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 2 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    
    controls.update();
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start animation
animate();
