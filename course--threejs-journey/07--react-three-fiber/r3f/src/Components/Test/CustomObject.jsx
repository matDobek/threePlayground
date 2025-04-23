import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

export default function CustomObject() {
  const geometry = useRef()
  const verticlesCount = 10 * 3

  const positions = useMemo(() => {
    const positions = new Float32Array(verticlesCount * 3)

    for(let i = 0; i < verticlesCount*3 - 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 3
      positions[i+1] = (Math.random() + 0.0) * 3
      positions[i+2] = (Math.random() - 0.5) * 3
    }

    return positions
  }, [])

  useEffect(() => {
    geometry.current.computeVertexNormals()
  }, [])

  return <mesh>
    <bufferGeometry ref={geometry}>
      <bufferAttribute
        attach="attributes-position"
        count={ verticlesCount }
        itemSize={ 3 }
        array={ positions }
      />
    </bufferGeometry>
    <meshStandardMaterial color="red" side={ THREE.DoubleSide }/>
  </mesh>
}
