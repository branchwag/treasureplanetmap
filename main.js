import './style.css'

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

//lights
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(20, 20, 20);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

//shapes here

const moonSphere = new THREE.SphereGeometry(2, 10, 16);
const planetGeometry = new THREE.SphereGeometry(10, 32, 16);
const lilPlanetGeo = new THREE.SphereGeometry(20, 10, 16);

const planetMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF41, wireframe: true });
const planetSphere = new THREE.Mesh(planetGeometry, planetMaterial);
scene.add(planetSphere);

const lilPlanet = new THREE.Mesh(lilPlanetGeo, planetMaterial);
scene.add(lilPlanet);

const lilPlanetTwo = new THREE.Mesh(lilPlanetGeo, planetMaterial);
scene.add(lilPlanetTwo);

const moon = new THREE.Mesh(moonSphere, planetMaterial);

const ringGeometry = new THREE.TorusGeometry(18, 0.4, 16, 100);
const ringTwoGeometry = new THREE.TorusGeometry(18, 0.4, 16, 100);

const ringMaterial = new THREE.MeshBasicMaterial({
  color: 0x00FF41,
  side: THREE.DoubleSide,
  wireframe: true
});

const ring = new THREE.Mesh(ringGeometry, ringMaterial);
const ringTwo = new THREE.Mesh(ringTwoGeometry, ringMaterial);

const thirdPlanetGeo = new THREE.SphereGeometry(15, 10, 16);
const thirdPlanet = new THREE.Mesh(thirdPlanetGeo, planetMaterial);
const thirdRingGeo = new THREE.TorusGeometry(25, 0.6, 16, 100);
const thirdRing = new THREE.Mesh(thirdRingGeo, ringMaterial);

const thirdPlanetCore = new THREE.Group();
thirdPlanetCore.add(thirdPlanet);

const thirdRingGroup = new THREE.Group();
thirdRingGroup.add(thirdRing);

const thirdPlanetGroup = new THREE.Group();
thirdPlanetGroup.add(thirdPlanetCore);
thirdPlanetGroup.add(thirdRingGroup);

thirdPlanetGroup.position.set(400, 0, -400);

thirdRing.rotation.x = Math.PI / 3;

scene.add(thirdPlanetGroup);

ring.rotation.x = Math.PI / 4;
ringTwo.rotation.x = -Math.PI / 4;

ring.position.set = (0, 0, 0);
ringTwo.position.set = (0, 0, 0);

moon.position.set(50, 0, -10); //rightleft, updown, forward/backward
lilPlanet.position.set(150, 0, -800);
lilPlanetTwo.position.set(-800, 0, -800);

const planetGroup = new THREE.Group();
planetGroup.add(planetSphere);
planetGroup.add(ring);
planetGroup.add(ringTwo);
scene.add(planetGroup);

scene.add(moon);
scene.add(lilPlanet);
scene.add(lilPlanetTwo);

const controls = new OrbitControls(camera, renderer.domElement);

function createStarField() {
  const starLayers = [
    { count: 500, spread: 200 },
    { count: 1000, spread: 500 },
    { count: 2000, spread: 1000 }
  ];

  starLayers.forEach(layer => {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 0.2
    });

    for (let i = 0; i < layer.count; i++) {
      const star = new THREE.Mesh(geometry, material);
      const theta = THREE.MathUtils.randFloatSpread(360);
      const phi = THREE.MathUtils.randFloatSpread(360);

      const radius = layer.spread;
      star.position.x = radius * Math.sin(theta) * Math.cos(phi);
      star.position.y = radius * Math.sin(theta) * Math.sin(phi);
      star.position.z = radius * Math.cos(theta);

      const scale = Math.random() * 0.5 + 0.5;
      star.scale.set(scale, scale, scale);

      scene.add(star);
    }
  });
}

createStarField();

controls.maxDistance = 1000;
controls.minDistance = 10;

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);

  planetGroup.rotation.y += 0.005;

  const time = Date.now() * 0.001;
  moon.position.x = Math.cos(time * 0.05) * 50;
  moon.position.z = Math.sin(time * 0.05) * 50;

  lilPlanet.rotation.y += 0.005;
  lilPlanetTwo.rotation.y += 0.005;

  thirdPlanetCore.rotation.y += 0.008;
  thirdRingGroup.rotation.z += 0.003;
  thirdPlanetGroup.rotation.y += 0.0001;

  controls.update();

  renderer.render(scene, camera);
}

animate()
