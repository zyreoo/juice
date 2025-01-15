export default function Desk() {
  return (
    <mesh 
      position={[0, -6.75, -2]} 
      receiveShadow
      castShadow
    >
      <boxGeometry args={[40, 0.75, 20]} />
      <meshStandardMaterial 
        color="#8B4513"
        roughness={0.7}
        metalness={0.1}
      />
    </mesh>
  );
} 