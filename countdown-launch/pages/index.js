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
#define SPIN_EASE .15
#define colour_1 vec4(1.0, 0.0, 0.3, 1.0)  // Pink
#define colour_2 vec4(0.0, 1.0, 0.5, 1.0)  // Green
#define colour_3 vec4(0.3, 0.2, 1.0, 1.0)  // Blue
#define colour_4 vec4(1.0, 0.7, 0.0, 1.0)  // Yellow
#define colour_5 vec4(0.8, 0.0, 1.0, 1.0)  // Purple
#define spin_amount 2.0
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
    float nx = noise(p * 4.0 + time);
    float ny = noise(p * 4.0 - time);
    
    float angle = atan(p.y, p.x) + time;
    float rad = length(p);
    
    vec2 distort = vec2(
        nx * cos(angle) - ny * sin(angle),
        nx * sin(angle) + ny * cos(angle)
    ) * rad * spin_amount;
    
    vec2 flow = vec2(
        noise(p * 5.0 + distort + time),
        noise(p * 5.0 + distort - time)
    );
    
    float pattern = noise(p * 3.0 + flow + time * 0.5) *
                   noise(p * 6.0 - flow - time * 0.3) *
                   noise(p * 10.0 + distort);
    
    pattern = floor(pattern * 12.0) / 12.0;
    
    // Rainbow color mixing
    float colorPhase = time * 0.2;
    vec4 rainbow1 = mix(colour_1, colour_2, (sin(colorPhase) + 1.0) * 0.5);
    vec4 rainbow2 = mix(colour_3, colour_4, (cos(colorPhase + 1.5) + 1.0) * 0.5);
    vec4 rainbow3 = mix(rainbow1, colour_5, (sin(colorPhase * 0.7) + 1.0) * 0.5);
    
    vec4 ret_col = mix(
        rainbow1,
        mix(rainbow2, rainbow3, pattern),
        noise(p * 4.0 + time * 0.2)
    );
    
    float highlight = step(0.65, noise(p * 6.0 + flow));
    ret_col += highlight * 0.3;
    
    ret_col = floor(ret_col * 10.0) / 10.0;
    
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
  const [loginInput, setLoginInput] = useState("");
  const audioRef = useRef(null);
  const playSoundRef = useRef(null);
  const juicyFruits = ["🍎", "🍐", "🍊", "🍋", "🍇", "🫐", "🍑", "🍓", "🍒", "🍍", "🥭", "🍎"];

  // Add this new useEffect at the top with other effects
  useEffect(() => {
    const links = [
      ""
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
        <img style={{border: "1px solid #000", width: 32, height: 32, borderRadius:1}} src="./raccoon.png"/>
        <div style={{marginTop: 12, marginBottom: 12}}>
        <input 
          placeholder="password" 
          value={loginInput}
          onChange={(e) => setLoginInput(e.target.value)}
        /> 
        <button onClick={() => alert("files not found. please insert drive")}>login</button>
        </div>
        <p style={{ color: 'white' }}>{timeLeft}</p>
        <audio ref={audioRef} src="./tick.mp3" />
        <audio ref={playSoundRef} src="./play_sound.mp3" />
      </div>
    </>
  );
}
