import "../app.css"
import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import GUI from "lil-gui"
import CANNON from "cannon"

// ========================================
// DEBUG
// ========================================

const gui = new GUI()
const debugObject = {}

debugObject.createSphere = () => {
  createSphere(
    Math.random() * 0.5,
    {
      x: (Math.random() - 0.5) * 3,
      y: 3,
      z: (Math.random() - 0.5) * 3
    }
  )
}

debugObject.createBox = () => {
  createBox(
    Math.random() * 1.5,
    Math.random() * 1.5,
    Math.random() * 1.5,
    {
      x: (Math.random() - 0.5) * 3,
      y: 3,
      z: (Math.random() - 0.5) * 3
    }
  )
}

debugObject.reset = () => {
  for(const obj of objectsToUpdate) {
    // remove body
    obj.body.removeEventListener('collide', playHitSound)
    world.removeBody(obj.body)

    // remove mesh
    scene.remove(obj.mesh)
  }

  objectsToUpdate.splice(0, objectsToUpdate.length)
}

gui.add(debugObject, "createSphere")
gui.add(debugObject, "createBox")
gui.add(debugObject, "reset")

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
// texture.colorSpace = THREE.SRGBColorSpace

// ========================================
// AUDIO
// ========================================

const hitSound = new Audio("/public/sounds/hit.mp3")

const playHitSound = (collision) => {
  const impactStrength = collision.contact.getImpactVelocityAlongNormal()

  if(impactStrength > 1.0 ) {
    console.log(impactStrength)
    hitSound.currentTime = 0
    hitSound.play()
  }
}

// ========================================
// PHISICS
// ========================================

//
// world
//

const world = new CANNON.World()
world.broadphase = new CANNON.SAPBroadphase(world)
world.sleep = true
world.gravity.set(0, -9.82, 0)

//
// materials
//
//
// const concreteMaterial = new CANNON.Material('concrete')
// const plasticMaterial = new CANNON.Material('plastic')
//
// const conretePlasticContactMaterial = new CANNON.ContactMaterial(
//   concreteMaterial,
//   plasticMaterial,
//   {
//     friction: 0.1,
//     restitution: 0.7
//   }
// )
// world.addContactMaterial(conretePlasticContactMaterial)

const defaultMaterial = new CANNON.Material('default')
const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.1,
    restitution: 0.9
  }
)
world.addContactMaterial(defaultContactMaterial)
world.defaultContactMaterial = defaultContactMaterial

//
// floor
//

const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
floorBody.mass = 0
// floorBody.material = concreteMaterial
floorBody.addShape(floorShape)
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
world.addBody(floorBody)

// ========================================
// OBJECTS
// ========================================

//
// plane
//

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({color: 0xffffff})
)

plane.rotation.x = -Math.PI / 2
// plane.position.set(0, -0.5, 0)

plane.receiveShadow = true

scene.add(plane)

//
// sphere
//

const objectsToUpdate = []

const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
const sphereMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4
})

const createSphere = (radius, position) => {
  const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
  mesh.scale.setScalar(radius)

  mesh.castShadow = true
  mesh.receiveShadow = true
  mesh.position.copy(position)
  scene.add(mesh)

  // phisics

  const shape = new CANNON.Sphere(radius)
  const body = new CANNON.Body({
    mass: radius,
    // position: new CANNON.Vec3(0, 3, 0),
    shape: shape,
    material: defaultMaterial
  })
  body.position.copy(position)
  world.addBody(body)

  // body.applyLocalForce(new CANNON.Vec3(150, 0, 0), new CANNON.Vec3(0, 0, 0))

  objectsToUpdate.push({mesh: mesh, body: body})
}

const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const boxMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4
})

const createBox = (x, y, z, pos) => {
  const mesh = new THREE.Mesh(boxGeometry, boxMaterial)
  mesh.scale.x = x
  mesh.scale.y = y
  mesh.scale.z = z
  mesh.position.copy(pos)
  mesh.castShadow = true
  mesh.receiveShadow = true
  scene.add(mesh)

  // physics

  const px = x * 0.5
  const py = y * 0.5
  const pz = z * 0.5
  const shape = new CANNON.Box(new CANNON.Vec3(px, py, pz))
  const body = new CANNON.Body({
    mass: (x+y+z) / 3,
    shape: shape,
    material: defaultMaterial
  })
  body.position.copy(pos)
  world.addBody(body)

  // body.applyLocalForce(new CANNON.Vec3(150, 0, 0), new CANNON.Vec3(0, 0, 0))
  body.addEventListener("collide", playHitSound)

  //

  objectsToUpdate.push({mesh: mesh, body: body})
}

createBox(1, 1, 1, {x: 0, y: 10, z: 0})
createSphere(0.5, {x: 0, y: 3, z: 0})

// for (let index = 0; index < 1000; index++) {
//   debugObject.createBox()
// }

// ========================================
// LIGHT
// ========================================

// ----------
// Ambient
// ----------
const ambientLight = new THREE.AmbientLight(0xffffff, 0.05)
scene.add(ambientLight)

// ----------
// Spot
// ----------
// color, intensity, distance, angle, penumbra, decay
const spotLight = new THREE.SpotLight(0xffffff, 200, 50, Math.PI * 0.3)
spotLight.position.set(5, 10, 5)
spotLight.target.position.set(0, 0, 0)
spotLight.castShadow = true
spotLight.shadow.mapSize.width  = 1024
spotLight.shadow.mapSize.height = 1024
spotLight.shadow.camera.near = 0.5
spotLight.shadow.camera.far = 1

scene.add(spotLight)
scene.add(spotLight.target)

// const spotLightHelper = new THREE.SpotLightHelper(spotLight, 0.2)
// scene.add(spotLightHelper)
// const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
// scene.add(spotLightCameraHelper)

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
camera.position.set(0, 10, 20)
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
let oldElapsedTime = clock.getElapsedTime()

const animate = () => {

  const elapsedTime = clock.getElapsedTime()
  const frameTime = elapsedTime - oldElapsedTime
  oldElapsedTime = elapsedTime

  // update phisics world

  world.step(1/60, frameTime, 3)

  for(const object of objectsToUpdate) {
    // object.body.applyForce(new CANNON.Vec3(-0.5, 0, 0), object.body.position)

    object.mesh.position.copy(object.body.position)
    object.mesh.quaternion.copy(object.body.quaternion)
  }

  // update controls
  controls.update()

  //
  // render
  //
  renderer.render(scene, camera)
  window.requestAnimationFrame(animate)
}

animate()
