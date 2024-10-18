import './style.css'

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
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
const lilPlanetGeo = new THREE.SphereGeometry(12, 10, 16);

const planetMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF41, wireframe: true });
const planetSphere = new THREE.Mesh(planetGeometry, planetMaterial);
scene.add(planetSphere);

const lilPlanet = new THREE.Mesh(lilPlanetGeo, planetMaterial);
scene.add(lilPlanet);

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

ring.rotation.x = Math.PI / 4;
ringTwo.rotation.x = -Math.PI / 4;

ring.position.set = (0, 0, 0);
ringTwo.position.set = (0, 0, 0);

moon.position.set(50, 0, -30); //rightleft, updown, forward/backward
lilPlanet.position.set(50, 0, -200);

const planetGroup = new THREE.Group();
planetGroup.add(planetSphere);
planetGroup.add(ring);
planetGroup.add(ringTwo);
scene.add(planetGroup);

scene.add(moon);
scene.add(lilPlanet);

const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 0.2
  });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star)

}

Array(200).fill().forEach(addStar);

function animate() {
  requestAnimationFrame(animate);

  planetGroup.rotation.y += 0.005;

  const time = Date.now() * 0.001;
  moon.position.x = Math.cos(time * 0.05) * 50;
  moon.position.z = Math.sin(time * 0.05) * 50;

  lilPlanet.rotation.y += 0.005;

  controls.update();

  renderer.render(scene, camera);
}

animate()
