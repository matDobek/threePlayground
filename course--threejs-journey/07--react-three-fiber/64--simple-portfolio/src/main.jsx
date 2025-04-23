import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import Experience from './Experience.jsx'
import { Canvas } from '@react-three/fiber'
import { Leva } from 'leva'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Leva hidden/>

    <Canvas
      className='r3f'
      shadows={ true }
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [0, 6, 10]
      }}
    >
      <Experience />
    </Canvas>
  </StrictMode>,
)
