import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Lights from "../3d/Lights";
import Wall from "../3d/Wall";
import Desk from "../3d/Desk";
import MacModel from "../3d/MacModel";
import Disk from "../3d/Disk";

export default function ThreeDWorld({ onDiskInserted }) {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas 
        camera={{ 
          position: [0, -1.0, 17.5],
          fov: 70
        }}
        shadows
      >
        <color attach="background" args={['#ffffff']} />
        <Lights />
        <Suspense fallback={null}>
          <Wall />
          <Desk />
          <MacModel />
          <Disk onInserted={onDiskInserted} />
        </Suspense>
      </Canvas>
    </div>
  );
} 