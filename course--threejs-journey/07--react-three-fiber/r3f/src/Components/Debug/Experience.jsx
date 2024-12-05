import { OrbitControls } from "@react-three/drei";
import { button, useControls } from "leva";
import { Perf } from "r3f-perf";
import { MeshStandardMaterial } from "three";

export default function DebugExperience() {
  const {perfVisible} = useControls({
    perfVisible: true
  })

  const controls = useControls('sphere', {
    position: {
      value: {x: -2, y: 0},
      min: -5,
      max: 5,
      step: 0.01,
    },
    color: 'hsl(100deg, 100%, 50%)',
    visible: true,
    myInterval: {
      min: 0,
      max: 10,
      value: [4, 5]
    },
    clickMe: button(() => {
      console.log("Hello.")
    }),
    choice: { options: ['a', 'b', 'c'] }
  })

  return <>
    { perfVisible ? <Perf position="top-left" /> : null }
    <OrbitControls makeDefault />

    <directionalLight intensity={10} position={[5, 5, 5]}  />
    <ambientLight intensity={0.7} />

    <mesh position={[controls.position.x, controls.position.y, 0]} visible={controls.visible}>
      <sphereGeometry args={[1, 32, 32]}/>
      <meshStandardMaterial color={controls.color} />
    </mesh>

    <mesh position-x={2}>
      <boxGeometry />
      <meshStandardMaterial color="plum" />
    </mesh>

    <mesh rotation-x={-Math.PI * 0.5} scale={10} position-y={-1}>
      <planeGeometry />
      <meshStandardMaterial color="darkgreen" />

    </mesh>
  </>
}
