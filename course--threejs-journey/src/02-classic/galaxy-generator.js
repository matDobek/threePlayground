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

// ========================================
// OBJECTS
// ========================================

// ------------------------------
// Galaxy
// ------------------------------

const parameters = {}
parameters.count = 50000
parameters.size = 0.02
parameters.radius = 5
parameters.arms = 6
parameters.spin = 1
parameters.randomness = 0.2
parameters.randomnessPower = 5
parameters.insideColor = 0xff6030
parameters.outsideColor = 0x1b3984

let geometry = null
let material = null
let points = null

const generateGalaxy = () => {
  console.log("generating galaxy")

  if(points != null) {
    geometry.dispose()
    material.dispose()
    scene.remove(points)
  }

  const vertices = new Float32Array(parameters.count * 3)
  const colors = new Float32Array(parameters.count * 3)

  const colorInside = new THREE.Color(parameters.insideColor)
  const colorOutside = new THREE.Color(parameters.outsideColor)

  for(let i = 0; i < parameters.count; i++) {
    const i3 = i*3

    // position
    const radius = Math.random() * parameters.radius
    const angle = ( i % parameters.arms ) / parameters.arms * Math.PI * 2
    const spinAngle = radius * parameters.spin

    const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
    const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
    const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)

    vertices[i3 + 0] = Math.cos(angle + spinAngle) * radius + randomX
    vertices[i3 + 1] = randomY
    vertices[i3 + 2] = Math.sin(angle + spinAngle) * radius + randomZ

    // colors
    const mixedColor = colorInside.clone()
    mixedColor.lerp(colorOutside, radius / parameters.radius)

    colors[i3 + 0] = mixedColor.r
    colors[i3 + 1] = mixedColor.g
    colors[i3 + 2] = mixedColor.b
  }

  geometry = new THREE.BufferGeometry()
  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3))
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))

  material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true
  })

  points = new THREE.Points(geometry, material)

  scene.add(points)

}

generateGalaxy()

gui.add(parameters, 'count').min(1000).max(100000).step(1000).onFinishChange(generateGalaxy)
gui.add(parameters, 'size').min(0.01).max(1).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters, 'radius').min(1).max(20).step(0.1).onFinishChange(generateGalaxy)
gui.add(parameters, 'arms').min(2).max(20).step(1).onFinishChange(generateGalaxy)
gui.add(parameters, 'spin').min(-5).max(5).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy)
gui.addColor(parameters, 'insideColor').onChange(generateGalaxy)
gui.addColor(parameters, 'outsideColor').onChange(generateGalaxy)

// ========================================
// LIGHT
// ========================================

// ----------
// Ambient
// ----------
const ambientLight = new THREE.AmbientLight(0xffffff, 15)
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
camera.position.set(0, 10, 10)
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
  // render
  //
  renderer.render(scene, camera)
  window.requestAnimationFrame(animate)
}

animate()
