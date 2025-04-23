import { OrbitControls } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useRef } from "react"

import CustomObject from "./CustomObject.jsx"

export default function Test() {
  const a = useRef()
  const b = useRef()

  useFrame((state, delta) => {
    a.current.rotation.x += delta * 1
    b.current.rotation.x += delta * 0.5
  })

  return <>
    <OrbitControls makeDefault />

    <directionalLight intensity={4} position={[5,5,5]}/>
    <ambientLight intensity={1.5} />

    <group>
      <mesh
        ref={a}
        position={ [-4, 1, 0] }
        rotation={ [Math.PI/4, 0, 0] }
      >
        <boxGeometry />
        <meshBasicMaterial
          color="orange"
        />
      </mesh>

      <mesh
        ref={b}
        position-x={4}
        position-y={1}
        rotation-x={Math.PI/4}
      >
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
      </mesh>
    </group>

    <mesh rotation-x={-Math.PI/4}>
      <planeGeometry args={[10, 10]}/>
      <meshStandardMaterial
        roughness={0.5}
        metalness={0.5}
        color="#7FFF00"
      />
    </mesh>

    <CustomObject />
  </>
}
