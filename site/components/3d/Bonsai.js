import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { TextureLoader } from "three";
import { MeshStandardMaterial } from "three";

export default function Bonsai() {
  const bonsaiModel = useLoader(OBJLoader, "/models/Bonsai.obj");
  const bonsaiTexture = useLoader(TextureLoader, "/textures/Zanthoxylum-Texture-8k.jpg");
  
  const material = new MeshStandardMaterial({
    map: bonsaiTexture,
    roughness: 0.8,
    metalness: 0.1,
  });

  // Apply material to all meshes in the model
  bonsaiModel.traverse((child) => {
    if (child.isMesh) {
      child.material = material;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return (
    <group position={[-14, -6.0, -2]} rotation={[0, -0.4, 0]} scale={0.22}>
      <primitive object={bonsaiModel} />
    </group>
  );
} 