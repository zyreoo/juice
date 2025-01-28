import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Common functions used across shaders
const commonShaderFunctions = `
float ln(vec2 p, vec2 a, vec2 b) {
    return length(p-a-(b-a)*clamp(dot(p-a,b-a)/dot(b-a,b-a),0.,1.));
}

vec4 hash42(vec2 p) {
    vec4 p4 = fract(vec4(p.xyxy) * vec4(.1031, .1030, .0973, .1099));
    p4 += dot(p4, p4.wzxy+33.33);
    return fract((p4.xxyz+p4.yzzw)*p4.zywx);
}
`

const vertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

// Buffer A - Main fluid simulation
const bufferAShader = `
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
uniform sampler2D iChannel2;
uniform sampler2D iChannel3;

${commonShaderFunctions}

void X(inout vec4 Q, vec2 U, vec2 r) {
    vec4 n = texture2D(iChannel0, (U+r)/iResolution.xy);
    if (ln(U,n.xy,n.zw) < ln(U,Q.xy,Q.zw)) Q = n;
}

void mainImage(out vec4 Q, in vec2 U) {
    Q = texture2D(iChannel0, U/iResolution.xy);
    
    for (int x = -1; x <= 1; x++)
    for (int y = -1; y <= 1; y++)
        X(Q, U, vec2(x,y));
    
    vec4 c = texture2D(iChannel2, Q.xy/iResolution.xy);
    Q.xy = mix(Q.xy, texture2D(iChannel0, Q.xy/iResolution.xy).xy, 0.05 + 0.05*sin(c.x));
    Q.zw = mix(Q.zw, texture2D(iChannel0, Q.zw/iResolution.xy).zw, 0.9);
    
    Q.xy += texture2D(iChannel3, Q.xy/iResolution.xy).xy;
    Q.zw += texture2D(iChannel3, Q.zw/iResolution.xy).xy;
    
    float len = length(Q.xy-Q.zw);
    if (len > 4.0 + 2.0*sin(c.w)) {
        vec2 m = 0.5*(Q.xy+Q.zw);
        if (length(U-Q.xy) > length(U-Q.zw)) 
            Q.xy = m;
        else Q.zw = m;
    }
    
    if (iMouse.z > 0.0) {
        vec4 n = texture2D(iChannel1, vec2(0));
        if (ln(U,n.xy,n.zw) < ln(U,Q.xy,Q.zw)) Q = n;
    }
    
    if (iTime < 0.1) {
        Q.xy = U;
        Q.zw = 0.5*iResolution.xy;
    }
}

varying vec2 vUv;
void main() {
    mainImage(gl_FragColor, vUv * iResolution.xy);
}
`

// Buffer B - Mouse interaction
const bufferBShader = `
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
uniform sampler2D iChannel0;

void mainImage(out vec4 Q, in vec2 U) {
    vec4 p = texture2D(iChannel0, U/iResolution.xy);
    if (iMouse.z > 0.0) {
        if (p.z > 0.0) Q = vec4(iMouse.xy, p.xy);
        else Q = vec4(iMouse.xy, iMouse.xy);
    }
    else Q = vec4(-iResolution.xy, -iResolution.xy);
}

varying vec2 vUv;
void main() {
    mainImage(gl_FragColor, vUv * iResolution.xy);
}
`

// Buffer C - Color and pattern generation
const bufferCShader = `
uniform float iTime;
uniform vec2 iResolution;
uniform sampler2D iChannel0;

${commonShaderFunctions}

void X(inout vec4 Q, vec2 U, vec2 r) {
    vec4 n = texture2D(iChannel0, (U+r)/iResolution.xy);
    if (ln(U,n.xy,n.zw) < ln(U,Q.xy,Q.zw)) Q = n;
}

void mainImage(out vec4 Q, in vec2 U) {
    Q = texture2D(iChannel0, U/iResolution.xy);
    
    if (length(Q.xy-Q.zw) > 2.5) {
        vec2 m = 0.5*(Q.xy+Q.zw);
        if (length(U-Q.xy) > length(U-Q.zw)) 
            Q.xy = m;
        else Q.zw = m;
    }
    
    Q = vec4(
        texture2D(iChannel0, Q.xy/iResolution.xy).xy,
        texture2D(iChannel0, Q.zw/iResolution.xy).zw
    );
    
    if (iTime < 0.1) {
        Q = hash42(U+vec2(iTime*1000.0))*6.3;
    }
}

varying vec2 vUv;
void main() {
    mainImage(gl_FragColor, vUv * iResolution.xy);
}
`

