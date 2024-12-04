import { createRoot } from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience.jsx'
import './index.css'

const root = createRoot( document.querySelector('#root') )
root.render(
  <Canvas>
    <Experience />
  </Canvas>
)
