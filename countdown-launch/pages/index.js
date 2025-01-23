import Head from "next/head";
import Image from "next/image";
import { useState, useEffect, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform float iTime;
uniform vec2 iResolution;

#define PIXEL_SIZE_FAC 400.0
#define SPIN_EASE .1
#define colour_2 vec4(1.0, 0.2, 0.0, 1.0)
#define colour_1 vec4(1.0, 0.7, 0.0, 1.0)
#define colour_3 vec4(0.9, 0.1, 0.0, 1.0)
#define spin_amount 1.5
#define contrast 0.9

float rand(vec2 n) { 
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p) {
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u*u*(3.0-2.0*u);
    
    float res = mix(
        mix(rand(ip), rand(ip+vec2(1.0,0.0)), u.x),
        mix(rand(ip+vec2(0.0,1.0)), rand(ip+vec2(1.0,1.0)), u.x), u.y);
    return res*res;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    float pixel_size = length(iResolution.xy) / PIXEL_SIZE_FAC;
    vec2 uv = (floor(fragCoord.xy * (1.0 / pixel_size)) * pixel_size - 0.5 * iResolution.xy) / length(iResolution.xy);
    
    float time = iTime * SPIN_EASE * 2.0;
    vec2 p = uv;
    float nx = noise(p * 3.0 + time);
    float ny = noise(p * 3.0 - time);
    
    float angle = atan(p.y, p.x) + time;
    float rad = length(p);
    
    vec2 distort = vec2(
        nx * cos(angle) - ny * sin(angle),
        nx * sin(angle) + ny * cos(angle)
    ) * rad * spin_amount;
    
    vec2 flow = vec2(
        noise(p * 4.0 + distort + time),
        noise(p * 4.0 + distort - time)
    );
    
    float pattern = noise(p * 2.0 + flow + time * 0.4) *
                   noise(p * 4.0 - flow - time * 0.2) *
                   noise(p * 8.0 + distort);
    
    pattern = floor(pattern * 8.0) / 8.0;
    
    vec4 ret_col = mix(
        colour_1,
        mix(colour_2, colour_3, pattern),
        noise(p * 3.0 + time * 0.1)
    );
    
    float highlight = step(0.7, noise(p * 5.0 + flow));
    ret_col += highlight * 0.2;
    
    ret_col = floor(ret_col * 8.0) / 8.0;
    
    fragColor = ret_col;
}

varying vec2 vUv;

void main() {
    mainImage(gl_FragColor, vUv * iResolution);
}
`;

function JuiceShader() {
    const mesh = useRef();
    const { size, viewport } = useThree();
    
    // Calculate scaling factors to cover viewport
    const scale = useMemo(() => {
        const aspectRatio = size.width / size.height;
        return [Math.max(aspectRatio, 1.0) * 2, Math.max(1.0 / aspectRatio, 1.0) * 2, 1];
    }, [size]);

    const uniforms = useMemo(
        () => ({
            iTime: { value: 0 },
            iResolution: { value: new THREE.Vector2(size.width, size.height) }
        }),
        [size]
    );

    useEffect(() => {
        if (mesh.current) {
            mesh.current.material.uniforms.iResolution.value.set(size.width, size.height);
        }
    }, [size]);

    useFrame((state) => {
        const { clock } = state;
        if (mesh.current) {
            mesh.current.material.uniforms.iTime.value = clock.getElapsedTime();
        }
    });

    return (
        <mesh ref={mesh} scale={scale}>
            <planeGeometry args={[1, 1]} />
            <shaderMaterial
                fragmentShader={fragmentShader}
                vertexShader={vertexShader}
                uniforms={uniforms}
                transparent={true}
                depthWrite={false}
                depthTest={false}
            />
        </mesh>
    );
}

export default function Home() {
  const [currentFruit, setCurrentFruit] = useState("🧃");
  const [faviconHref, setFaviconHref] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const playSoundRef = useRef(null);
  const juicyFruits = ["🍎", "🍐", "🍊", "🍋", "🍇", "🫐", "🍑", "🍓", "🍒", "🍍", "🥭", "🍎"];

  // Add this new useEffect at the top with other effects
  useEffect(() => {
    const links = [
      "https://youtu.be/Fy0aCDmgnxg?feature=shared",
      "https://www.youtube.com/watch?v=ufMUJ9D1fi8",
      "https://www.youtube.com/shorts/Ns-bX2KbBRg",
      "https://youtu.be/2sLou4kva1s?feature=shared",
      "https://www.youtube.com/watch?v=m5GH9xyneTg",
      "https://quarter--mile.com/Unconventional-Adventures",
      "https://youtu.be/Hv9TyB9jvpM?feature=shared"
    ];
    
    const randomLink = links[Math.floor(Math.random() * links.length)];
    console.log(randomLink);
  }, []); // Empty dependency array means this runs once on mount

  // Countdown timer effect
  useEffect(() => {
    const targetDate = new Date('2025-01-24T19:30:00-05:00'); // 7:30 PM EST on Jan 24 2025

    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft("IT'S TIME");
        clearInterval(timer);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      
      // Play tick sound if isPlaying is true
      if (isPlaying && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying]);

  useEffect(() => {
    // Create favicon from emoji
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    ctx.font = '28px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(currentFruit, 16, 16);
    setFaviconHref(canvas.toDataURL());
  }, [currentFruit]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFruit(prevFruit => {
        const currentIndex = juicyFruits.indexOf(prevFruit);
        return juicyFruits[(currentIndex + 1) % juicyFruits.length];
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    setIsPlaying(true);
    if (playSoundRef.current) {
      playSoundRef.current.currentTime = 0;
      playSoundRef.current.play();
    }
  };

  return (
    <>
      <Head>
        <title>{currentFruit.repeat(14)}</title>
        <meta name="description" content="erofeb deneppah reven sah siht" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={faviconHref} />
      </Head>
      <div style={{ 
        position: 'fixed', 
        top: 0,
        left: 0,
        width: '100vw', 
        height: '100vh',
        overflow: 'hidden'
      }}>
        <Canvas
          style={{ width: '100%', height: '100%' }}
          camera={{ position: [0, 0, 1] }}
        >
          <JuiceShader />
        </Canvas>
      </div>
      <div 
        onClick={handleClick} 
        style={{
          position: 'relative',
          display: "flex", 
          cursor: "pointer", 
          alignItems: "center", 
          justifyContent: "center", 
          width: "100%", 
          height: "100vh", 
          flexDirection: "column",
          zIndex: 1
        }}
      >
        <p style={{fontSize: 8}}>
          <a 
            href="https://support.google.com/chrome/answer/95314#:~:text=Choose%20your%20homepage" 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
          >
            make this home
          </a>
        </p>
        <p style={{ color: 'white' }}>{timeLeft}</p>
        <audio ref={audioRef} src="./tick.mp3" />
        <audio ref={playSoundRef} src="./play_sound.mp3" />
      </div>
    </>
  );
}
