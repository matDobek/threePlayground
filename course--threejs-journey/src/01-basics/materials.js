import "../app.css"
import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import GUI from "lil-gui"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader"

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

const doorColorTexture = textureLoader.load('./textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('./textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('./textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('./textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('./textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('./textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('./textures/door/roughness.jpg')
const matcapTexture = textureLoader.load('./textures/matcaps/5.png')
const gradientTexture = textureLoader.load('./textures/gradients/5.jpg')

doorColorTexture.colorSpace = THREE.SRGBColorSpace
matcapTexture.colorSpace = THREE.SRGBColorSpace

//
// OBJECTS
//

// // MeshBasicMaterial
// const material = new THREE.MeshBasicMaterial()
// material.color = new THREE.Color(0xbbbbbb)
// material.map = doorColorTexture
// material.transparent = true
// material.opacity = 0.5
// material.alphaMap = doorAlphaTexture // white - visible, black - hidden
// material.side = THREE.DoubleSide

// // MeshNormalMaterial
// const material = new THREE.MeshNormalMaterial()
// material.flatShading = true

// // MeshMatcapMaterial
// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcapTexture

// MeshLambertMaterial
// const material = new THREE.MeshLambertMaterial()

// Phong
// const material = new THREE.MeshPhongMaterial()
// material.shininess = 70
// material.specular = new THREE.Color(0xaaaaaa)

// Toon
// const material = new THREE.MeshToonMaterial()
// gradientTexture.generateMipmaps = false
// gradientTexture.minFilter = THREE.NearestFilter
// gradientTexture.magFilter = THREE.NearestFilter
// material.gradientMap = gradientTexture

// Standard
// const material = new THREE.MeshStandardMaterial()
// material.metalness = 1
// material.roughness = 1
// material.side = THREE.DoubleSide
// material.map = doorColorTexture
// material.aoMap = doorAmbientOcclusionTexture
// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture
// material.normalMap = doorNormalTexture
// material.normalScale.set(0.5, 0.5)
// material.alphaMap = doorAlphaTexture
// // material.displacementMap = doorHeightTexture

// Physical
const material = new THREE.MeshPhysicalMaterial()
material.metalness = 1
material.roughness = 1
material.side = THREE.DoubleSide
material.map = doorColorTexture
material.aoMap = doorAmbientOcclusionTexture
material.metalnessMap = doorMetalnessTexture
material.roughnessMap = doorRoughnessTexture
material.normalMap = doorNormalTexture
material.normalScale.set(0.5, 0.5)
material.alphaMap = doorAlphaTexture
// material.displacementMap = doorHeightTexture

// Clearcoat
material.clearcoat = 0
material.clearcoatRoughness = 0
const clearcoatGUI = gui.addFolder("clearcoat")
clearcoatGUI.add(material, 'clearcoat').min(0).max(1).step(0.0001)
clearcoatGUI.add(material, 'clearcoatRoughness').min(0).max(1).step(0.0001)

// Sheen
material.sheen = 0
material.sheenRoughness = 0.25
material.sheenColor.set(1, 1, 1)
const sheenGUI = gui.addFolder("sheen")
sheenGUI.add(material, 'sheen').min(0).max(1).step(0.0001)
sheenGUI.add(material, 'sheenRoughness').min(0).max(1).step(0.0001)
sheenGUI.addColor(material, 'sheenColor')

// Iridescence
material.iridescence = 0
material.iridescenceIOR = 1
material.iridescenceThicknessRange = [ 100, 800 ]
const iriGUI = gui.addFolder("iridescence")
iriGUI.add(material, 'iridescence').min(0).max(1).step(0.0001)
iriGUI.add(material.iridescenceThicknessRange, '0').min(1).max(1000).step(1)
iriGUI.add(material.iridescenceThicknessRange, '1').min(1).max(1000).step(1)
iriGUI.add(material, 'iridescenceIOR').min(1).max(2.333).step(0.0001)

// Transmission
material.transmission = 1
material.ior = 1.5
material.thickness = 0.5
const transGUI = gui.addFolder("transmission")
transGUI.add(material, 'transmission').min(0).max(1).step(0.0001)
transGUI.add(material, 'ior').min(1).max(10).step(0.0001)
transGUI.add(material, 'thickness').min(0).max(1).step(0.0001)


const restGUI = gui.addFolder("other")
restGUI.add(material, "metalness").min(0).max(1).step(0.01)
restGUI.add(material, "roughness").min(0).max(1).step(0.01)
restGUI.add(material.normalScale, "x").min(0).max(1).step(0.01)
restGUI.add(material.normalScale, "y").min(0).max(1).step(0.01)

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), material)
const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material)
const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 16, 32), material)

sphere.position.set(-2, 0, 0);
plane.position.set(0, 0, 0);
torus.position.set(2, 0, 0);

scene.add(sphere, plane, torus)

//
// LIGHT
//
// const ambientLight = new THREE.AmbientLight(0xffffff, 1)
// scene.add(ambientLight)
//
// const pointLight = new THREE.PointLight(0xffffff, 30)
// pointLight.position.x = 2
// pointLight.position.y = 3
// pointLight.position.z = 4
// scene.add(pointLight)

//
// ENVIRONMENT
//
const rgbeLoader = new RGBELoader()
rgbeLoader.load("../../public/textures/environmentMap/2k.hdr", (envMap) => {
  envMap.mapping = THREE.EquirectangularReflectionMapping

  scene.background = envMap
  scene.environment = envMap
})

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
camera.position.set(0, 0, 5)
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

  // sphere.rotation.x = -0.15 * elapsedTime
  // plane.rotation.x = -0.15 * elapsedTime
  // torus.rotation.x = -0.15 * elapsedTime
  //
  // sphere.rotation.y = 0.1 * elapsedTime
  // plane.rotation.y = 0.1 * elapsedTime
  // torus.rotation.y = 0.1 * elapsedTime

  //
  // render
  //
  renderer.render(scene, camera)
  window.requestAnimationFrame(animate)
}

animate()
