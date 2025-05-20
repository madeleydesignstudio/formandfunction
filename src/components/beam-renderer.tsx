'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

interface BeamRendererProps {
  section: {
    section: string;
    height_mm: string;
    width_mm: string;
    web_thickness_mm: string;
    flange_thickness_mm: string;
    internal_height_mm: string;
    root_radius_mm: string;
  };
  type: 'UC' | 'UB';
}

function UCBeam({ section }: { section: BeamRendererProps['section'] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Convert string dimensions to numbers
  const height = parseFloat(section.height_mm) / 1000; // Convert mm to m
  const width = parseFloat(section.width_mm) / 1000;
  const webThickness = parseFloat(section.web_thickness_mm) / 1000;
  const flangeThickness = parseFloat(section.flange_thickness_mm) / 1000;
  const rootRadius = parseFloat(section.root_radius_mm) / 1000;

  // Create a shape for the UC beam
  const shape = new THREE.Shape();
  
  // Define the UC beam shape with rounded corners
  shape.moveTo(-width/2, -height/2);
  shape.lineTo(width/2, -height/2);
  shape.lineTo(width/2, -height/2 + flangeThickness);
  shape.lineTo(webThickness/2, -height/2 + flangeThickness);
  shape.lineTo(webThickness/2, height/2 - flangeThickness);
  shape.lineTo(width/2, height/2 - flangeThickness);
  shape.lineTo(width/2, height/2);
  shape.lineTo(-width/2, height/2);
  shape.lineTo(-width/2, height/2 - flangeThickness);
  shape.lineTo(-webThickness/2, height/2 - flangeThickness);
  shape.lineTo(-webThickness/2, -height/2 + flangeThickness);
  shape.lineTo(-width/2, -height/2 + flangeThickness);
  shape.lineTo(-width/2, -height/2);

  // Extrude settings
  const extrudeSettings = {
    steps: 1,
    depth: height * 2, // Length proportional to height
    bevelEnabled: true,
    bevelThickness: rootRadius,
    bevelSize: rootRadius,
    bevelSegments: 3,
  };

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <mesh ref={meshRef}>
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <meshStandardMaterial 
        color="#4B5563" 
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}

function UBBeam({ section }: { section: BeamRendererProps['section'] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Convert string dimensions to numbers
  const height = parseFloat(section.height_mm) / 1000;
  const width = parseFloat(section.width_mm) / 1000;
  const webThickness = parseFloat(section.web_thickness_mm) / 1000;
  const flangeThickness = parseFloat(section.flange_thickness_mm) / 1000;
  const rootRadius = parseFloat(section.root_radius_mm) / 1000;

  // Create a shape for the UB beam
  const shape = new THREE.Shape();
  
  // Define the UB beam shape with rounded corners
  shape.moveTo(-width/2, -height/2);
  shape.lineTo(width/2, -height/2);
  shape.lineTo(width/2, -height/2 + flangeThickness);
  shape.lineTo(webThickness/2, -height/2 + flangeThickness);
  shape.lineTo(webThickness/2, height/2 - flangeThickness);
  shape.lineTo(width/2, height/2 - flangeThickness);
  shape.lineTo(width/2, height/2);
  shape.lineTo(-width/2, height/2);
  shape.lineTo(-width/2, height/2 - flangeThickness);
  shape.lineTo(-webThickness/2, height/2 - flangeThickness);
  shape.lineTo(-webThickness/2, -height/2 + flangeThickness);
  shape.lineTo(-width/2, -height/2 + flangeThickness);
  shape.lineTo(-width/2, -height/2);

  // Extrude settings
  const extrudeSettings = {
    steps: 1,
    depth: height * 2.5, // UB beams are typically longer than UC beams
    bevelEnabled: true,
    bevelThickness: rootRadius,
    bevelSize: rootRadius,
    bevelSegments: 3,
  };

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <mesh ref={meshRef}>
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <meshStandardMaterial 
        color="#4B5563" 
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}

export function BeamRenderer({ section, type }: BeamRendererProps) {
  return (
    <div className="w-full h-[300px] bg-muted rounded-lg">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[2, 2, 2]} />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
        />
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
        />
        {type === 'UC' ? (
          <UCBeam section={section} />
        ) : (
          <UBBeam section={section} />
        )}
      </Canvas>
    </div>
  );
} 