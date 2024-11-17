import "./app.css"
import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
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

const material = new THREE.MeshBasicMaterial()
const geometry = new THREE.BoxGeometry(1, 1, 1)
const box = new THREE.Mesh(geometry, material)
box.position.set(0, 0, 0);

scene.add(box)

//
// LIGHT
//
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

// const pointLight = new THREE.PointLight(0xffffff, 30)
// pointLight.position.x = 2
// pointLight.position.y = 3
// pointLight.position.z = 4
// scene.add(pointLight)

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
  box.rotation.y = 0.1 * elapsedTime

  //
  // render
  //
  renderer.render(scene, camera)
  window.requestAnimationFrame(animate)
}

animate()
