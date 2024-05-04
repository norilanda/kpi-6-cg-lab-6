import * as THREE from 'three';

// Create a scene
const sceneXOY = new THREE.Scene();
const sceneXOZ = new THREE.Scene();
const sceneYOZ = new THREE.Scene();
const sceneIsometric = new THREE.Scene();

// Create a camera
const width = window.innerWidth;
const height = window.innerHeight;
const near = 0.1;
const far = 1000;

const aspectRatio = width / height;
const cameraHeight = 2;
const cameraWidth = cameraHeight * aspectRatio;

const camera = new THREE.OrthographicCamera(
  cameraWidth / -2, // left
  cameraWidth / 2, // right
  cameraHeight / 2, // top
  cameraHeight / -2, // bottom
);

const cameraPerspective = new THREE.PerspectiveCamera(50, width / height, near, far);

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();

const colors = {
  white: new THREE.Color(1.0, 1.0, 1.0),
  black: new THREE.Color(0.0, 0.0, 0.0),
  grey: new THREE.Color(0.5, 0.5, 0.5),
  darcGrey: new THREE.Color(0.2, 0.2, 0.2),
  red: new THREE.Color(1.0, 0.0, 0.0),
  green: new THREE.Color(0.0, 1.0, 0.0),
  blue: new THREE.Color(0.0, 0.0, 1.0),
  darcBlue: new THREE.Color(0.0, 0.0, 0.5),
  cyan: new THREE.Color(0.0, 1.0, 1.0),
  magenta: new THREE.Color(1.0, 0.0, 1.0),
  yellow: new THREE.Color(1.0, 1.0, 0.0),
  orange: new THREE.Color(0.1, 0.5, 0.0),
  lemon: new THREE.Color(0.8, 1.0, 0.0),
  brown: new THREE.Color(0.5, 0.3, 0.0),
  navy: new THREE.Color(0.0, 0.4, 0.8),
  aqua: new THREE.Color(0.4, 0.7, 1.0),
  cherry: new THREE.Color(1.0, 0.0, 0.5),
};

const gradientMaterial = new THREE.ShaderMaterial({ 
    uniforms: {
        topColor: {
          value: new THREE.Color(colors.red)
        },
        bottomColor: {
          value: new THREE.Color(colors.yellow)
        }
      },
    vertexShader: `
    varying vec2 vUv;

    void main() {
      vUv = uv;

      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectionPosition = projectionMatrix * viewPosition;

      gl_Position = projectionPosition;
    }
    `,
    fragmentShader: `
    uniform vec3 topColor;
    uniform vec3 bottomColor;
  
    varying vec2 vUv;
    
    void main() {
      
      gl_FragColor = vec4(mix(bottomColor, topColor, vUv.y), 1.0);
    }
    `
});

const materials = [
    gradientMaterial, // right
    gradientMaterial, // left
    new THREE.MeshBasicMaterial({ color: colors.red }), // top
    new THREE.MeshBasicMaterial({ color: colors.yellow }), // bottom
    gradientMaterial, // front
    gradientMaterial  // back
];

const axesSize = 200;

const setupScene = (scene: THREE.Scene) => {
    const cube = new THREE.Mesh(geometry, materials);
    scene.add(cube);
    const directionalLight = new THREE.DirectionalLight( 0xffffff );
    const axesHelper = new THREE.AxesHelper( axesSize );
    axesHelper.setColors(colors.red, colors.green, colors.blue)
    scene.add(axesHelper);
    scene.add(directionalLight);
    return directionalLight;
}

const directionalLightXOY = setupScene(sceneXOY);
const directionalLightXOZ = setupScene(sceneXOZ);
const directionalLightYOZ = setupScene(sceneYOZ);
const directionalLightIsometric = setupScene(sceneIsometric);

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    cameraPerspective.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    cameraPerspective.updateProjectionMatrix();
    renderScene();
});

const renderScene = () => {
  const h = window.innerHeight;
  const w = window.innerWidth;

  renderer.setScissorTest(true)
  renderTop(h, w);
  renderer.autoClear = false;
  
  renderBack(h, w);
  renderIsometric(h, w)
  renderPerspectiveSinglePoint(h, w);

  renderer.setScissorTest(false)
  renderer.autoClear = true;
}

const cameraOffset = 2;

const renderTop = (h: number, w: number) => {
  renderer.setViewport(0, h/2, w/2, h/2)
  renderer.setScissor(0, h/2, w / 2, h/2)
  renderer.setClearColor( new THREE.Color(0.8,0.9,0.7), 1);
  renderer.clear();
  camera.position.set(0.0, cameraOffset, 0.0);
  camera.lookAt(0.0, 0.0, 0.0);
  camera.up.set(0.0, 1.0, 0.0);
  directionalLightXOZ.position.set(0, 1, 0);

  renderer.render(sceneXOZ, camera);
}

const renderBack = (h: number, w: number) => {
  renderer.setViewport(w / 2, h/2, w / 2, h/2);
  renderer.setScissor(w / 2, h/2, w / 2, h/2);

  renderer.setClearColor( new THREE.Color(0.9,0.7,0.8), 1);
  renderer.clear();
  camera.position.set(0.0, 0.0, -cameraOffset);
  camera.lookAt(0.0, 0.0, 0.0);
  camera.up.set(0.0, 1.0, 0.0);
  directionalLightXOY.position.set(0, 0, 1);

  renderer.render(sceneXOY, camera);
}

const renderIsometric = (h: number, w: number) => {
  renderer.setViewport(0, 0, w / 2, h/2);
  renderer.setScissor(0, 0, w / 2, h/2);
  renderer.setClearColor( new THREE.Color(0.9,0.8,0.8), 1);
  renderer.clear();
  camera.position.set(0, 0, cameraOffset);
  sceneIsometric.rotation.x = Math.PI / 4; // 45 degrees
  sceneIsometric.rotation.y = Math.PI / 6; // 30 degrees

  camera.lookAt(0.0, 0.0, 0.0);
  camera.up.set(0.0, 1.0, 0.0);
  directionalLightIsometric.position.set(1, 1, 1);

  renderer.render(sceneIsometric, camera);
}

const renderPerspectiveSinglePoint = (h: number, w: number) => {
  renderer.setViewport(w/2, 0, w / 2, h/2);
  renderer.setScissor(w/2, 0, w / 2, h/2);

  renderer.setClearColor( new THREE.Color(0.8,0.8,0.9), 1);
  renderer.clear();
  cameraPerspective.position.set(0.0, 0.0, cameraOffset);
  sceneYOZ.rotation.x = Math.PI / 4; // 45 degrees
  sceneYOZ.rotation.y = Math.PI / 6; // 30 degrees
  cameraPerspective.lookAt(0.0, 0.0, 0.0);
  cameraPerspective.up.set(0.0, 1.0, 0.0);
  directionalLightYOZ.position.set(1, 0, 0);

  renderer.render(sceneYOZ, cameraPerspective);
}

const animate = () => {
    requestAnimationFrame(animate);
    renderScene();
}
animate();
