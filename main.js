import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);

const backgroundScene = new THREE.Scene();
const backgroundCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
backgroundCamera.position.setZ(30);

//lights
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(20, 20, 20);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

//shapes here
const ringMaterial = new THREE.MeshBasicMaterial({
  color: 0x00FF41,
  side: THREE.DoubleSide,
  wireframe: true
});
const moonSphere = new THREE.SphereGeometry(2, 10, 16);
const planetGeometry = new THREE.SphereGeometry(10, 32, 16);
const lilPlanetGeo = new THREE.SphereGeometry(20, 10, 16);

const planetMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF41, wireframe: true });
const planetSphere = new THREE.Mesh(planetGeometry, planetMaterial);
scene.add(planetSphere);

const lilPlanet = new THREE.Mesh(lilPlanetGeo, planetMaterial);
scene.add(lilPlanet);

const lilPlanetTwo = new THREE.Mesh(lilPlanetGeo, planetMaterial);
const lilPlanetTwoCore = new THREE.Group();
lilPlanetTwoCore.add(lilPlanetTwo);
const fourthRingGeo = new THREE.TorusGeometry(32, 0.6, 16, 100);
const fourthRing = new THREE.Mesh(fourthRingGeo, ringMaterial);
const fourthRingGroup = new THREE.Group();
fourthRingGroup.add(fourthRing);
const lilPlanetTwoSystem = new THREE.Group();
lilPlanetTwoSystem.add(lilPlanetTwoCore);
lilPlanetTwoSystem.add(fourthRingGroup);
lilPlanetTwoSystem.position.set(-800, 0, -800);
fourthRing.rotation.x = Math.PI / 2;
scene.add(lilPlanetTwoSystem);

const moon = new THREE.Mesh(moonSphere, planetMaterial);

const ringGeometry = new THREE.TorusGeometry(18, 0.4, 16, 100);
const ringTwoGeometry = new THREE.TorusGeometry(18, 0.4, 16, 100);

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
thirdRing.rotation.x = Math.PI / 2;
scene.add(thirdPlanetGroup);

ring.rotation.x = Math.PI / 4;
ringTwo.rotation.x = -Math.PI / 4;

ring.position.set = (0, 0, 0);
ringTwo.position.set = (0, 0, 0);

moon.position.set(50, 0, -10); //rightleft, updown, forward/backward
lilPlanet.position.set(150, 0, -800);

const planetGroup = new THREE.Group();
planetGroup.add(planetSphere);
planetGroup.add(ring);
planetGroup.add(ringTwo);
scene.add(planetGroup);

scene.add(moon);
scene.add(lilPlanet);

const controls = new OrbitControls(camera, renderer.domElement);

function createStarField() {
  const starGeometry = new THREE.SphereGeometry(0.15, 8, 8);
  const starMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true
  });

  const numStars = 15000;
  const stars = [];

  for (let i = 0; i < numStars; i++) {
    const star = new THREE.Mesh(starGeometry, starMaterial.clone());

    const radius = 5000;
    const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
    const phi = THREE.MathUtils.randFloat(0, Math.PI);

    star.position.x = radius * Math.sin(phi) * Math.cos(theta);
    star.position.y = radius * Math.sin(phi) * Math.sin(theta);
    star.position.z = radius * Math.cos(phi);

    star.userData.originalOpacity = Math.random() * 0.5 + 0.5;
    star.userData.twinkleSpeed = Math.random() * 0.02 + 0.01;
    star.userData.twinklePhase = Math.random() * Math.PI * 2;

    const scale = Math.random() * 0.5 + 0.5;
    star.scale.set(scale, scale, scale);

    backgroundScene.add(star);
    stars.push(star);
  }
  return stars;
}

const stars = createStarField();

controls.maxDistance = 1000;
controls.minDistance = 10;

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  backgroundCamera.aspect = window.innerWidth / window.innerHeight;
  backgroundCamera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const cameraPositions = new Map();

// Add planets to the clickable objects map with their desired camera positions
cameraPositions.set(planetSphere, {
  position: new THREE.Vector3(0, 20, 50), // Adjust these values as needed
  lookAt: planetSphere.position
});

cameraPositions.set(thirdPlanet, {
  position: new THREE.Vector3(400, 20, -270),
  lookAt: thirdPlanetGroup.position
});

cameraPositions.set(lilPlanet, {
  position: new THREE.Vector3(150, 20, -700),
  lookAt: lilPlanet.position
});

cameraPositions.set(lilPlanetTwo, {
  position: new THREE.Vector3(-800, 20, -700),
  lookAt: lilPlanetTwoSystem.position
});

window.addEventListener('click', onMouseClick);

function onMouseClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    //console.log('Hit:', intersects[0].object);
    const clickedObject = intersects[0].object;
    const targetPosition = findTargetPosition(clickedObject);

    if (targetPosition) {
      moveCamera(targetPosition.position, targetPosition.lookAt);
    }
  }

  //console.log('Mouse position:', mouse.x, mouse.y);
  //console.log('Intersects:', intersects);
}

function findTargetPosition(object) {
  let current = object;
  while (current) {
    if (cameraPositions.has(current)) {
      return cameraPositions.get(current);
    }
    current = current.parent;
  }
  return null;
}

// Variables for camera movement animation
let isMoving = false;
let startPosition = new THREE.Vector3();
let startTarget = new THREE.Vector3();
let endPosition = new THREE.Vector3();
let endTarget = new THREE.Vector3();
let movementProgress = 0;
const MOVEMENT_DURATION = 2000; // Duration in milliseconds
let movementStartTime;

function moveCamera(targetPosition, targetLookAt) {
  startPosition.copy(camera.position);
  startTarget.copy(controls.target);

  endPosition.copy(targetPosition);
  endTarget.copy(targetLookAt);

  movementProgress = 0;
  movementStartTime = Date.now();
  isMoving = true;
  controls.enabled = false;
}

function animate() {
  requestAnimationFrame(animate);

  planetGroup.rotation.y += 0.005;

  const time = Date.now() * 0.001;
  stars.forEach(star => {
    const twinkle = Math.sin(time * star.userData.twinkleSpeed + star.userData.twinklePhase);
    star.material.opacity = star.userData.originalOpacity * (1 + twinkle * 0.2);
  });

  moon.position.x = Math.cos(time * 0.05) * 50;
  moon.position.z = Math.sin(time * 0.05) * 50;

  lilPlanet.rotation.y += 0.005;

  lilPlanetTwoCore.rotation.y += 0.005;
  fourthRingGroup.rotation.y += 0.003;
  lilPlanetTwoSystem.rotation.y += 0.0001;

  thirdPlanetCore.rotation.y += 0.008;
  thirdRingGroup.rotation.y += 0.003;
  thirdPlanetGroup.rotation.y += 0.0001;

  backgroundCamera.quaternion.copy(camera.quaternion);



  if (isMoving) {
    const currentTime = Date.now();
    const elapsed = currentTime - movementStartTime;
    movementProgress = Math.min(elapsed / MOVEMENT_DURATION, 1);

    const eased = easeInOutCubic(movementProgress);

    camera.position.lerpVectors(startPosition, endPosition, eased);
    controls.target.lerpVectors(startTarget, endTarget, eased);
    camera.lookAt(controls.target);

    if (movementProgress === 1) {
      isMoving = false;
      controls.enabled = true;
    }
  }

  renderer.autoClear = true;
  renderer.render(backgroundScene, backgroundCamera);

  renderer.autoClear = false;
  renderer.render(scene, camera);

  controls.update();
}

function easeInOutCubic(t) {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

animate()
