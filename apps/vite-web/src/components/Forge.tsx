'use client';
import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
const CoreShape: React.FC<{ shapeType: string; color: string }> = ({ shapeType, color }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(() => { if (meshRef.current) { meshRef.current.rotation.y += 0.01; } });
  return (
    <mesh ref={meshRef}>
      {shapeType === 'tetrahedron' ? <tetrahedronGeometry args={[1, 0]} /> : <boxGeometry args={[1, 1, 1]} />}
      <MeshDistortMaterial color={color} speed={2} distort={0.3} radius={1} />
    </mesh>
  );
};
export const Forge: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [shapeType, setShapeType] = useState('tetrahedron');
  const [color, setColor] = useState('#00F2FF');
  return (
    <div className="fixed inset-0 bg-[#050506] z-50 flex">
      <div className="w-80 border-r border-[#1A1A1B] p-8 flex flex-col">
        <h2 className="text-2xl font-bold mb-8">THE FORGE</h2>
        <button onClick={() => setShapeType('box')} className="mb-2 py-2 border border-[#1A1A1B] text-[#8E8E93]">BOX</button>
        <button onClick={() => setShapeType('tetrahedron')} className="mb-2 py-2 border border-[#1A1A1B] text-[#8E8E93]">TETRAHEDRON</button>
        <div className="grid grid-cols-4 gap-2 mt-4">
          {['#00F2FF', '#FF0043', '#7000FF', '#39FF14'].map(c => <button key={c} onClick={() => setColor(c)} className="w-full aspect-square" style={{ backgroundColor: c }} />)}
        </div>
        <button onClick={onClose} className="mt-auto py-4 bg-[#00F2FF] text-[#050506] font-bold">EQUIP</button>
      </div>
      <div className="flex-1 relative">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 4]} />
          <OrbitControls enableZoom={false} />
          <ambientLight intensity={0.5} /><pointLight position={[10, 10, 10]} intensity={1.5} color={color} />
          <Float speed={2}><CoreShape shapeType={shapeType} color={color} /></Float>
        </Canvas>
      </div>
    </div>
  );
};
