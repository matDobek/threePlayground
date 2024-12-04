import "./portfolio.css"
import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import GUI from "lil-gui"
import gsap from "gsap"

// ========================================
// DEBUG
// ========================================

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

const parameters = {
  materialColor: 0xcda8a9,
}

const gui = new GUI()

gui.addColor(parameters, 'materialColor').onChange(() => {
  material.color.set(parameters.materialColor)
  pointsMaterial.color.set(parameters.materialColor)
})

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

const texture = textureLoader.load("../../public/textures/gradients/3.jpg")
texture.magFilter = THREE.NearestFilter
// texture.colorSpace = THREE.SRGBColorSpace

// ========================================
// OBJECTS
// ========================================

const objectsDistance = 7

const material = new THREE.MeshToonMaterial({
  color: parameters.materialColor,
  gradientMap: texture
})

const mesh1 = new THREE.Mesh(
  new THREE.TorusGeometry(1, 0.4, 16, 60),
  material
)

const mesh2 = new THREE.Mesh(
  new THREE.ConeGeometry(1, 2, 3),
  material
)

const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
)

mesh1.position.y = -objectsDistance * 0
mesh2.position.y = -objectsDistance * 1
mesh3.position.y = -objectsDistance * 2

mesh1.position.x = 2
mesh2.position.x = -2
mesh3.position.x = 2

scene.add(mesh1)
scene.add(mesh2)
scene.add(mesh3)

const sectionMeshes = [mesh1, mesh2, mesh3]

// particles

const particleCount = 2000
const vertices = new Float32Array(particleCount * 3)
for(let i = 0; i < particleCount; i++) {
  let i3 = i * 3

  vertices[i3 + 0] = (Math.random() - 0.5) * 6
  vertices[i3 + 1] = (Math.random() - 0.5) * 2 * objectsDistance*3
  vertices[i3 + 2] = (Math.random() - 0.5) * 3
}

const geometry = new THREE.BufferGeometry()
geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3))

const pointsMaterial = new THREE.PointsMaterial({
  color: parameters.materialColor,
  sizeAttenuation: true,
  size: 0.01
})
const points = new THREE.Points(geometry, pointsMaterial)

scene.add(points)

// ========================================
// LIGHT
// ========================================

// ----------
// Directional
// ----------
const directionalLight = new THREE.DirectionalLight(0xffffff, 3)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)

// ========================================
// CAMERA
// ========================================

const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.set(0, 0, 3.5)
// camera.lookAt(mesh.position)
cameraGroup.add(camera)

// ========================================
// RENDERER
// ========================================

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio( Math.min(window.devicePixelRatio, 2) )
// renderer.shadowMap.enabled = true
// renderer.shadowMap.type = THREE.PCFSoftShadowMap

// ========================================
// CONTROLS
// ========================================

// const controls = new OrbitControls(camera, canvas)

// ========================================
// Animations
// ========================================

let scrollY = window.scrollY
let currSection = -1

window.addEventListener('scroll', () => {
  scrollY = window.scrollY
  const newSection = Math.round(scrollY / window.innerHeight)

  if(newSection != currSection) {
    currSection = newSection
    gsap.to(sectionMeshes[currSection].rotation,{
      duration: 1.5,
      ease: 'power2.inOut',
      x: '+=6',
      y: '+=3',
      z: '+=1.5',
    })
  }
})

const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) => {
  cursor.x = event.clientX / sizes.width - 0.5
  cursor.y = event.clientY / sizes.height - 0.5
})

const clock = new THREE.Clock()
let previousTime = 0

const animate = () => {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - previousTime
  previousTime = elapsedTime

  // camera
  camera.position.y = -scrollY / sizes.height * objectsDistance

  const parallaxX = cursor.x
  const parallaxY = -cursor.y

  cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 1 * deltaTime
  cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 1 * deltaTime

  // animate
  for(const mesh of sectionMeshes) {
    mesh.rotation.x += deltaTime * 0.1
    mesh.rotation.y += deltaTime * 0.12
  }

  //
  // render
  //
  renderer.render(scene, camera)
  window.requestAnimationFrame(animate)
}

animate()
