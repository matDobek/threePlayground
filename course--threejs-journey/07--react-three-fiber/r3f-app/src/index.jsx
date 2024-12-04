import './index.css'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience.jsx'
import * as THREE from 'three'

const root = ReactDOM.createRoot( document.querySelector('#root') )
root.render(
  <Canvas
    dpr={ [1,2] } // pixel ration - max at 2 - default
    gl={{
      antialias: true,
      toneMapping: THREE.ACESFilmicToneMapping,
      outputColorSpace: THREE.SRGBColorSpace,
      alpha: true,
    }}
    orthographic
    camera={{
      fov: 45,
      zoom: 100,
      near: 0.1,
      far: 200,
      position: [5, 7, 10]
    }}
  >
    <Experience />
  </Canvas>
)
