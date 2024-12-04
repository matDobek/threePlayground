import "../app.css"
import * as THREE from "three"
import { FontLoader } from "three/examples/jsm/loaders/FontLoader"
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry"
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
// Helpers
//

const aHelper = new THREE.AxesHelper
scene.add(aHelper)

//
// Textures
//

const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load("/textures/matcaps/3.png")
matcapTexture.colorSpace = THREE.SRGBColorSpace

//
// Fonts
//
const fontLoader = new FontLoader()

fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  const geometry = new TextGeometry("Glorious Evolution", {
    font: font,
    size: 0.5,
    depth: 0.1,
    curveSegments: 5,
    bevelEnabled: true,
    bevelSegments: 4,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
  })

  // geometry.computeBoundingBox()
  // geometry.translate(
  //   (geometry.boundingBox.max.x - 0.02) * 0.5 * -1,
  //   (geometry.boundingBox.max.y - 0.02) * 0.5 * -1,
  //   (geometry.boundingBox.max.z - 0.03) * 0.5 * -1,
  // )
  // geometry.computeBoundingBox()
  // console.log(geometry.boundingBox)
  geometry.center()

  const material = new THREE.MeshMatcapMaterial()
  material.wireframe = false
  material.matcap = matcapTexture
  const text = new THREE.Mesh(geometry, material)

  // const textGUI = gui.addFolder("text")
  // textGUI.add(geometry, "size").min(0).max(10).step(0.1)

  scene.add(text)

  console.time("donuts")
  const g = new THREE.TorusGeometry(0.3, 0.2, 20, 24)
  // const m = new THREE.MeshMatcapMaterial({matcap: matcapTexture})
  const m = new THREE.MeshNormalMaterial()

  for(let i = 0; i < 100; i++) {
    const d = new THREE.Mesh(g, m)

    d.position.x = (Math.random() - 0.5) * 10
    d.position.y = (Math.random() - 0.5) * 10
    d.position.z = (Math.random() - 0.5) * 10

    d.rotation.x = Math.random() * Math.PI
    d.rotation.y = Math.random() * Math.PI

    const r = Math.random()
    d.scale.set(r, r, r)

    scene.add(d)
  }

  console.timeEnd("donuts")
})

//
// OBJECTS
//

//
// LIGHT
//
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 30)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

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

  //
  // render
  //
  renderer.render(scene, camera)
  window.requestAnimationFrame(animate)
}

animate()
