import { Clone, OrbitControls, useAnimations, useGLTF, useHelper } from "@react-three/drei";
import { Perf } from "r3f-perf";
import { useLoader, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import Model from "./Model";
import { Suspense, useEffect, useLayoutEffect, useRef } from "react";
import Placeholder from "./Placeholder";
import Hamburger from "./Hamburger";
import * as THREE from "three"
import { useControls } from "leva";

export default function Experience() {
  // const model = useLoader(GLTFLoader, "./hamburger.glb")
  // const model = useLoader(GLTFLoader, "./FlightHelmet/glTF/FlightHelmet.gltf", (loader) => {
  //   const dracoLoader = new DRACOLoader()
  //   dracoLoader.setDecoderPath("./draco/")
  //   loader.setDRACOLoader(dracoLoader)
  // })

  const three = useThree()
  const hamburger = useGLTF("./hamburger-draco.glb")
  const fox = useGLTF("./Fox/glTF/Fox.gltf")

  const lightRef = useRef()
  /*
   * DEBUG SHADOW CAMERA
   *
  const shadowRef = useRef()

  useLayoutEffect(() => {
    if (lightRef.current) {
      shadowRef.current = lightRef.current.shadow.camera
    }
  }, [])

  useHelper(shadowRef, THREE.CameraHelper)
  */

  /*
   * Animations
   */

  const animations = useAnimations(fox.animations, fox.scene)

  const debug = useControls('fox', {
    animation: { options: animations.names }
  })

  useEffect(() => {
    const action = animations.actions[debug.animation]
    action
      .reset()
      .fadeIn(1)
      .play()

    return () => {
      action.fadeOut(1)
    }
  }, [debug.animation])

  useEffect(() => {
    const childrenCastShadow = (parent) => {
      parent.scene.children.forEach((child) => {
        if( !child.isMesh ) {
          return
        }

        child.castShadow = true
      })
    }

    childrenCastShadow(hamburger)
    childrenCastShadow(fox) // TODO stored somewhere else?

    Object.values(fox.nodes).forEach(elem => {
        elem.castShadow = true
    });
  }, [])

  return <>
    <Perf position="top-left" />
    <OrbitControls makeDefault />

    <directionalLight
      ref={lightRef}
      castShadow
      position={[5,5,5]}
      intensity={ 4.5 }
      shadow-normalBias={0.05}
      shadow-camera-near={0.5}
      shadow-camera-far={20}
      shadow-camera-left={-10} // Add a starting value
      shadow-camera-right={10} // Add a starting value
      shadow-camera-top={10}  // Add a starting value
      shadow-camera-bottom={-10}// Add a starting value
    />
    <ambientLight intensity={ 1.5 } />

    <mesh receiveShadow position-y={ -1 } rotation-x={ - Math.PI * 0.5 } scale={ 20 }>
      <planeGeometry />
      <meshStandardMaterial color="greenyellow" />
    </mesh>

    { /*
    <primitive object={model.scene} scale={0.3} />
    */ }

    { /*
    <Suspense fallback={ <Placeholder scale={[2,3,2]} position={[0, 1, 0]} /> }>
      <Model />
    </Suspense>
    */ }

    { /*
    <Clone object={model.scene} scale={0.3} position-x={-4}/>
    <Clone object={model.scene} scale={0.3} position-x={0}/>
    <Clone object={model.scene} scale={0.3} position-x={4}/>
    */ }

    <primitive object={hamburger.scene} scale={0.2} position={[3, 0, 3]} />
    <Hamburger scale={0.2} position={[-3, 0, 3]} />

    <primitive object={fox.scene} scale={0.02} position={[-3, -1, -2]} castShadow />
    { /*
    */ }
  </>
}
