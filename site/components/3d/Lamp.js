import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MeshStandardMaterial } from "three";

export default function Lamp() {
  const lampModel = useLoader(OBJLoader, "/models/desk_lamp1.obj");
  
  const material = new MeshStandardMaterial({
    color: "#666666",
    roughness: 0.7,
    metalness: 0.4,
  });

  // Apply material to all meshes in the model
  lampModel.traverse((child) => {
    if (child.isMesh) {
      child.material = material;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return (
    <group position={[13, -7.0, 0]} rotation={[0, -1, 0]} scale={2.5}>
      <primitive object={lampModel} />
    </group>
  );
} 