// Final Image shader
const fragmentShader = `
uniform float iTime;
uniform vec2 iResolution;
uniform float selectedRank;

#define PI 3.14159265359
#define PIXEL_SIZE_FAC 50.0
#define COLOR_LEVELS 4.0

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

vec2 rotate2D(vec2 p, float a) {
    float s = sin(a);
    float c = cos(a);
    return vec2(p.x * c - p.y * s, p.x * s + p.y * c);
}

float ripple(vec2 p, float time) {
    float dist = length(p);
    float wave = sin(dist * 10.0 - time * 2.0) * 0.5 + 0.5;
    wave *= exp(-dist * 2.0);
    return wave;
}

float swirl(vec2 p, float time) {
    float angle = atan(p.y, p.x);
    float dist = length(p);
    float wave = sin(angle * 5.0 + dist * 8.0 - time * 3.0) * 0.5 + 0.5;
    wave *= exp(-dist * 3.0);
    return wave;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    float pixel_size = length(iResolution.xy) / PIXEL_SIZE_FAC;
    vec2 uv = (floor(fragCoord.xy * (1.0 / pixel_size)) * pixel_size - 0.5 * iResolution.xy) / min(iResolution.x, iResolution.y);
    
    float time = iTime * 0.5;
    vec2 p = uv;
    
    float pattern;
    vec3 color1, color2, color3;
    
    if (selectedRank == 1.0) {
        // Green ripple pattern for rank 1
        p = rotate2D(p, time * 0.1);
        float ripples = 0.0;
        for(int i = 0; i < 3; i++) {
            float t = time + float(i) * PI * 0.5;
            ripples += ripple(p, t) * (0.5 / float(i + 1));
            p = rotate2D(p, PI * 0.25);
        }
        pattern = ripples;
        
        // Green color palette
        color1 = vec3(0.2, 0.8, 0.2);  // Bright green
        color2 = vec3(0.4, 1.0, 0.4);  // Light green
        color3 = vec3(0.1, 0.6, 0.1);  // Dark green
    } else {
        // Blue swirl pattern for rank 2
        p = rotate2D(p, -time * 0.2);
        float swirls = 0.0;
        for(int i = 0; i < 4; i++) {
            float t = time + float(i) * PI * 0.25;
            swirls += swirl(p, t) * (0.5 / float(i + 1));
            p = rotate2D(p, PI * 0.5);
        }
        pattern = swirls;
        
        // Blue color palette
        color1 = vec3(0.1, 0.4, 0.8);  // Deep blue
        color2 = vec3(0.2, 0.6, 1.0);  // Bright blue
        color3 = vec3(0.0, 0.3, 0.6);  // Dark blue
    }
    
    // Add noise to the pattern
    float n = noise(p * 4.0 + time);
    pattern = mix(pattern, n, 0.2);
    
    // Mix colors based on the pattern
    vec3 color = mix(
        mix(color1, color2, pattern),
        color3,
        smoothstep(0.4, 0.6, pattern)
    );
    
    // Add center glow
    float centerGlow = exp(-length(uv) * 4.0);
    color += centerGlow * (selectedRank == 1.0 ? vec3(0.2, 0.4, 0.2) : vec3(0.2, 0.3, 0.4));
    
    // Add edge highlights
    float edge = smoothstep(0.3, 0.0, pattern);
    color += edge * (selectedRank == 1.0 ? vec3(0.3, 0.5, 0.3) : vec3(0.3, 0.4, 0.5));
    
    // Pixelate the final color
    color = floor(color * COLOR_LEVELS) / COLOR_LEVELS;
    
    fragColor = vec4(color, 1.0);
}

varying vec2 vUv;
void main() {
    mainImage(gl_FragColor, vUv * iResolution.xy);
}
`

export function AchievementsShader({ selectedRank = 1 }) {
    const meshRef = useRef()
    const { size } = useThree()
    
    const uniforms = useMemo(() => ({
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(size.width, size.height) },
        selectedRank: { value: selectedRank }
    }), [size, selectedRank])
    
    useEffect(() => {
        if (meshRef.current) {
            meshRef.current.material.uniforms.iResolution.value.set(size.width, size.height)
            meshRef.current.material.uniforms.selectedRank.value = selectedRank
        }
    }, [size, selectedRank])
    
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.material.uniforms.iTime.value = state.clock.getElapsedTime()
        }
    })
    
    return (
        <mesh ref={meshRef}>
            <planeGeometry args={[2, 2]} />
            <shaderMaterial
                key={`shader-${selectedRank}`}
                fragmentShader={fragmentShader}
                vertexShader={vertexShader}
                uniforms={uniforms}
                transparent={true}
                depthWrite={false}
                depthTest={false}
            />
        </mesh>
    )
} 