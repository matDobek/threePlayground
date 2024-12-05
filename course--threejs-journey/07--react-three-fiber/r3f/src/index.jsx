import { createRoot } from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import './index.css'
import { StrictMode } from 'react'
import { Leva } from 'leva'

import Experience from './Components/Basic/Experience.jsx'
// import Experience from './Components/R3F/Experience.jsx'
// import Experience from './Components/Drei/Experience.jsx'
// import Experience from './Components/Debug/Experience.jsx'

const root = createRoot(document.querySelector('#root'))
root.render(
  <StrictMode>
    <Leva collapsed/>

    <Canvas>
      <Experience />
    </Canvas>
  </StrictMode>
)
