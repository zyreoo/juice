export default function Lights() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[5, 8, 3]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-5, 2, -5]} intensity={0.8} color="#ffffff" />
      <pointLight position={[0, 2, 8]} intensity={0.8} color="#ffffff" />
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