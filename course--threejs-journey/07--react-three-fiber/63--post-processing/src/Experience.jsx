import { OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Noise, EffectComposer, Glitch, ToneMapping, Vignette, Bloom, DepthOfField } from "@react-three/postprocessing";
import { useControls } from "leva";
import { BlendFunction, GlitchMode, ToneMappingMode } from "postprocessing";
import { Perf } from "r3f-perf";
import { useRef } from "react";
import Drunk from "./Drunk";

export default function Experience() {
  const cube = useRef()

  useFrame((_state, delta) => {
    cube.current.rotation.y += delta * 0.2
  })

  const {perfVisible} = useControls({
    perfVisible: true
  })

  const vignetteDebug = useControls('vignette', {
    active: false,
    offset: { min: 0, max: 1, value: 0.3 },
    darkness: { min: 0, max: 1, value: 0.9 },
    blendFunction: { options: BlendFunction, value: BlendFunction.NORMAL }
  })

  const glitchDebug = useControls('glitch', {
    active: false,
    delay: { min: 0, max: 1, value: [0.5, 1] },
    duration: { min: 0, max: 1, value: [0.1, 0.3] },
    strength: { min: 0, max: 1, value: [0.2, 0.4] },
    mode: { options: GlitchMode }
  })

  const noiseDebug = useControls('noise', {
    active: false,
    premultiply: true,
    blendFunction: { options: BlendFunction, value: BlendFunction.SOFT_LIGHT }
  })

  const bloomDebug = useControls('bloom', {
    active: false,
    luminanceThreshold: { min: 0, max: 10, value: 0 },
    intensity: { min: 0, max: 10, value: 0.1 },
    mipmapBlur: true,
  })

  const deptOfFieldDebug = useControls('depth of field', {
    active: false,
    focusDistance: { min: 0, max: 1, value: 0.025 },
    focalLength: { min: 0, max: 1, value: 0.025 },
    bokehScale: { min: 0, max: 30, value: 6 },
  })

  const VignetteDev = ({opts}) => {
    if( !opts.active ) {
      return null
    }

    return <Vignette
      offset={ opts.offset }
      darkness={ opts.darkness }
      blendFunction={ opts.blendFunction }
    />
  }

  const GlitchDev = ({opts}) => {
    if( !opts.active ) {
      return null
    }

    return <Glitch
      delay={ opts.delay }
      duration={ opts.duration }
      strength={ opts.strength }
      mode={ opts.mode }
    />
  }

  const NoiseDev = ({opts}) => {
    if( !opts.active ) {
      return null
    }

    return <Noise
      premultiply={ opts.premultiply }
      blendFunction={ opts.blendFunction }
    />
  }

  const BloomDev = ({opts}) => {
    if( !opts.active ) {
      return null
    }

    return <Bloom
      luminanceThreshold={opts.luminanceThreshold}
      intensity={opts.intensity}
      mipmapBlur={opts.mipmapBlur}
    />
  }

  const DepthOfFieldDev = ({opts}) => {
    if( !opts.active ) {
      return null
    }

    return <DepthOfField
      focusDistance={ opts.focusDistance }
      focalLength={ opts.focalLength }
      bokehScale={ opts.bokehScale }
    />
  }

  const drunkRef = useRef()

  return (
    <>

      <color args={['#2e2e2e']} attach="background" />

      <EffectComposer>
        <VignetteDev opts={vignetteDebug} />
        <GlitchDev opts={glitchDebug} />
        <NoiseDev opts={noiseDebug} />
        <BloomDev opts={bloomDebug} />
        <DepthOfFieldDev opts={deptOfFieldDebug} />

        <Drunk
          ref={ drunkRef }
          frequency={ 5 }
          amplitude={ 0.1 }
          blendFunction={ BlendFunction.NORMAL }
        />

        <ToneMapping mode={ ToneMappingMode.ACES_FILMIC } />
      </EffectComposer>

      { perfVisible ? <Perf position="top-left" /> : null }
      <OrbitControls makeDefault />

      <ambientLight intensity={0.5} />
      <directionalLight intensity={2.0} position={[4, 6, 6]}/>

      <mesh ref={cube} position-y={0} scale={1}>
        <boxGeometry />
        {/*
        // required for BLOOM effect
        <meshStandardMaterial color={ [1.5, 0.4, 20] } />
        <meshStandardMaterial color="plum" emissive="plum" emissiveIntensity={10} toneMapped={false} />
        <meshBasicMaterial color={ [0.08 * 20, 0.02 * 20, 1 * 20] } toneMapped={false} />
        */}
        <meshStandardMaterial color="plum" />
      </mesh>

      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color="#A0DEA0" />
      </mesh>
    </>
  )
}
