import "./app.css"
import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"

//
// CANVAS
//

const canvas = document.querySelector('canvas.webgl')

//
// SCENE
//

const scene = new THREE.Scene()

//
// OBJECTS
//

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: false })
const box = new THREE.Mesh(geometry, material)
box.position.set(0, 0, 0);
scene.add(box)

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

const animate = () => {
  //
  // render
  //
  renderer.render(scene, camera)
  window.requestAnimationFrame(animate)
}

animate()
