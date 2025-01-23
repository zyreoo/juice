import { useLoader } from "@react-three/fiber";
import { TextureLoader } from 'three';

export default function Wall() {
  const brickTexture = useLoader(TextureLoader, '/wall.jpeg');
  
  // Repeat the texture to cover the wall
  brickTexture.wrapS = brickTexture.wrapT = 1000;
  brickTexture.repeat.set(1.5, 1.5); // Adjust these values to scale the texture

  return (
    <mesh 
      position={[0, 0, -5]} 
      receiveShadow
    >
      <planeGeometry args={[100, 50]} />
      <meshStandardMaterial 
        map={brickTexture}
        roughness={1.0}
        metalness={0.45}
      />
    </mesh>
  );
} 