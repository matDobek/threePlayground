import { createRoot } from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import './index.css'
import { StrictMode } from 'react'
import { Leva } from 'leva'
import * as THREE from 'three'

// import Experience from './Components/Test'

// import Experience from './Components/Basic'
// import Experience from './Components/R3F/Experience.jsx'
// import Experience from './Components/Drei/Experience.jsx'
// import Experience from './Components/Debug/Experience.jsx'
// import Experience from './Components/Environment/Experience.jsx'
import Experience from './Components/LoadModels'

// const created = ({ gl, scene }) => {
  // gl.setClearColor('#ff0000', 1)
  // scene.background = new THREE.Color('red')
// }

const root = createRoot(document.querySelector('#root'))
root.render(
  <StrictMode>
    <Leva collapsed/>

    { /* <Canvas onCreated={ created } > */ }
    <Canvas
      shadows
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [4, 10, 15]
      }}
    >
      <Experience />
    </Canvas>
  </StrictMode>
)
