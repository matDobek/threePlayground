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

const particlesTexture = textureLoader.load("../../public/textures/particles/1.png")

// ========================================
// OBJECTS
// ========================================

//--------------------
// custom geometry
//--------------------

const customGeometry = new THREE.BufferGeometry()
const count = 20000

const vertices = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)

for(let i = 0; i < vertices.length; i++) {
  vertices[i] = ( Math.random() - 0.5 ) * 20
  colors[i] = Math.random()
}
customGeometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3))
customGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))

//--------------------
// other geometries
//--------------------

const planeGeometry = new THREE.PlaneGeometry(10, 10, 32, 32);
const sphereGeometry = new THREE.SphereGeometry(10, 30, 30)

//--------------------
// materials
//--------------------

const particlesMaterial = new THREE.PointsMaterial({
  size: 0.2,
  sizeAttenuation: true,

  transparent: true,
  // opacity: 0.2,
  alphaMap: particlesTexture,
  alphaTest: 0.001, // do not render opacity is lower than this value

  depthTest: false,
  depthWrite: false,
  blending: THREE.AdditiveBlending,

  color: 0xff88cc,
  vertexColors: true
})

//--------------------
// mesh
//--------------------

const particles1 = new THREE.Points(customGeometry, particlesMaterial)
// const particles2 = new THREE.Points(planeGeometry, particlesMaterial)
// const particles3 = new THREE.Points(sphereGeometry, particlesMaterial)

particles1.position.x = 0
// particles2.position.x = -30
// particles3.position.x = 30

scene.add(
  particles1,
  // particles2,
  // particles3
)

// ========================================
// LIGHT
// ========================================

// ----------
// Ambient
// ----------
const ambientLight = new THREE.AmbientLight(0xffffff, 0.05)
scene.add(ambientLight)

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
camera.position.set(0, 30, 50)
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

  //
  // update particles
  //
  // particles1.rotation.y = elapsedTime * 0.2
  // particles1.rotation.z = elapsedTime * 0.2
  for(let i = 0; i < count; i++) {
    const i3 = i*3

    const x = customGeometry.attributes.position.array[i3 + 0]
    customGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)

  }

  customGeometry.attributes.position.needsUpdate = true

  //
  // render
  //
  renderer.render(scene, camera)
  window.requestAnimationFrame(animate)
}

animate()
