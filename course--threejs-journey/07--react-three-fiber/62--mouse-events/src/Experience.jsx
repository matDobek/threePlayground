import { meshBounds, useGLTF, OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function Experience() {

  const cube = useRef()
  const hamburger = useGLTF('./hamburger.glb')

  useFrame((state, delta) => {
    cube.current.rotation.y += delta * 0.2
  })

  const eventHandler = () => {
    cube.current.material.color.set(`hsl(${Math.random() * 360 }, 100%, 75%)`)
  }

  return (
    <>
      <OrbitControls makeDefault />

      <ambientLight intensity={0.5} />
      <directionalLight intensity={2} position={[2, 6, 6]} />

      <mesh
        ref={cube}
        raycast={ meshBounds }
        position-x={-2}
        onClick={ eventHandler }
        onPointerEnter={ () => { document.body.style.cursor = 'pointer' } }
        onPointerLeave={ () => { document.body.style.cursor = 'default' } }
      >
        <boxGeometry />
        <meshStandardMaterial color="ivory"/>
      </mesh>

      <mesh position={[2, 0, 0]} scale={0.5} onClick={ (event) => { event.stopPropagation() } }>
        <sphereGeometry />
        <meshStandardMaterial color="ivory"/>
      </mesh>

      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color="green"/>
      </mesh>

      <primitive
        object={hamburger.scene}
        scale={0.25}
        position-y={0.5}
        onClick={ (event) => {
          console.log(event.object.name)
          event.stopPropagation()
        }}
      />
    </>
  )
}
