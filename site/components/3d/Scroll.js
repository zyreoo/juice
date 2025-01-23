import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

export default function SummitScroll() {
  const scrollTexture = useLoader(TextureLoader, "/scroll.png");

  return (
    <mesh position={[4, 3, -4.5]} rotation={[0, 0, 0]}>
      <planeGeometry args={[2, 2.5]} />
      <meshStandardMaterial 
        map={scrollTexture}
        transparent={true}
      />
    </mesh>
  );
} 