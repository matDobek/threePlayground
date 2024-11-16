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

//
// basic
//
const image = new Image()
const texture = new THREE.Texture(image)
texture.colorSpace = THREE.SRGBColorSpace

image.onload = () => {
  texture.needsUpdate = true
}
image.src = "/textures/door/color.jpg"

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ map: texture })
const box = new THREE.Mesh(geometry, material)
box.position.set(0, 0, 0);
scene.add(box)

//
// LoadingManager & TextureLoader
//
const loadingManager = new THREE.LoadingManager()
loadingManager.onStart = () => {
  console.log("LoadingManager: loading started")
}
loadingManager.onLoad = () => {
  console.log("LoadingManager: loading finished")
}
loadingManager.onProgress = () => {
  console.log("LoadingManager: progress")
}
loadingManager.onError = () => {
  console.log("LoadingManager: loading error")
}

// const textureLoader = new THREE.TextureLoader()
const textureLoader = new THREE.TextureLoader(loadingManager)
const colorTexture = textureLoader.load(
  // "src", load, progress, error
  "/textures/door/color.jpg",
  () => { console.log("loaaded") },
  () => { console.log("progress") },
  () => { console.log("error") },
)
colorTexture.colorSpace = THREE.SRGBColorSpace
const alphaTexture = textureLoader.load("/textures/door/alpha.jpg")
const heightTexture = textureLoader.load("/textures/door/height.jpg")
const normalTexture = textureLoader.load("/textures/door/normal.jpg")

const checkerboard8 = textureLoader.load("/textures/checkerboard-8x8.png")
const checkerboard1024 = textureLoader.load("/textures/checkerboard-1024x1024.png")
checkerboard8.colorSpace = THREE.SRGBColorSpace
checkerboard1024.colorSpace = THREE.SRGBColorSpace

// colorTexture.repeat.x = 2
// colorTexture.repeat.y = 3
// colorTexture.wrapS = THREE.RepeatWrapping
// colorTexture.wrapT = THREE.RepeatWrapping
// colorTexture.wrapS = THREE.MirroredRepeatWrapping
// colorTexture.wrapT = THREE.MirroredRepeatWrapping

// colorTexture.offset.x = 0.5
// colorTexture.offset.y = 0.5

// colorTexture.rotation = Math.PI * 0.25
// colorTexture.center.x += 0.5
// colorTexture.center.y += 0.5

checkerboard8.generateMipmaps = false
checkerboard8.minFilter = THREE.NearestFilter
checkerboard8.magFilter = THREE.NearestFilter

const box2 = new THREE.Mesh(
  new THREE.BoxGeometry(1,1,1),
  new THREE.MeshBasicMaterial({ map: checkerboard8})
)

const box3 = new THREE.Mesh(
  new THREE.BoxGeometry(1,1,1),
  new THREE.MeshBasicMaterial({ map: checkerboard1024})
)

box2.position.set(1, 0, 0)
box3.position.set(2, 0, 0)

scene.add(box2)
scene.add(box3)

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
