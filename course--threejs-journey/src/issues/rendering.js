import "../app.css"
import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import gsap from "gsap"
import GUI from "lil-gui"

//
// ISSUE
// What is the rendering order? How `renderOrder` affects it?
//
// SOLUTION
// Weirdly enough it looks like:
//  * opaque, ordered only by `.renderOrder`
//      -- no sorting by distance??
//      -- if confliced fallback to definition order ( not even scene.add )
//  * transparent second, ordered by `.renderOrder` first then `distance`
//

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.far = 20
scene.add(camera);

const controls = new OrbitControls(camera, canvas)

camera.position.set(0, 0, 5);

const ambient = new THREE.AmbientLight( 0xffffff, 0.2 );
scene.add(ambient);

const light = new THREE.DirectionalLight( 0xffffff, 1 );
light.position.set(0, 0, 5)
scene.add(light);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(window.innerWidth, window.innerHeight);

const plane1 = new THREE.Mesh(
  new THREE.PlaneGeometry(),
  new THREE.MeshStandardMaterial({color: 0xff0000}),
);

const plane2 = new THREE.Mesh(
  new THREE.PlaneGeometry(),
  new THREE.MeshStandardMaterial({color: 0x00ff00, transparent: true, opacity: 0.5})
);

const plane3 = new THREE.Mesh(
  new THREE.PlaneGeometry(),
  new THREE.MeshStandardMaterial({color: 0x0000ff, transparent: true, opacity: 0.5})
);

const plane4 = new THREE.Mesh(
  new THREE.PlaneGeometry(),
  new THREE.MeshStandardMaterial({color: 0x00ffff})
);

plane1.position.set(-0.25, 0.25, -5.5)
plane2.position.setScalar(0)
plane3.position.set(0.5, -0.25, 0.5)
plane4.position.set(0.25, 0.5, 5)

plane1.uuid = "AAA"
plane2.uuid = "BBB"
plane3.uuid = "CCC"
plane4.uuid = "DDD"

plane1.onAfterRender = function () { console.log('1o: ' + camera.position.distanceTo(plane1.position)) }
plane2.onAfterRender = function () { console.log('2t: ' + camera.position.distanceTo(plane2.position)) }
plane3.onAfterRender = function () { console.log('3t: ' + camera.position.distanceTo(plane3.position)) }
plane4.onAfterRender = function () { console.log('4o: ' + camera.position.distanceTo(plane4.position)) }

// plane1.renderOrder = 1
// plane2.renderOrder = 1

scene.add(plane4);
scene.add(plane2);
scene.add(plane3);
scene.add(plane1);
console.log(scene.children)

renderer.render(scene, camera);
console.log(renderer.renderLists)

function tick() {
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick)
}
// tick()
