import "../app.css"
import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper"
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

const texture = textureLoader.load("/textures/shadows/simpleShadow.jpg")
// texture.colorSpace = THREE.SRGBColorSpace

// ========================================
// OBJECTS
// ========================================

const material = new THREE.MeshStandardMaterial()

const box = new THREE.Mesh(
  new THREE.SphereGeometry(1, 10, 10),
  material
)

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(40, 40),
  material
)

const shadowPlane = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5),
  new THREE.MeshStandardMaterial({color: 0x000000, transparent: true, alphaMap: texture})
)

box.position.set(0, 0, 0)

plane.rotation.x = -Math.PI / 2
plane.position.set(0, -1, 0)

shadowPlane.rotation.x = -Math.PI / 2
shadowPlane.position.y = plane.position.y + 0.01

box.castShadow = true
plane.receiveShadow = true

scene.add(box, plane, shadowPlane)

// ========================================
// LIGHT
// ========================================

// ----------
// Ambient
// ----------
const ambientLight = new THREE.AmbientLight(0xffffff, 0.05)
scene.add(ambientLight)

// ----------
// Directional
// ----------
// const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2)
// directionalLight.position.set(2, 5, 0)
// scene.add(directionalLight)
//
// directionalLight.castShadow = true
// directionalLight.shadow.mapSize.width  = 1024
// directionalLight.shadow.mapSize.height = 1024
// directionalLight.shadow.camera.near    = 1
// directionalLight.shadow.camera.far     = 20
// directionalLight.shadow.camera.top     = 10
// directionalLight.shadow.camera.right   = 2
// directionalLight.shadow.camera.bottom  = -10
// directionalLight.shadow.camera.left    = -2
// directionalLight.shadow.radius = 10
//
// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
// scene.add(directionalLightHelper)
// const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(directionalLightCameraHelper)

// ----------
// Point
// ----------

// const pointLight = new THREE.PointLight(0xffffff, 50)
// pointLight.position.set(2, 3, -3)
// scene.add(pointLight)
// const guiPointLight = gui.addFolder("Point Light")
// guiPointLight.add(pointLight, "distance").min(0).max(10).step(0.1)
// guiPointLight.add(pointLight, "decay").min(0).max(10).step(0.1)
//
// pointLight.castShadow = true
// pointLight.shadow.mapSize.width = 1024
// pointLight.shadow.mapSize.height = 1024
// pointLight.shadow.camera.near = 0.5
// pointLight.shadow.camera.far = 20
//
// const pointLightHelper= new THREE.PointLightHelper(pointLight, 0.2)
// scene.add(pointLightHelper)
// const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
// scene.add(pointLightCameraHelper)

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
// renderer.shadowMap.enabled = true
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
  console.log(box.position.y)

  shadowPlane.position.x = box.position.x
  shadowPlane.position.z = box.position.z
  shadowPlane.material.opacity = (1 - box.position.y/3) * 2

  //
  // render
  //
  renderer.render(scene, camera)
  window.requestAnimationFrame(animate)
}

animate()
