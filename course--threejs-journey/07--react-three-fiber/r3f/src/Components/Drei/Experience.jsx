import { Html, MeshReflectorMaterial, MeshRefractionMaterial, OrbitControls, PivotControls, TransformControls } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import { useRef } from "react"
import { Vector3 } from "three"

export default function DreiExperience() {
  const {camera} = useThree()
  camera.position.set(5, 5, 7)
  camera.lookAt(new Vector3(0, 0, 0))

  const cube = useRef()
  const sphere = useRef()

  return <>
    <OrbitControls makeDefault/>
    <directionalLight intensity={10} position={ [5, 5, 5] } />
    <ambientLight intensity={0.7} />

    <group>
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
      <TransformControls object={cube} mode="scale" />

      <PivotControls
        anchor={[0,1,0]}
        depthTest={false}
        lineWidth={ 4 }
        axisColors={ [ '#9381ff', '#ff4d6d', '#7ae582' ] }
        scale={ 100 }
        fixed={ true }
      >
        <mesh ref={sphere} position-x={-2}>
          <sphereGeometry />
          <meshStandardMaterial color="thistle" />

          <Html
            position={[1, 1, 1]}
            wrapperClass="label"
            center
            distanceFactor={ 8 }
            occlude={[sphere, cube]}
          > This is a sphere </Html>
        </mesh>
      </PivotControls>

    </group>
  </>
}
