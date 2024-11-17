import "../app.css"
import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import GUI from "lil-gui"

// ========================================
// DEBUG
// ========================================

const gui = new GUI()

// ========================================
// CANVAS
// ========================================

const canvas = document.querySelector('canvas.webgl')

// ========================================
// SCENE
// ========================================

const scene = new THREE.Scene()

// ========================================
// TEXTURES
// ========================================

const textureLoader = new THREE.TextureLoader()

// const texture = textureLoader.load("")
// texture.colorSpace = THREE.SRGBColorSpace

// ========================================
// OBJECTS
// ========================================

const material = new THREE.MeshStandardMaterial()

const box = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  material
)

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({color: 0xffffff})
)

box.position.set(0, 0, 0)

plane.rotation.x = -Math.PI / 2
plane.position.set(0, -0.5, 0)

box.castShadow = true
plane.receiveShadow = true

scene.add(box, plane)

// ========================================
// LIGHT
// ========================================

// ----------
// Ambient
// ----------
const ambientLight = new THREE.AmbientLight(0xffffff, 0.05)
scene.add(ambientLight)

// ----------
// Spot
// ----------
// color, intensity, distance, angle, penumbra, decay
const spotLight = new THREE.SpotLight(0xffffff, 200, 50, Math.PI * 0.3)
spotLight.position.set(5, 10, 5)
spotLight.target.position.set(0, 0, 0)
spotLight.castShadow = true
spotLight.shadow.mapSize.width  = 1024
spotLight.shadow.mapSize.height = 1024
spotLight.shadow.camera.near = 0.5
spotLight.shadow.camera.far = 1

scene.add(spotLight)
scene.add(spotLight.target)

const spotLightHelper = new THREE.SpotLightHelper(spotLight, 0.2)
scene.add(spotLightHelper)
const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
scene.add(spotLightCameraHelper)

// ========================================
// CAMERA
// ========================================

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener("resize", () => {
  // update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // update renderer
  renderer.setSize(sizes.width, sizes.height)
})

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.set(0, 3, 20)
// camera.lookAt(mesh.position)
scene.add(camera)

// ========================================
// RENDERER
// ========================================

const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio( Math.min(window.devicePixelRatio, 2) )
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// ========================================
// CONTROLS
// ========================================

const controls = new OrbitControls(camera, canvas)

// ========================================
// Animations
// ========================================

const clock = new THREE.Clock()

const animate = () => {

  const elapsedTime = clock.getElapsedTime()

  box.position.x = Math.sin(elapsedTime) * 3
  box.position.z = Math.cos(elapsedTime) * -3
  box.position.y = Math.abs(Math.sin(elapsedTime)) * 3

  //
  // render
  //
  renderer.render(scene, camera)
  window.requestAnimationFrame(animate)
}

animate()
