import { useHelper, MeshReflectorMaterial, OrbitControls, BakeShadows, SoftShadows, AccumulativeShadows, RandomizedLight, ContactShadows } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import { button, useControls } from "leva";
import { Perf } from "r3f-perf";
import { useEffect, useRef } from "react";
import * as THREE from 'three';

export default function DreiExperience() {
  //
  // DEBUG
  //

  const contactShadows = useControls('contact shadows', {
    color: '#1d8f75',
    opacity: { value: 0.4, min: 0, max: 1 },
    blur: { value: 2.8, min: 0, max: 10 },
    // visible: true,
    // myInterval: {
    //   min: 0,
    //   max: 10,
    //   value: [4, 5]
    // },
    // clickMe: button(() => {
    //   console.log("Hello.")
    // }),
    // choice: { options: ['a', 'b', 'c'] }
  })


  //
  //
  //

  // const {camera} = useThree()
  // camera.position.set(5, 5, 7)
  // camera.lookAt(new THREE.Vector3(0, 0, 0))

  const {scene} = useThree()

  const directionalLight = useRef()
  const cube = useRef()
  const sphere = useRef()

  // useHelper(directionalLight, THREE.DirectionalLightHelper, 1)

  useEffect(() => {
    // const cam = new THREE.CameraHelper(directionalLight.current.shadow.camera)
    // scene.add(cam)
  }, [])

  useFrame((state, delta) => {
    cube.current.rotation.y += delta * 0.2
    cube.current.position.x = 2 + Math.sin(state.clock.elapsedTime)
  })

  return <>
    { /* <color attach="background" args={ ['ivory'] } /> */ }

    { /* <BakeShadows /> */ }

    { /* <SoftShadows size={ 80 } samples={ 15 } focus={ 0 } /> */ }

    { /*
    <AccumulativeShadows
      position-y={-0.99}
      scale={ 10 }
      color="#316d39"
      opacity={ 0.8 }
      frames={ Infinity }
      temporal
      blend={ 100 }
    >
      <RandomizedLight
        amount={ 8 }
        radius={ 1 }
        ambient={ 0.5 }
        intensity={ 1 }
        position={ [ 5, 5, 5 ] }
        bias={ 0.001 }
      />
    </AccumulativeShadows>
    */ }

    { /*
    */ }
    <ContactShadows
      position-y={ -0.99 }
      scale={10}
      resolution={ 512 }
      far={5}
      color={ contactShadows.color }
      opacity={ contactShadows.opacity }
      blur={ contactShadows.blur }
      frames={ Infinity } // or 1 for baked
    />

    <Perf position="top-left" />

    <OrbitControls makeDefault />
    <directionalLight
      ref={directionalLight}
      intensity={1.5}
      position={ [5, 5, 5] }
      castShadow
      shadow-mapSize={[1024, 1024]}
      shadow-camera-near={ 1 }
      shadow-camera-far={ 20 }
      shadow-camera-top={ 5 }
      shadow-camera-right={ 5 }
      shadow-camera-bottom={ -5 }
      shadow-camera-left={ -5 }
    />
    <ambientLight intensity={0.2} />

    <mesh position-y={-1} rotation-x={ -Math.PI * 0.5 } scale={ 10 }>
      <planeGeometry />
      <MeshReflectorMaterial
        resolution={512}
        blur={[1000, 1000]}
        mixBlur={ 0.5 }
        mirror={0.7}
        color="greenyellow"
        side={ THREE.DoubleSide }
      />
    </mesh>

    <mesh ref={cube} castShadow position-x={2}>
      <boxGeometry />
      <meshStandardMaterial color="plum" />
    </mesh>

    <mesh ref={sphere} castShadow position-x={-2}>
      <sphereGeometry />
      <meshStandardMaterial color="thistle" />
    </mesh>
  </>
}
