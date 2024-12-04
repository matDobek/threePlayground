import "../app.css"
import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import gsap from "gsap"
import GUI from "lil-gui"

//
// ISSUE
// smaller sphere is not visible
//
// SOLUTIONs
//    1. set renderOrder for bigger sphere
//    2. slightly move smaller sphere further away from the camera
//    * when small sphere is closer to camera
//        3. depthWrite: false, for bigger sphere
//        4. depthTest: false, for smaller sphere
//

const canvas = document.querySelector('canvas.webgl')
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
scene.add(camera);

const controls = new OrbitControls(camera, canvas)
camera.position.set(0, 0, 5);
camera.lookAt(new THREE.Vector3(0, 0, 0));

var ambient = new THREE.AmbientLight( 0xffffff, 1 );
scene.add(ambient);

var light = new THREE.DirectionalLight( 0xffffff, 10 );
light.position.x = camera.position.x;
light.position.y = camera.position.y;
light.position.z = camera.position.z;
scene.add(light);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Definition 1
var geometry1 = new THREE.SphereGeometry(2.0,32,24);
var material1 = new THREE.MeshLambertMaterial({color: 0xffffff, transparent: true, opacity: 0.2});
var sphere1 = new THREE.Mesh(geometry1, material1);
// Definition 2
var geometry2 = new THREE.SphereGeometry(0.5,32,24);
var material2 = new THREE.MeshLambertMaterial({color: 0xff0000, transparent: true, opacity: 0.8});
var sphere2 = new THREE.Mesh(geometry2, material2);

sphere1.position.z = 0
sphere2.position.z = 1

scene.add(sphere1);
scene.add(sphere2);

function tick() {
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick)
}
tick()
