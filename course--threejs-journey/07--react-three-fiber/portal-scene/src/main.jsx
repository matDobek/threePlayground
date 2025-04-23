import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Canvas } from '@react-three/fiber'

import './style.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Canvas
      flat
      camera={ {
        fov: 45,
        near: 0.1,
        far: 200,
        position: [1, 2, 6]
      } }
    >
      <App />
    </Canvas>
  </StrictMode>,
)
