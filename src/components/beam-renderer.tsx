'use client';

import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
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
  const groupRef = useRef<THREE.Group>(null);

  // Convert string dimensions to numbers
  const height = parseFloat(section.height_mm) / 1000;
  const width = parseFloat(section.width_mm) / 1000;
  const webThickness = parseFloat(section.web_thickness_mm) / 1000;
  const flangeThickness = parseFloat(section.flange_thickness_mm) / 1000;
  const rootRadius = parseFloat(section.root_radius_mm) / 1000;
  const depth = height * 2;

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
    depth: depth,
    bevelEnabled: true,
    bevelThickness: rootRadius,
    bevelSize: rootRadius,
    bevelSegments: 3,
  };

  return (
    <group ref={groupRef}>
      <mesh castShadow receiveShadow>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshPhysicalMaterial 
          color="#4B5563"
          metalness={0.9}
          roughness={0.1}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          envMapIntensity={1.5}
          reflectivity={1}
          ior={2.33}
        />
      </mesh>
      {/* Shear center marker */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshBasicMaterial color="red" />
      </mesh>
    </group>
  );
}

function UBBeam({ section }: { section: BeamRendererProps['section'] }) {
  const groupRef = useRef<THREE.Group>(null);

  // Convert string dimensions to numbers
  const height = parseFloat(section.height_mm) / 1000;
  const width = parseFloat(section.width_mm) / 1000;
  const webThickness = parseFloat(section.web_thickness_mm) / 1000;
  const flangeThickness = parseFloat(section.flange_thickness_mm) / 1000;
  const rootRadius = parseFloat(section.root_radius_mm) / 1000;
  const depth = height * 2.5;

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
    depth: depth,
    bevelEnabled: true,
    bevelThickness: rootRadius,
    bevelSize: rootRadius,
    bevelSegments: 3,
  };

  return (
    <group ref={groupRef}>
      <mesh castShadow receiveShadow>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshPhysicalMaterial 
          color="#4B5563"
          metalness={0.9}
          roughness={0.1}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          envMapIntensity={1.5}
          reflectivity={1}
          ior={2.33}
        />
      </mesh>
      {/* Shear center marker */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshBasicMaterial color="red" />
      </mesh>
    </group>
  );
}

export function BeamRenderer({ section, type }: BeamRendererProps) {
  return (
    <div className="w-full h-[300px] bg-white rounded-lg">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[2, 2, 2]} />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
        />
        
        {/* Environment and lighting */}
        <Environment preset="warehouse" />
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight
          position={[-5, 5, -5]}
          intensity={0.8}
          castShadow
          shadow-mapSize={[1024, 1024]}
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