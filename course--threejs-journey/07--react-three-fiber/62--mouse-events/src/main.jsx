import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Canvas } from '@react-three/fiber'

import './style.css'
import Experience from './Experience.jsx'
import { Bvh } from '@react-three/drei'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Canvas
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [1, 2, 6]
      }}
    >
      <Bvh>
        <Experience />
      </Bvh>
    </Canvas>
  </StrictMode>,
)
