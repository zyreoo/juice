import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

export default function SummitScroll() {
  const scrollTexture = useLoader(TextureLoader, "/scroll.png");
  const woodTexture = useLoader(TextureLoader, "/models/textures/wood.jpg");

  return (
    <group position={[26.5, 3, -4.5]} rotation={[0, 0, 0]}>
      {/* Main scroll paper */}
      <mesh>
        <planeGeometry args={[6, 7.5]} />
        <meshStandardMaterial 
          map={scrollTexture}
          transparent={true}
          roughness={0.1}
          metalness={0.35}
        />
      </mesh>


      {/* Top cylinder */}
      <mesh position={[0, 3.85, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 6, 32]} />
        <meshStandardMaterial 
          map={woodTexture}
          color="#9b4e32"
          colorWrite={true}
        />
      </mesh>

      {/* Bottom cylinder */}
      <mesh position={[0, -3.85, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 6, 32]} />
        <meshStandardMaterial 
          map={woodTexture}
          color="#9b4e32"
          colorWrite={true}
        />
      </mesh>
    </group>
  );
} 