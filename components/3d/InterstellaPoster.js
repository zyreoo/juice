import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

export default function InterstellaPoster() {
  const posterTexture = useLoader(TextureLoader, "/InterstellaPoster.jpeg");

  return (
    <group position={[15.5, 3, -4.5]} rotation={[0, 0, 0.05]}>
      <mesh>
        <planeGeometry args={[7, 9.0]} />
        <meshStandardMaterial 
          map={posterTexture}
          transparent={true}
          roughness={0.01}
          metalness={0.55}
        />
      </mesh>
    </group>
  );
} 