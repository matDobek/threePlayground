import { createRoot } from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import './index.css'
import { StrictMode } from 'react'
import { Leva } from 'leva'
// import Experience from './R3FExperience.jsx'
// import Experience from './DreiExperience.jsx'
import Experience from './DebugExperience.jsx'

const root = createRoot(document.querySelector('#root'))
root.render(
  <StrictMode>
    <Leva collapsed/>

    <Canvas>
      <Experience />
    </Canvas>
  </StrictMode>
)
