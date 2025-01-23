import { useLoader } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

export default function MacModel() {
  const fbx = useLoader(FBXLoader, '/models/mac_classic.fbx');
  const colorTexture = useTexture('/textures/Mac.TriSurface_Color.png');

  fbx.traverse((child) => {
    if (child.isMesh) {
      child.material.map = colorTexture;
      child.material.needsUpdate = true;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return (
    <primitive 
      object={fbx} 
      scale={0.01}
      position={[0, -1.4, 0]}
    />
  );
} 