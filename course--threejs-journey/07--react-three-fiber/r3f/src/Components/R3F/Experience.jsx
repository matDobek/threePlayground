import { extend, useThree, useFrame } from "@react-three/fiber"
import { useRef } from "react"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import CustomObject from "./CustomObject.jsx"

extend({ OrbitControls })

export default function Experience() {
  const { camera, gl }= useThree()

  const group = useRef()
  const cube = useRef()

  useFrame((state, delta) => {
    // group.current.rotation.y += delta
    cube.current.rotation.y += delta

    // const angle = state.clock.elapsedTime * 0.2
    // camera.position.x = Math.sin(angle) * 8
    // camera.position.z = Math.cos(angle) * 8
    // camera.lookAt(0, 0, 0)
  })

  return <>
    <orbitControls args={ [camera, gl.domElement ] } />

    <directionalLight position={[1,2,3]} intensity={4.5}/>
    <ambientLight intensity={0.75}/>

    <group ref={group} >

      <mesh position={ [-2, 0, 0] } >
        <sphereGeometry args={[1, 32, 32]}/>
        <meshStandardMaterial color="orange" />
      </mesh>

      <mesh ref={cube} rotation-y={Math.PI * 0.25} position={ [2, 0, 0] } >
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
      </mesh>

    </group>

    <mesh rotation-x={ -Math.PI*0.5 } position-y={-1} scale={ 10 } >
      <planeGeometry />
      <meshStandardMaterial color="lightgreen" />
    </mesh>

    <CustomObject />
  </>
}
