export default function Placeholder({scale = [1,1,1], position = [0, 0, 0]}) {
  return <>
    <mesh scale={scale} position={position}>
      <boxGeometry args={[1,1,1,2,2,2]} />
      <meshBasicMaterial wireframe color="red" />
    </mesh>
  </>
}
