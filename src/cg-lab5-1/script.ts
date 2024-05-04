import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Create a scene
const sceneXOY = new THREE.Scene();
const sceneXOZ = new THREE.Scene();
const sceneYOZ = new THREE.Scene();
const sceneIsometric = new THREE.Scene();

const getWidth = () => {
    return window.innerWidth;
}

// Create a camera
const width = window.innerWidth;
const height = window.innerHeight;

const aspectRatio = width / height;
const cameraHeight = 2;
const cameraWidth = cameraHeight * aspectRatio;

const camera = new THREE.OrthographicCamera(
  cameraWidth / -2, // left
  cameraWidth / 2, // right
  cameraHeight / 2, // top
  cameraHeight / -2, // bottom
);

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(getWidth(), window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();

const colors = {
    'red': 0xff0000,
    'green': 0x00ff00,
    'blue': 0x0000ff,
    'yellow': 0xffff00,
    'magenta': 0xff00ff,
    'cyan': 0x00ffff
}
const materials = [
    new THREE.MeshBasicMaterial({ color: colors.blue }), // right
    new THREE.MeshBasicMaterial({ color: colors.yellow }), // left
    new THREE.MeshBasicMaterial({ color: colors.cyan }), // top
    new THREE.MeshBasicMaterial({ color: colors.red }), // bottom
    new THREE.MeshBasicMaterial({ color: colors.magenta }), // front
    new THREE.MeshBasicMaterial({ color: colors.green })  // back
];

const cubeXOY = new THREE.Mesh(geometry, materials);
sceneXOY.add(cubeXOY);
const axesHelperXOY = new THREE.AxesHelper( 5 );
sceneXOY.add( axesHelperXOY );

const cubeXOZ = new THREE.Mesh(geometry, materials);
sceneXOZ.add(cubeXOZ);
const axesHelperXOZ = new THREE.AxesHelper( 5 );
sceneXOZ.add(axesHelperXOZ);

const cubeYOZ = new THREE.Mesh(geometry, materials);
sceneYOZ.add(cubeYOZ);
const axesHelperYOZ = new THREE.AxesHelper( 5 );
sceneYOZ.add(axesHelperYOZ);

const cubeIsometric = new THREE.Mesh(geometry, materials);
sceneIsometric.add(cubeIsometric);
const axesHelperIsometric = new THREE.AxesHelper( 5 );
sceneIsometric.add(axesHelperIsometric);

const controls = new OrbitControls( camera, renderer.domElement );
controls.update();

window.addEventListener('resize', () => {
    renderer.setSize(getWidth(), window.innerHeight);
    camera.updateProjectionMatrix();
    renderScene();
});

const renderScene = () => {
    const h = window.innerHeight;
    const w = window.innerWidth;

    renderer.setScissorTest(true)
    renderXOY(h, w);

    renderer.autoClear = false;
    renderXOZ(h, w);
    renderYOZ(h, w);
    renderIsometric(h, w)

    renderer.setScissorTest(false)
    renderer.autoClear = true;
}

const renderXOY = (h: number, w: number) => {
    renderer.setViewport(0, h/2, w/2, h/2)
    renderer.setScissor(0, h/2, w / 2, h/2)
    renderer.setClearColor( new THREE.Color(0.9,0.7,0.8), 1);
    renderer.clear();
    // Set camera position
    camera.position.set(0.0, 0.0, 2.0);
    // Set camera to look at the scene's origin
    camera.lookAt(0.0, 0.0, 0.0);
    // Set camera's up direction
    camera.up.set(0.0, 1.0, 0.0);

    renderer.render(sceneXOY, camera);
}

const renderXOZ = (h: number, w: number) => {
    renderer.setViewport(w / 2, h/2, w / 2, h/2);
    renderer.setScissor(w / 2, h/2, w / 2, h/2);
    renderer.setClearColor( new THREE.Color(0.8,0.9,0.7), 1);
    renderer.clear();
    camera.position.set(0.0, 2.0, 0.0);
    camera.lookAt(0.0, 0.0, 0.0);
    camera.up.set(0.0, 1.0, 0.0);
    renderer.render(sceneXOZ, camera);
}

const renderYOZ = (h: number, w: number) => {
    renderer.setViewport(0, 0, w / 2, h/2);
    renderer.setScissor(0, 0, w / 2, h/2);
    renderer.setClearColor( new THREE.Color(0.8,0.8,0.9), 1);
    renderer.clear();
    camera.position.set(2.0, 0.0, 0.0);
    camera.lookAt(0.0, 0.0, 0.0);
    camera.up.set(0.0, 1.0, 0.0);
    renderer.render(sceneXOZ, camera);
}

const renderIsometric = (h: number, w: number) => {
    renderer.setViewport(w/2, 0, w / 2, h/2);
    renderer.setScissor(w/2, 0, w / 2, h/2);
    renderer.setClearColor( new THREE.Color(0.9,0.8,0.8), 1);
    renderer.clear();
    camera.position.set(1.125, 1.125, 1.125);
    camera.lookAt(0.0, 0.0, 0.0);
    camera.up.set(0.0, 1.0, 0.0);
    renderer.render(sceneXOZ, camera);
}

const animate = () => {
    requestAnimationFrame(animate);
    renderScene();
}
animate();
