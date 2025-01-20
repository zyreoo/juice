import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { TextureLoader, MeshStandardMaterial } from "three";
import { useEffect } from "react";

export default function Cup() {
  const obj = useLoader(OBJLoader, "/Cup.obj");
  const texture = useLoader(TextureLoader, "/Cup.png");

  useEffect(() => {
    obj.traverse((child) => {
      if (child.isMesh) {
        child.material = new MeshStandardMaterial({
          map: texture,
          roughness: 0.2,
          metalness: 0.1,
          envMapIntensity: 0.5
        });
      }
    });
  }, [obj, texture]);

  return (
    <primitive 
      object={obj} 
      position={[14, -6.2, -3]} 
      scale={[0.17, 0.17, 0.17]}
      rotation={[0, Math.PI / 6, 0]}
    />
  );
} 