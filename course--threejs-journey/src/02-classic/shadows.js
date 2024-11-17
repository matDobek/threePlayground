import "../app.css"
import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper"
import GUI from "lil-gui"

//
// DEBUG
//
const gui = new GUI()

//
// CANVAS
//

const canvas = document.querySelector('canvas.webgl')

//
// SCENE
//

const scene = new THREE.Scene()

//
// Textures
//
const textureLoader = new THREE.TextureLoader()

// const texture = textureLoader.load("")
// texture.colorSpace = THREE.SRGBColorSpace

//
// OBJECTS
//

const material = new THREE.MeshStandardMaterial()
material.wireframe = false
material.roughness = 0.4

const guiMaterial = gui.addFolder("material")
guiMaterial.add(material, "wireframe")
guiMaterial.add(material, "roughness").min(0).max(1).step(0.01)

const box = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  material
)
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 10, 10),
  material
)
const donut = new THREE.Mesh(
  new THREE.TorusGeometry(1, 0.3, 20, 20),
  material
)

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  material
)

box.position.set(0, 0, 0)
sphere.position.set(-5, 0, 0)
donut.position.set(5, 0, 0)

plane.position.set(0, -5, 0)
plane.rotation.x = -Math.PI / 2

scene.add(box, sphere, donut, plane)

//
// LIGHT
//

// ----------
// Ambient
// ----------
const ambientLight = new THREE.AmbientLight(0xffffff, 0.05)
scene.add(ambientLight)

// ----------
// Hemisphere
// ----------
const hemisphereLight = new THREE.HemisphereLight(0xff3333, 0x33ff33, 1.2)
scene.add(hemisphereLight)

const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
scene.add(hemisphereLightHelper)

// ----------
// Directional
// ----------
const directionalLight = new THREE.DirectionalLight(0xffcccc, 1.2)
directionalLight.position.set(2, 5, 0)
scene.add(directionalLight)

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
scene.add(directionalLightHelper)

// ----------
// Point
// ----------
const pointLight = new THREE.PointLight(0xffffff, 10)
pointLight.position.set(1, -2.5, 1)
pointLight.distance = 3
pointLight.decay = 3
scene.add(pointLight)
const guiPointLight = gui.addFolder("Point Light")
guiPointLight.add(pointLight, "distance").min(0).max(10).step(0.1)
guiPointLight.add(pointLight, "decay").min(0).max(10).step(0.1)

const pointLightHelper= new THREE.PointLightHelper(pointLight, 0.2)
scene.add(pointLightHelper)

// ----------
// RectArea
// ----------
const rectAreaLight = new THREE.RectAreaLight(0x3333ff, 6, 5, 5)
rectAreaLight.position.set(2, 5, 5)
rectAreaLight.lookAt(new THREE.Vector3())
scene.add(rectAreaLight)

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight, 0.2)
scene.add(rectAreaLightHelper)

// ----------
// Spot
// ----------
// color, intensity, distance, angle, penumbra, decay
const spotLight = new THREE.SpotLight(0xff0000, 6, 20, Math.PI * 0.1, 0.5, 1)
spotLight.position.set(2, 5, 2)
spotLight.target.position.set(-2, 0, 0)
scene.add(spotLight)
scene.add(spotLight.target)

const spotLightHelper = new THREE.SpotLightHelper(spotLight, 0.2)
scene.add(spotLightHelper)

//
// CAMERA
//

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
camera.position.set(0, 0, 10)
// camera.lookAt(mesh.position)
scene.add(camera)

//
// RENDERER
//

const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio( Math.min(window.devicePixelRatio, 2) )

//
// CONTROLS
//

const controls = new OrbitControls(camera, canvas)

//
// Animations
//

const clock = new THREE.Clock()

const animate = () => {

  const elapsedTime = clock.getElapsedTime()

  box.rotation.x = -0.15 * elapsedTime
  sphere.rotation.x = -0.15 * elapsedTime
  donut.rotation.x = -0.15 * elapsedTime

  box.rotation.y = 0.1 * elapsedTime
  sphere.rotation.y = 0.1 * elapsedTime
  donut.rotation.y = 0.1 * elapsedTime

  //
  // render
  //
  renderer.render(scene, camera)
  window.requestAnimationFrame(animate)
}

animate()
