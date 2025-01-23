import { useLoader } from "@react-three/fiber";
import { TextureLoader, LinearFilter, LinearMipmapLinearFilter } from "three";

export default function Book() {
  const coverTexture = useLoader(TextureLoader, "/tomorrow.jpg");
  
  // Enhance texture quality
  coverTexture.minFilter = LinearMipmapLinearFilter;
  coverTexture.magFilter = LinearFilter;
  coverTexture.anisotropy = 16;
  coverTexture.needsUpdate = true;

  return (
    <group position={[10, -6.1, 5]} rotation={[0, -0.5, 0]} scale={0.5}>
      <mesh>
        <boxGeometry args={[4.8, 0.6, 6.3]} />
        <meshStandardMaterial 
          color="#8B4513"
          roughness={1}
          metalness={0}
          emissive="#000000"
          attach="material-0"
        />
        <meshStandardMaterial 
          color="#8B4513"
          roughness={1}
          metalness={0}
          emissive="#000000"
          attach="material-1"
        />
        <meshStandardMaterial 
          map={coverTexture}
          roughness={0.5}
          metalness={0.1}
          emissive="#000000"
          emissiveIntensity={0.1}
          attach="material-2"
        />
        <meshStandardMaterial 
          color="#8B4513"
          roughness={1}
          metalness={0}
          emissive="#000000"
          attach="material-3"
        />
        <meshStandardMaterial 
          color="#8B4513"
          roughness={1}
          metalness={0}
          emissive="#000000"
          attach="material-4"
        />
        <meshStandardMaterial 
          color="#8B4513"
          roughness={1}
          metalness={0}
          emissive="#000000"
          attach="material-5"
        />
      </mesh>
    </group>
  );
} 