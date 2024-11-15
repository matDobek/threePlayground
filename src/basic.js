import "./app.css"
import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import gsap from "gsap"
import GUI from "lil-gui"

//
// DEBUG
//
const gui = new GUI({
  widht: 300,
  title: "Debug UI",
  closeFolders: false
})

gui.hide()
window.addEventListener("keydown", (event) => {
  if(event.key == 'h') {
    gui.show(gui._hidden)
  }
})

const debugObject = {}

//
// CANVAS
//

const canvas = document.querySelector('canvas.webgl')

//
// SCENE
//

const scene = new THREE.Scene()

//
// HELPERS
//

const axisHelper = new THREE.AxesHelper()
scene.add(axisHelper)

//
// OBJECTS
// mesh - combination of:
//          geometry
//          material
//

const group = new THREE.Group()
scene.add(group)

// const geometry = new THREE.BoxGeometry(1, 2, 1, 3, 3, 2)
const geometry = new THREE.BufferGeometry()

const positionArray = new Float32Array([
  0, 0, 0,
  0, 1, 0,
  1, 0, 0,

  0, 0, 0,
  0, -1, 0,
  -1, 0, 0,
])
const positionAttribute = new THREE.BufferAttribute(positionArray, 3)
geometry.setAttribute('position', positionAttribute)

const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
const box1 = new THREE.Mesh(geometry, material)

const geometry2 = new THREE.BufferGeometry()
const positionArray2 = new Float32Array(100 * 3 * 3)
for(let i = 0; i < positionArray2.length; i++) {
  positionArray2[i] = ( Math.random() - 0.5 ) * 2
}
const positionAttribute2 = new THREE.BufferAttribute(positionArray2, 3)
geometry2.setAttribute('position', positionAttribute2)
const material2 = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
const box2 = new THREE.Mesh(geometry2, material2)

debugObject.color = 0x0000ff
const material3 = new THREE.MeshBasicMaterial({ color: debugObject.color, wireframe: true })
const box3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  material3
)

box1.position.set(0, 0, 0);
box2.position.set(-5, 0, 0);
box3.position.set(5, 0, 0);
// box1.scale.set(1, 1.5, 1);
// box1.rotation.set(0, 0, 2);
// box1.quaternion.set(0, 0, 0)

group.add(box1)
group.add(box2)
group.add(box3)

const groupFolder = gui.addFolder("group")

groupFolder.add(group.position, "x").min(-3).max(3).step(0.01).name("group.x")
groupFolder.add(group.position, "y").min(-3).max(3).step(0.01)
groupFolder.add(group.position, "z").min(-3).max(3).step(0.01)
groupFolder.add(group, "visible")

gui.add(material3, "wireframe")
gui
  .addColor(material3, "color")
  .onChange((value) => {
    console.log(value.getHexString())
  })

gui
  .addColor(debugObject, "color")
  .onChange((value) => {
    material3.color.set(value)
  })

debugObject.spin = () => {
  gsap.to(box3.rotation, { y: box3.rotation.y + Math.PI*2, duration: 3 })
}
gui.add(debugObject, "spin")

debugObject.subdivision = 1
gui
  .add(debugObject, "subdivision")
  .min(1)
  .max(20)
  .step(1)
  .onFinishChange(() => {
    box3.geometry.dispose()
    box3.geometry = new THREE.BoxGeometry(
      1, 1, 1,
      debugObject.subdivision, debugObject.subdivision, debugObject.subdivision
    )
  })

// group.scale.set(1, 1.5, 1)

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

window.addEventListener("dblclick", () => {

  if (document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement) {
    (document.exitFullscreen ||
      document.webkitExitFullscreen ||
      document.mozCancelFullScreen ||
      document.msExitFullscreen).call(document);
  } else {
    (canvas.requestFullscreen ||
      canvas.webkitRequestFullscreen ||
      canvas.mozRequestFullscreen ||
      canvas.msRequestFullscreen).call(canvas);
  }
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
renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 2)
)
console.log(window.devicePixelRatio)

//
// CURSOR
//

// const cursor = { x: 0, y: 0 }
// let mouseDown = false
//
// window.addEventListener("mousedown", (_event) => {
//   mouseDown = true
// })
//
// window.addEventListener("mouseup", (_event) => {
//   mouseDown = false
// })
//
// window.addEventListener("mousemove", (event) => {
//   if(mouseDown) {
//     cursor.x = event.clientX / sizes.width - 0.5
//     cursor.y = event.clientY / sizes.height - 0.5
//
//     cursor.x /= Math.abs(cursor.x)
//     cursor.y /= Math.abs(cursor.y) * (-1) // invert
//   } else {
//     cursor.x = 0
//     cursor.y = 0
//   }
// })
//

const controls = new OrbitControls(camera, canvas)

//
// Animations
//

gsap.to(box2.position, {duration: 1, delay: 1, x: -3})
gsap.to(box3.position, {duration: 1, delay: 1, x: 3})

let clock = new THREE.Clock()
let currentTime = Date.now()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  // const deltaTime = clock.getDelta() // mostly 0s
  const deltaTime = Date.now() - currentTime
  currentTime = Date.now()

  //
  // animation
  //
  // group.rotation.y = elapsedTime

  //
  // camera
  //
  // camera.position.x += cursor.x * 0.1
  // camera.position.y += cursor.y * 0.1

  //
  // render
  //
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}

tick()
