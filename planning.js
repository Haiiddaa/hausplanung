// Erstellen Sie eine Szene, eine Kamera und ein Renderelement
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas').appendChild(renderer.domElement);

// Erstellen Sie ein Möbelstück (z. B. ein Sofa)
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const sofa = new THREE.Mesh(geometry, material);
scene.add(sofa);

// Positionieren Sie das Möbelstück in der Szene
sofa.position.set(0, 0, -5);

// Positionieren und richten Sie die Kamera aus
camera.position.z = 5;

// Fügen Sie eine Lichtquelle hinzu
const light = new THREE.PointLight(0xffffff, 1);
light.position.set(0, 0, 10);
scene.add(light);

// Animieren Sie die Szene
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
