import "../app.css"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import GUI from "lil-gui"

//===================
// Debug
//===================

const gui = new GUI()

//===================
// Canvas
//===================

const canvas = document.querySelector('canvas.webgl')
const size = {
  width: window.innerWidth,
  height: window.innerHeight,
}

//===================
// Scene
//===================

const scene = new THREE.Scene()

//===================
// Lights
//===================

const ambientLight = new THREE.AmbientLight(0xffffff, 0.05)
scene.add(ambientLight)

const spotLight = new THREE.SpotLight(0xffffff, 20, 0, Math.PI/4)
spotLight.position.set(2, 5, 2)
spotLight.distance = 15

spotLight.castShadow = true
spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024
spotLight.shadow.camera.near = 1
spotLight.shadow.camera.far = 12

scene.add(spotLight)
scene.add(spotLight.target)

const spotlightHelper = new THREE.SpotLightHelper(spotLight)
const spotlightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
scene.add(spotlightHelper)
scene.add(spotlightCameraHelper)

spotlightHelper.visible = false
spotlightCameraHelper.visible = false

const lightGUI = gui.addFolder("Light")
lightGUI.add(spotlightHelper, "visible").name("spotlight helper")
lightGUI.add(spotlightCameraHelper, "visible").name("spotlight camera helper")

//===================
// Objects
//===================u

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({color: 0xffffff})
)
plane.rotation.x = - Math.PI / 2
scene.add(plane)

const box1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({color: 0xffffff})
)
const box2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({color: 0xffffff})
)
const box3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({color: 0xffffff})
)
scene.add(box1, box2, box3)

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 20, 20),
  new THREE.MeshStandardMaterial({color: 0xffffff})
)
scene.add(sphere)

//
// ------ custom str ------
//

const geometry = new THREE.BufferGeometry()
const vertices = new Float32Array([
  // base verticies ( square )
  -1, 0, -1, // 0 top left
  -1, 0, 1,  // 1 bottom left
  1, 0, 1,   // 2 bottom right
  1, 0, -1,  // 3 top right

  0, 1, 0,   // 4 apex
])

const indices = [
  2, 4, 1, // front face
  3, 4, 2, // right face
  0, 4, 3, // back face
  1, 4, 0, // left face

  // base face
  1, 0, 2,
  0, 3, 2,
]

geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3))
geometry.setIndex(indices)
geometry.computeVertexNormals() // compute normals for lighting

const obj = new THREE.Mesh(
  geometry,
  new THREE.MeshStandardMaterial({color: 0xffffff, wireframe: false})
)
scene.add(obj)

obj.castShadow = true

//
// ------ custom end ------
//

plane.receiveShadow = true
box1.castShadow = true
box2.castShadow = true
box3.castShadow = true
sphere.castShadow = true

plane.position.set(0, -0.5, 0)
box1.position.set(-3, 0, -3)
box2.position.set(-1.5, 0, -1.5)
box3.position.set(0, 0, -0)
sphere.position.set(1.5, 0, 1.5)

const objs = [box1, box2, box3, sphere]
objs.map((o) => {
    o.geometry.translate(0, 10, 0)
})
// sphere.geometry.translate(0, 1, 0)

// box.rotation.z = - Math.PI / 4

// spotLight.target.position.add(box.position)

const boundingBox1 = new THREE.BoxHelper(box1, 0xff0000)
// boundingBox1.update()
scene.add(boundingBox1)

box2.geometry.computeBoundingBox()
const boundingBox2 = new THREE.Mesh(
  new THREE.BoxGeometry(
    box2.geometry.boundingBox.max.x - box2.geometry.boundingBox.min.x,
    box2.geometry.boundingBox.max.y - box2.geometry.boundingBox.min.y,
    box2.geometry.boundingBox.max.z - box2.geometry.boundingBox.min.z
  ),
  new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true})
)

boundingBox2.position.copy(box2.position)
boundingBox2.position.add(box2.geometry.boundingBox.min)
boundingBox2.position.add(box2.geometry.boundingBox.max)
console.log(box2.position)
console.log(box2.geometry)
console.log(box2.geometry.boundingBox)
scene.add(boundingBox2)

box3.geometry.computeBoundingSphere()
const boundingBox3 = new THREE.Mesh(
  new THREE.SphereGeometry(box3.geometry.boundingSphere.radius, 10, 10),
  new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true})
)
boundingBox3.position.copy(box3.position)
boundingBox3.position.add(box3.geometry.boundingSphere.center)
scene.add(boundingBox3)

const boundingSphere = new THREE.BoxHelper(sphere, 0xff0000)
// boundingSphere.update()
scene.add(boundingSphere)

// boundingBox1.visible = false
// boundingBox2.visible = false
// boundingBox3.visible = false
// boundingSphere.visible = false
const boundingGUI = gui.addFolder("Bounding")
boundingGUI.add(boundingBox1, "visible").name("box 1")
// boundingGUI.add(boundingBox2, "visible").name("box 2")
boundingGUI.add(boundingBox3, "visible").name("box 3")
boundingGUI.add(boundingSphere, "visible").name("sphere")


//===================
// Camera
//===================

const camera = new THREE.PerspectiveCamera(45, size.width / size.height)
camera.position.set(0, 10, 15)
camera.rotation.set(-0.5, 0, 0)
scene.add(camera)
// camera.lookAt(plane.position)

const cameraGUI = gui.addFolder("Camera")
cameraGUI.add(camera.position, "x").name("position x").listen()
cameraGUI.add(camera.position, "y").name("position y").listen()
cameraGUI.add(camera.position, "z").name("position z").listen()
cameraGUI.add(camera.rotation, "x").name("rotation x").listen()
cameraGUI.add(camera.rotation, "y").name("rotation y").listen()
cameraGUI.add(camera.rotation, "z").name("rotation z").listen()

//===================
// Helpers
//===================

const controls = new OrbitControls(camera, canvas)

//===================
// Renderer
//===================

const renderer = new THREE.WebGLRenderer({canvas: canvas})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(size.width, size.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//===================
// Animations
//===================

const tick = () => {
  //
  // render
  //
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}

tick()
