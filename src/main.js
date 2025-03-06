import './style.css'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js'

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer(
  {canvas: document.querySelector('#bg'),}
)

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
camera.position.setZ(30)

// Init Torus
const geometry = new THREE.TorusGeometry(10, 3, 16, 100)  // 3D object
// navy blue colour
const material = new THREE.MeshStandardMaterial({color: 0x00085f, wireframe: true})  // Material
const torus = new THREE.Mesh(geometry, material)

scene.add(torus)

// Add Lights 
const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(0,0,0)
pointLight.intensity = 40
const ambientLight = new THREE.AmbientLight(0xffffff)
ambientLight.intensity = 20
scene.add(pointLight, ambientLight)

// Add Helpers
// const gridHelper = new THREE.GridHelper(200, 50)
// // scene.add(gridHelper)
const lightHelper = new THREE.PointLightHelper(pointLight)
scene.add(lightHelper)

// Add Controls
const controls = new OrbitControls(camera, renderer.domElement)

// Load Textures
const bodyTexture = new THREE.TextureLoader().load('wolf/textures/Wolf_Body.jpg');
const eye1Texture = new THREE.TextureLoader().load('wolf/textures/Wolf_Eyes_1.jpg');
const eye2Texture = new THREE.TextureLoader().load('wolf/textures/Wolf_Eyes_2.jpg');
const furTexture = new THREE.TextureLoader().load('wolf/textures/Wolf_Fur.jpg');

const mtlLoader = new MTLLoader();
mtlLoader.load('wolf/Wolf_One_obj.mtl', function(materials) {
  materials.preload();  // Prepare the materials for use
  console.log(materials);  // Log the materials to the console
  
  // Load OBJ model
  const objLoader = new OBJLoader();
  objLoader.setMaterials(materials);  // Set the loaded materials to the OBJ loader
  objLoader.load('wolf/Wolf_One_obj.obj', function(object) {
    object.scale.set(10, 10, 10); // Adjust scale if necessary
    scene.add(object);  // Add the object to the scene
  });
});

// Load OBJ Model
// const objLoader = new OBJLoader();
// objLoader.load(
//   'wolf/Wolf_obj.obj',  // replace with your model's path
//   (object) => {
//     object.traverse((child) => {
//       if (child.isMesh) {
//         // Check the name of the mesh and apply the corresponding texture
//         if (child.name === 'body') {
//           child.material.map = bodyTexture;  // Apply body texture
//         } else if (child.name === 'eye1') {
//           child.material.map = eye1Texture;  // Apply first eye texture
//         } else if (child.name === 'eye2') {
//           child.material.map = eye2Texture;  // Apply second eye texture
//         } else if (child.name === 'fur') {
//           child.material.map = furTexture;  // Apply fur texture
//         }
//         child.material.needsUpdate = true; // Ensure the material updates with the new texture
//       }
//     });
//     object.scale.set(10, 10, 10); // scale the object if needed
//     scene.add(object); // add the object to the scene
//   }
// );

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24)
  const material = new THREE.MeshStandardMaterial({color: 0xffffff})
  const star = new THREE.Mesh(geometry, material)

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100))

  star.position.set(x, y, z)
  scene.add(star)
} 

Array(200).fill().forEach(addStar)

const spaceTexture = new THREE.TextureLoader().load('src/sky.jpg')
scene.background = spaceTexture;

function animate() {
  requestAnimationFrame(animate)
  
  torus.position.y = 10
  // torus.rotation.x += 0.01
  torus.rotation.y += 0.005
  // torus.rotation.z += 0.01
  torus.position.y = 4

  controls.update()
  // torus.position.x = Math.sin(torus.rotation.x) * 10

  renderer.render(scene, camera)
}

animate()