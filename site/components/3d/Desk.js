import { useLoader } from "@react-three/fiber";
import { TextureLoader } from 'three';

export default function Desk() {
  const woodTexture = useLoader(TextureLoader, '/models/textures/WoodQuarteredChiffon001_COL_2K - Copy.jpg');
  
  return (
    <mesh 
      position={[0, -6.75, -2]} 
      receiveShadow
      castShadow
    >
      <boxGeometry args={[40, 0.75, 20]} />
      <meshStandardMaterial 
        map={woodTexture}
        roughness={0.01}
        metalness={0.6}
      />
    </mesh>
  );
} 