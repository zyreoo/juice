export default function Wall() {
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