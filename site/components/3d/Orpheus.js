import { useLoader } from "@react-three/fiber";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { MeshStandardMaterial } from "three";
import { Edges } from "@react-three/drei";

export default function Orpheus() {
  const geometry = useLoader(STLLoader, "/models/Orpheus.stl");
  
  const material = new MeshStandardMaterial({ 
    color: "#FFE135",
    roughness: 0.001,
    metalness: 0.4,
    flatShading: true,
    emissive: "#000",
    emissiveIntensity: 0.0000000001,
  });

  return (
    <group position={[-9, -6, -2]} rotation={[-1.5, 0, -2.8]} scale={0.02}>
      <mesh geometry={geometry} material={material} castShadow receiveShadow>
        <Edges
          threshold={100}
          color="black"
          thickness={1}
        />
      </mesh>
      {/* Add a subtle outline for better definition */}
      <mesh geometry={geometry} scale={1.01}>
        <meshBasicMaterial color="black" transparent opacity={0.2} />
      </mesh>
    </group>
  );
} 