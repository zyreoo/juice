import { useGLTF } from "@react-three/drei";

export default function Sprig() {
  const { nodes, materials } = useGLTF("/models/sprig.glb");
  
  return (
    <group position={[5, -6.0, -4]} rotation={[-0.0, -1.0, 0.0]} scale={0.5}>
      <primitive object={nodes.Scene} />
    </group>
  );
}

useGLTF.preload("/models/sprig.glb"); 