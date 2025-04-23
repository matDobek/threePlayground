import { ContactShadows, Float, Html, OrbitControls, PresentationControls, Sparkles, useGLTF, useHelper } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { Bloom, EffectComposer } from "@react-three/postprocessing"
import { useControls } from "leva"
import { useEffect, useRef, useState } from "react"
// import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper"

function App() {
  const presentationDebug = useControls("Presentaion", {
  })

  const htmlDebug = useControls("HTML", {
    positionX: {
        value: -0.00,
        step: 0.01,
        min: -10,
        max: 10,
    },
    positionY: {
        value: 0,
        step: 0.01,
        min: -10,
        max: 10,
    },
    positionZ: {
        value: 0.15,
        step: 0.01,
        min: -10,
        max: 10,
    },

    rotationX: {
        value: 2.1,
        step: 0.1,
        min: -Math.PI,
        max: Math.PI,
    },
    rotationY: {
        value: Math.PI,
        step: 0.1,
        min: -Math.PI,
        max: Math.PI,
    },
    rotationZ: {
        value: Math.PI,
        step: 0.1,
        min: -Math.PI,
        max: Math.PI,
    }
  })

  const pan = useGLTF("./models/pan.gltf")
  const lid = useGLTF("./models/lid.gltf")
  const panel = useGLTF("./models/panel.gltf")
  const cube = useRef()
  const cube2 = useRef()
  const cube3 = useRef()
  // const light = useRef()
  // useHelper(light, RectAreaLightHelper)

  useFrame((_state, delta) => {
    cube.current.rotation.x += delta * 0.2
    cube.current.rotation.y += delta * 0.2

    cube2.current.rotation.x += delta * 0.2
    cube2.current.rotation.y += delta * 0.2

    cube3.current.rotation.x += delta * 0.2
    cube3.current.rotation.y += delta * 0.2
  })

  return (
    <>
      {/*
      <OrbitControls />
      */}

      <EffectComposer>
        <Bloom
          mipmapBlur
          luminanceThreshold={0}
          intensity={0.1}
        />
      </EffectComposer>

      <color args={ [ '#242424' ] } attach="background" />

      <ambientLight intensity={0.5} />

      {/*
      <spotLight
        castShadow
        intensity={10}
        position={ [5,5,5] }
        decay={ 1.0 }
        shadow-mapSize={ [1024, 1024] }
      />
      */}

      <group>
        <mesh
          receiveShadow
          position-y={ -1 }
          rotation-x={ -Math.PI * 0.5 }
          scale={100}>
          <planeGeometry />
          <meshStandardMaterial color="#242424"/>
        </mesh>

        <Html
          position={[-0.0, -0.90, 2.5]}
          rotation-x={-Math.PI * 0.5}
          rotation-z={Math.PI * 0.15}
          transform
          wrapperClass="htmlFloor"
        >
          <div className="tag"> &lt;h1&gt; </div>
          <div className="text"> hello </div>
          <div className="tag"> &lt;/h1&gt; </div>
        </Html>
      </group>

      <mesh
        ref={cube}
        position={ [3, 0, 4.5] }
        scale={0.5}
      >
        <boxGeometry />
        <meshBasicMaterial color={ [0.4 * 100, 0.19 * 100, 0.27 * 100] }/>
      </mesh>

      <mesh
        ref={cube2}
        position={ [-3, 0, 4.5] }
        scale={0.5}
      >
        <boxGeometry />
        <meshNormalMaterial />
      </mesh>

      <mesh
        ref={cube3}
        position={ [0, 0, 4.5] }
        scale={0.5}
      >
        <boxGeometry />
        <meshStandardMaterial color="plum" />
      </mesh>


      <PresentationControls
        enabled={true} // the controls can be disabled by setting this to false
        global={true} // Spin globally or by dragging the model
        cursor={true} // Whether to toggle cursor style on drag
        snap={true} // Snap-back to center (can also be a spring config)
        speed={1} // Speed factor
        zoom={1} // Zoom factor when half the polar-max is reached
        rotation={[0, 0, 0]} // Default rotation
        polar={[-Math.PI * 0.05, Math.PI * 0.05]} // Vertical limits
        azimuth={[-Math.PI * 0.10, Math.PI * 0.10]} // Horizontal limits
        config={{ mass: 1, tension: 170, friction: 26 }} // Spring config
      >
        <Float rotationIntensity={ 0.3 }>
          <rectAreaLight
            intensity={10}
            position={ [0, 2.7, 3.1] }
            rotation={ [Math.PI * 0.9, Math.PI, 0] }
            width={ 2.2 }
            height={ 2.2 }
          />

          <primitive
            object={ panel.scene }
            position={ [0, 2.5, 3] }
            rotation-x={ Math.PI * 0.25 }
            scale={1}
          >
            <Html
              transform
              wrapperClass="htmlScreen"
              distanceFactor={ 1.2 }
              rotation={ [
                htmlDebug.rotationX,
                htmlDebug.rotationY,
                htmlDebug.rotationZ,
              ] }
              position={[
                htmlDebug.positionX,
                htmlDebug.positionY,
                htmlDebug.positionZ,
              ]}
            >
              <iframe src="./site.html" />
            </Html>
          </primitive>
        </Float>
      </PresentationControls>

    </>
  )
}

export default App
