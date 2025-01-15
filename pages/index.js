import Head from "next/head";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, useTexture } from "@react-three/drei";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { Suspense } from "react";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { useLoader } from '@react-three/fiber';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function Lights() {
  return (
    <>
      {/* Brighter ambient light */}
      <ambientLight intensity={0.6} />
      
      {/* Brighter key light */}
      <directionalLight
        position={[5, 8, 3]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Stronger fill light */}
      <pointLight position={[-5, 2, -5]} intensity={0.8} color="#ffffff" />
      
      {/* Additional front light for better visibility */}
      <pointLight position={[0, 2, 8]} intensity={0.8} color="#ffffff" />
      
      {/* Softer rim light */}
      <spotLight
        position={[0, 10, -10]}
        intensity={0.4}
        angle={0.6}
        penumbra={1}
        color="#ffffff"
      />
    </>
  );
}

function Wall() {
  return (
    <mesh 
      position={[0, 0, -5]} 
      receiveShadow
    >
      <planeGeometry args={[100, 50]} />
      <meshStandardMaterial 
        color="#f0f0f0"
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  );
}

function Desk() {
  return (
    <mesh 
      position={[0, -6.75, -2]} 
      receiveShadow
      castShadow
    >
      <boxGeometry args={[40, 0.75, 20]} /> {/* width, height, depth */}
      <meshStandardMaterial 
        color="#8B4513"  // A wood-like brown color
        roughness={0.7}
        metalness={0.1}
      />
    </mesh>
  );
}

function MacModel() {
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
      position={[0, -1.4, 0]} // Adjusted to sit on the desk
    />
  );
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Juice</title>
        <meta name="description" content="juice" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div style={{ width: "100vw", height: "100vh" }}>
          <Canvas 
            camera={{ position: [0, 0, 5] }}
            shadows
          >
            <color attach="background" args={['#ffffff']} />
            <Lights />
            <Suspense fallback={null}>
              <Wall />
              <Desk />
              <MacModel />
            </Suspense>
            <OrbitControls 
              minPolarAngle={Math.PI/4}
              maxPolarAngle={Math.PI/1.5}
              enableZoom={true}
              enablePan={true}
            />
          </Canvas>
        </div>
      </main>
    </>
  );
}
