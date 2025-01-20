import { useLoader } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';

export default function Disk({ onInserted }) {
  const obj = useLoader(OBJLoader, '/models/disk.obj');
  const diskTexture = useTexture('/textures/D.tga.png');
  const meshRef = useRef();
  const outlineRef = useRef();
  const [isClicked, setIsClicked] = useState(false);
  const bootSound = useRef(null);

  const requestFullscreen = () => {
    if (typeof window !== 'undefined') {
      const element = document.documentElement;
      if (element.requestFullscreen) {
        element.requestFullscreen().catch(err => console.log('Fullscreen request failed:', err));
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen().catch(err => console.log('Fullscreen request failed:', err));
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen().catch(err => console.log('Fullscreen request failed:', err));
      }
    }
  };

  useEffect(() => {
    bootSound.current = new Audio('/sounds/bootSound.mp3');
  }, []);

  useEffect(() => {
    if (obj && meshRef.current) {
      meshRef.current.rotation.y = Math.PI / 4;
      
      obj.traverse((child) => {
        if (child.isMesh) {
          const outlineMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffa0,
            transparent: true,
            opacity: 0,
            side: THREE.BackSide
          });

          const outlineMesh = child.clone();
          outlineMesh.material = outlineMaterial;
          outlineMesh.scale.multiplyScalar(1.05);
          
          outlineRef.current = outlineMesh;
          meshRef.current.add(outlineMesh);
        }

        if (child.isMesh) {
          child.material.map = diskTexture;
          child.material.needsUpdate = true;
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, [obj]);

  const handlePointerMove = (event) => {
    if (outlineRef.current && !isClicked) {
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
      
      requestFullscreen();
      
      gsap.timeline()
        .to(meshRef.current.rotation, {
          y: -Math.PI / 2,
          duration: 0.75,
          ease: "power1.out"
        }, 0)
        .to(meshRef.current.position, {
          y: meshRef.current.position.y + 2.75,
          duration: 0.75,
          ease: "power1.out"
        }, 0)
        .to(meshRef.current.position, {
          z: meshRef.current.position.z - 3.2,
          duration: 2.5,
          ease: "power2.out",
          onUpdate: function() {
            if (this.progress() > 0.75 && bootSound.current) {
              bootSound.current.play();
              this.onUpdate = null;
            }
          },
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
        }, 0);
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