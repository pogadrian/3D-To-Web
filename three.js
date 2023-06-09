import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { MeshBasicMaterial, Mesh } from 'three';

// Importarea bibliotecilor necesare pentru utilizarea Three.js

const canvas = document.querySelector('#webgl');
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setClearColor(0x000000, 0);
const scene = new THREE.Scene();

// Setarea canvas-ului pentru afișarea graficelor 3D

const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight);
camera.position.set(1, 300, 200);

// Setarea camerei de vizualizare

const loader = new GLTFLoader();
loader.load('scene.glb', function (gltf) {
  scene.add(gltf.scene);
});

// Încărcarea modelului 3D și adăugarea lui în scenă

const light1 = new THREE.PointLight(0xffffff, 20, 100);
light1.position.set(50, 30, 50);
scene.add(light1);

const light2 = new THREE.PointLight(0xffffff, 10, 100);
light2.position.set(-50, 30, 50);
scene.add(light2);

const light3 = new THREE.PointLight(0xffffff, 2, 100);
light3.position.set(0, 30, -5);
scene.add(light3);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

// Adăugarea luminilor în scenă pentru iluminare

const controls = new OrbitControls(camera, canvas);

// Adăugarea controalelor pentru controlul camerei

const listener = new THREE.AudioListener();
camera.add(listener);

const audioLoader = new THREE.AudioLoader();
audioLoader.load('Music.mp3', function (buffer) {
  const audio = new THREE.PositionalAudio(listener);
  audio.setBuffer(buffer);
  audio.setLoop(true); // Setare la true pentru redarea în buclă a sunetului
  audio.setVolume(0.1); // Setare volum
  camera.add(audio);

  document.addEventListener('click', function () {
    audio.play();
  });
});

// Încărcarea și redarea unui fișier audio

let textMesh;

const fontLoader = new FontLoader();
fontLoader.load('helvetiker_bold.typeface.json', function (font) {
  const textGeometry = new TextGeometry('$599.99', {
    font: font,
    size: 10,
    height: 1,
    curveSegments: 12,
    bevelEnabled: false
  });

  const textMaterial = new MeshBasicMaterial({ color: 0xcccccc, transparent: true });
  textMesh = new Mesh(textGeometry, textMaterial);
  textMesh.position.set(-50, 50, 50); // Poziția inițială a textului
  textMesh.material.opacity = 0; 
  scene.add(textMesh);
});

// Se adaugă un font și se adăugă textul în scenă

function animate() {
  requestAnimationFrame(animate);

  // Se adaugă funcţia de fade in și out a textului
  if (textMesh) {
    const time = Date.now() * 0.001;
    const opacity = Math.sin(time) * 0.5 + 0.5; // Mapează unda sinus la intervalul de opacitate 
    textMesh.material.opacity = opacity;

    // Se mută textul spre dreapta
    const speed = 0.1; // Se ajustează viteza mișcării
    const positionOffset = Math.sin(time * speed) * 10; // Se ajustează amplitudinea mișcării
    textMesh.position.x = -50 + positionOffset;
  }

  renderer.render(scene, camera);
}

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Redimensionarea canvas-ului la modificarea dimensiunilor ferestrei

animate();