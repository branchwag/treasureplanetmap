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
//camera.position.setZ(30);
camera.position.set(200, 20, 50);

//backgroundCamera.position.setZ(30);

let selectedObject = null;
let cameraOffset = new THREE.Vector3();
let isFollowing = false;

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(20, 20, 20);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const sunGeometry = new THREE.SphereGeometry(50, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({
  color: 0x00FF41,
  wireframe: true
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);
const sunLight = new THREE.PointLight(0xffffff, 2);
sun.add(sunLight);

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
const moonOrbit = new THREE.Group();
moonOrbit.add(moon);

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

moon.position.set(30, 0, 0); //rightleft, updown, forward/backward

lilPlanet.position.set(150, 0, -800);

const planetGroup = new THREE.Group();
planetGroup.add(planetSphere);
planetGroup.add(ring);
planetGroup.add(ringTwo);
scene.add(planetGroup);

scene.add(lilPlanet);

lilPlanet.add(moonOrbit);

const distantPlanetGeo = new THREE.SphereGeometry(25, 12, 16);
const distantPlanet = new THREE.Mesh(distantPlanetGeo, planetMaterial);
const distantRingGeo = new THREE.TorusGeometry(40, 0.8, 16, 100);
const distantRing = new THREE.Mesh(distantRingGeo, ringMaterial);
const distantPlanetCore = new THREE.Group();
distantPlanetCore.add(distantPlanet);
const distantRingGroup = new THREE.Group();
distantRingGroup.add(distantRing);
const distantPlanetSystem = new THREE.Group();
distantPlanetSystem.add(distantPlanetCore);
distantPlanetSystem.add(distantRingGroup);
distantPlanetSystem.position.set(-1200, 200, -1200);
distantRing.rotation.x = Math.PI / 3;
scene.add(distantPlanetSystem);

const binaryPlanetGeo1 = new THREE.SphereGeometry(15, 10, 16);
const binaryPlanetGeo2 = new THREE.SphereGeometry(12, 10, 16);
const binaryPlanet1 = new THREE.Mesh(binaryPlanetGeo1, planetMaterial);
const binaryPlanet2 = new THREE.Mesh(binaryPlanetGeo2, planetMaterial);
const binaryCore = new THREE.Group();
binaryPlanet1.position.set(30, 0, 0);
binaryPlanet2.position.set(-30, 0, 0);
binaryCore.add(binaryPlanet1);
binaryCore.add(binaryPlanet2);
const binarySystem = new THREE.Group();
binarySystem.add(binaryCore);
binarySystem.position.set(1000, -100, -1500);
scene.add(binarySystem);

const gasGiantGeo = new THREE.SphereGeometry(35, 16, 16);
const gasGiant = new THREE.Mesh(gasGiantGeo, planetMaterial);
const gasGiantCore = new THREE.Group();
gasGiantCore.add(gasGiant);

const ringSpacing = 2;
const rings = [];
for (let i = 0; i < 3; i++) {
  const ringGeo = new THREE.TorusGeometry(50 + (i * ringSpacing), 0.3, 16, 100);
  const ring = new THREE.Mesh(ringGeo, ringMaterial);
  ring.rotation.x = Math.PI / 2;
  rings.push(ring);
  const ringGroup = new THREE.Group();
  ringGroup.add(ring);
  gasGiantCore.add(ringGroup);
}

const gasGiantSystem = new THREE.Group();
gasGiantSystem.add(gasGiantCore);
gasGiantSystem.position.set(-800, -300, -1800);
scene.add(gasGiantSystem);

const planetOrbit = new THREE.Group();
const lilPlanetOrbit = new THREE.Group();
const thirdPlanetOrbit = new THREE.Group();
const lilPlanetTwoOrbit = new THREE.Group();
const distantPlanetOrbit = new THREE.Group();
const binarySystemOrbit = new THREE.Group();
const gasGiantOrbit = new THREE.Group();

scene.add(planetOrbit);
scene.add(lilPlanetOrbit);
scene.add(thirdPlanetOrbit);
scene.add(lilPlanetTwoOrbit);
scene.add(distantPlanetOrbit);
scene.add(binarySystemOrbit);
scene.add(gasGiantOrbit);

planetOrbit.add(planetGroup);
lilPlanetOrbit.add(lilPlanet);
thirdPlanetOrbit.add(thirdPlanetGroup);
lilPlanetTwoOrbit.add(lilPlanetTwoSystem);
distantPlanetOrbit.add(distantPlanetSystem);
binarySystemOrbit.add(binarySystem);
gasGiantOrbit.add(gasGiantSystem);

planetGroup.position.set(200, 0, 0);
lilPlanet.position.set(400, 0, 0);
thirdPlanetGroup.position.set(600, 0, 0);
lilPlanetTwoSystem.position.set(800, 0, 0);
distantPlanetSystem.position.set(1000, 0, 0);
binarySystem.position.set(1200, 0, 0);
gasGiantSystem.position.set(1400, 0, 0);

const controls = new OrbitControls(camera, renderer.domElement);

function createGalaxy() {
  const positions = new Float32Array(30000 * 3);
  const colors = new Float32Array(30000 * 3);

  const galaxyGeometry = new THREE.BufferGeometry();
  const galaxyMaterial = new THREE.PointsMaterial({
    size: 3,
    vertexColors: true,
    transparent: true,
    opacity: 0.8
  });

  const arms = 3;
  const radius = 500;
  const turns = 3;
  const armWidth = 20;
  const innerRadius = 50;

  for (let i = 0; i < positions.length; i += 3) {
    const progress = i / positions.length;
    const r = innerRadius + (radius - innerRadius) * Math.pow(progress, 0.5);

    const armIndex = Math.floor(Math.random() * arms);
    const curveAngle = (r / radius) * turns * Math.PI * 2;
    const randomAngle = (Math.random() - 0.5) * (1 / r) * armWidth;
    const angle = (armIndex / arms) * Math.PI * 2 + curveAngle + randomAngle;

    positions[i] = Math.cos(angle) * r;
    positions[i + 1] = (Math.random() - 0.5) * armWidth * 0.3;
    positions[i + 2] = Math.sin(angle) * r;

    colors[i] = 0;
    colors[i + 1] = 1;
    colors[i + 2] = 0.25;
  }

  galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial);
  galaxy.position.set(-4500, -1500, -4500);
  galaxy.rotation.x = Math.PI * 0.2;
  scene.add(galaxy);

  return galaxy;
}

const galaxy = createGalaxy();

function createStarField() {
  const starGeometry = new THREE.SphereGeometry(0.55, 8, 8);
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

controls.target.copy(planetGroup.position);
camera.lookAt(planetGroup.position);

backgroundCamera.position.copy(camera.position);

cameraPositions.set(planetSphere, {
  offset: new THREE.Vector3(0, 20, 50),
  lookAt: new THREE.Vector3(0, 0, 0)
});

cameraPositions.set(thirdPlanet, {
  offset: new THREE.Vector3(0, 20, 50),
  lookAt: new THREE.Vector3(0, 0, 0)
});

cameraPositions.set(lilPlanet, {
  offset: new THREE.Vector3(0, 20, 50),
  lookAt: new THREE.Vector3(0, 0, 0)
});

cameraPositions.set(lilPlanetTwo, {
  offset: new THREE.Vector3(0, 20, 50),
  lookAt: new THREE.Vector3(0, 0, 0)
});

cameraPositions.set(distantPlanet, {
  offset: new THREE.Vector3(0, 20, 50),
  lookAt: new THREE.Vector3(0, 0, 0)
});

cameraPositions.set(binaryPlanet1, {
  offset: new THREE.Vector3(0, 20, 50),
  lookAt: new THREE.Vector3(0, 0, 0)
});

cameraPositions.set(gasGiant, {
  offset: new THREE.Vector3(0, 20, 50),
  lookAt: new THREE.Vector3(0, 0, 0)
});

cameraPositions.set(sun, {
  offset: new THREE.Vector3(0, 100, 200),
  lookAt: new THREE.Vector3(0, 0, 0)
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
      const worldPosition = new THREE.Vector3();
      clickedObject.getWorldPosition(worldPosition);

      const targetCameraPos = worldPosition.clone().add(targetPosition.offset);

      moveCamera(targetCameraPos, worldPosition, clickedObject);
    }
  } else {
    selectedObject = null;
    isFollowing = false;
    controls.enabled = true;
  }

  //console.log('Mouse position:', mouse.x, mouse.y);
  //console.log('Intersects:', intersects);
}

function intializeCamera() {
  const worldPosition = new THREE.Vector3();
  planetGroup.getWorldPosition(worldPosition);

  const targetPosition = cameraPositions.get(planetSphere);

  const targetCameraPos = worldPosition.clone().add(targetPosition.offset);

  moveCamera(targetCameraPos, worldPosition, planetSphere);
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

function moveCamera(targetPosition, targetLookAt, object) {
  startPosition.copy(camera.position);
  startTarget.copy(controls.target);

  selectedObject = object;
  if (selectedObject) {
    cameraOffset.copy(cameraPositions.get(object).offset);
    isFollowing = true;
  } else {
    isFollowing = false;
  }

  endPosition.copy(targetPosition);
  endTarget.copy(targetLookAt);

  movementProgress = 0;
  movementStartTime = Date.now();
  isMoving = true;
  controls.enabled = false;
}

function animate() {
  requestAnimationFrame(animate);

  planetOrbit.rotation.y += 0.002;
  lilPlanetOrbit.rotation.y += 0.0015;
  thirdPlanetOrbit.rotation.y += 0.0012;
  lilPlanetTwoOrbit.rotation.y += 0.001;
  distantPlanetOrbit.rotation.y += 0.0008;
  binarySystemOrbit.rotation.y += 0.0006;
  gasGiantOrbit.rotation.y += 0.0004;

  const time = Date.now() * 0.001;
  stars.forEach(star => {
    const twinkle = Math.sin(time * star.userData.twinkleSpeed + star.userData.twinklePhase);
    star.material.opacity = star.userData.originalOpacity * (1 + twinkle * 0.2);
  });

  planetGroup.rotation.y += 0.005;
  galaxy.rotation.y += 0.0001;

  moonOrbit.rotation.y += 0.02;

  lilPlanet.rotation.y += 0.005;

  lilPlanetTwoCore.rotation.y += 0.005;
  fourthRingGroup.rotation.y += 0.003;
  lilPlanetTwoSystem.rotation.y += 0.0001;

  thirdPlanetCore.rotation.y += 0.008;
  thirdRingGroup.rotation.y += 0.003;
  thirdPlanetGroup.rotation.y += 0.0001;

  distantPlanetCore.rotation.y += 0.003;
  distantRingGroup.rotation.y += 0.001;
  distantPlanetSystem.rotation.y += 0.0002;

  binaryCore.rotation.y += 0.001;
  binarySystem.rotation.y += 0.0003;

  gasGiantCore.rotation.y += 0.002;
  rings.forEach((ring, index) => {
    ring.parent.rotation.y += 0.001 * (index + 1);
  });
  gasGiantSystem.rotation.y += 0.0001;

  sun.rotation.y += 0.001;

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
      if (isFollowing) {
        controls.enabled = false;
      } else {
        controls.enabled = true;
      }
    }
  } else if (isFollowing && selectedObject) {
    const worldPosition = new THREE.Vector3();
    selectedObject.getWorldPosition(worldPosition);

    const targetPosition = worldPosition.clone().add(cameraOffset);

    camera.position.lerp(targetPosition, 0.1);
    controls.target.lerp(worldPosition, 0.1);
    camera.lookAt(controls.target);
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

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    selectedObject = null;
    isFollowing = false;
    controls.enabled = true;
  }
});

animate()
intializeCamera();
