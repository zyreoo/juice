import Head from "next/head";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, useTexture } from "@react-three/drei";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { Suspense, useState, useRef, useEffect } from "react";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { useLoader, useFrame } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import gsap from 'gsap';
import * as THREE from 'three';

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

function Disk({ onInserted }) {
  const obj = useLoader(OBJLoader, '/models/disk.obj');
  const diskTexture = useTexture('/textures/D.tga.png');
  const meshRef = useRef();
  const outlineRef = useRef();
  const [isClicked, setIsClicked] = useState(false);

  // Create outline geometry from the original geometry
  useEffect(() => {
    if (obj && meshRef.current) {
      // Set initial rotation
      meshRef.current.rotation.y = Math.PI / 4;
      
      obj.traverse((child) => {
        if (child.isMesh) {
          // Create outline mesh with yellow color
          const outlineMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffa0,  // Subtle yellow color
            transparent: true,
            opacity: 0,
            side: THREE.BackSide
          });

          const outlineMesh = child.clone();
          outlineMesh.material = outlineMaterial;
          // Scale slightly larger to create outline effect
          outlineMesh.scale.multiplyScalar(1.05);
          
          outlineRef.current = outlineMesh;
          meshRef.current.add(outlineMesh);
        }

        // Original material setup
        if (child.isMesh) {
          child.material.map = diskTexture;
          child.material.needsUpdate = true;
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, [obj]);

  // Update outline based on cursor position
  const handlePointerMove = (event) => {
    if (outlineRef.current && !isClicked) {  // Only update when not animating
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;

      const distance = Math.sqrt(
        Math.pow(x - (meshRef.current.position.x / 10), 2) + 
        Math.pow(y - (meshRef.current.position.y / 10), 2)
      );

      const intensity = Math.max(0, 1 - distance);
      outlineRef.current.material.opacity = intensity * 0.8;
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', handlePointerMove);
    return () => window.removeEventListener('mousemove', handlePointerMove);
  }, [isClicked]);

  const handleClick = () => {
    if (!isClicked && meshRef.current) {
      setIsClicked(true);
      if (outlineRef.current) {
        outlineRef.current.material.opacity = 0.8;
      }
      
      const targetRotation = -Math.PI / 2;
      
      gsap.to(meshRef.current.rotation, {
        y: targetRotation,
        duration: 0.75,
        ease: "none",
        onComplete: () => {
          gsap.to(meshRef.current.position, {
            y: meshRef.current.position.y + 2.75,
            duration: 0.5,
            ease: "none",
            onComplete: () => {
              gsap.to(meshRef.current.position, {
                z: meshRef.current.position.z - 3.2,
                duration: 2.0,
                ease: "power1.out",
                onComplete: () => {
                  setIsClicked(false);
                  onInserted();
                  
                  if (meshRef.current) {
                    gsap.to(meshRef.current.material, {
                      opacity: 0,
                      duration: 0.3
                    });
                  }
                  if (outlineRef.current) {
                    outlineRef.current.material.opacity = 0;
                  }
                }
              });
            }
          });
        }
      });
    }
  };

  return (
    <primitive 
      ref={meshRef}
      object={obj} 
      scale={0.5}
      position={[1, -6.3, 6]}
      onClick={handleClick}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
      }}
    />
  );
}

export default function Home() {
  const [isInserted, setIsInserted] = useState(false);

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
          {!isInserted ? (
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
                <Disk onInserted={() => setIsInserted(true)} />
              </Suspense>
            </Canvas>
          ) : (
            <p>Hello World</p>
          )}
        </div>
      </main>
    </>
  );
}
