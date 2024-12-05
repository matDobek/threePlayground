import { MeshReflectorMaterial, OrbitControls } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import { Vector3 } from "three"
import { Perf } from "r3f-perf";
import { useRef } from "react";

export default function DreiExperience() {
  const {camera} = useThree()
  camera.position.set(5, 5, 7)
  camera.lookAt(new Vector3(0, 0, 0))

  const cube = useRef()
  const sphere = useRef()

  useFrame((state, delta) => {
    cube.current.rotation.y += delta * 0.2
  })

  return <>
    <Perf position="top-left" />

    <OrbitControls makeDefault />
    <directionalLight intensity={10} position={ [5, 5, 5] } />
    <ambientLight intensity={0.7} />

    <mesh position-y={-1} rotation-x={ -Math.PI * 0.5 } scale={ 10 }>
      <planeGeometry />
      <MeshReflectorMaterial
        resolution={512}
        blur={[1000, 1000]}
        mixBlur={ 0.5 }
        mirror={0.7}
        color="greenyellow"
      />
    </mesh>

    <mesh ref={cube} position-x={2}>
      <boxGeometry />
      <meshStandardMaterial color="plum" />
    </mesh>

    <mesh ref={sphere} position-x={-2}>
      <sphereGeometry />
      <meshStandardMaterial color="thistle" />
    </mesh>
  </>
}
