'use client';

import {
  atmosphereFrag,
  cloudsFrag,
  planetFrag,
  planetVert,
} from '@exoforge/shaders';
import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { Mesh } from 'three';
import { buildPatch, selectPatches } from '@/lib/planet/lod';
import { usePlanetStore } from '@/lib/planet/store';

function Patches() {
  const params = usePlanetStore((s) => s.params);
  const lodLevel = usePlanetStore((s) => s.lodLevel);
  const setLod = usePlanetStore((s) => s.setLodLevel);
  const camera = useThree((s) => s.camera);
  const distance = camera.position.length();
  const patches = useMemo(() => {
    const ids = selectPatches(distance, lodLevel);
    return ids.map((id) => buildPatch(id));
  }, [distance, lodLevel]);

  useFrame((_, delta) => {
    usePlanetStore.getState().setTime(usePlanetStore.getState().time + delta);
    const next = Math.min(
      4,
      Math.max(0, Math.round(4 - camera.position.length())),
    );
    if (next !== lodLevel) setLod(next);
  });

  return (
    <group rotation={[params.axialTilt, 0, 0]}>
      {patches.map((patch) => (
        <mesh
          key={`${patch.id.face}-${patch.id.level}-${patch.id.x}-${patch.id.y}`}
          frustumCulled={false}
        >
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[patch.positions, 3]}
            />
            <bufferAttribute attach="index" args={[patch.indices, 1]} />
          </bufferGeometry>
          <shaderMaterial
            args={[
              {
                uniforms: {
                  uSeaLevel: { value: params.seaLevel },
                  uTemperature: { value: params.temperature },
                  uMoisture: { value: params.moisture },
                  uTime: { value: 0 },
                },
                vertexShader: planetVert,
                fragmentShader: planetFrag,
              },
            ]}
          />
        </mesh>
      ))}
    </group>
  );
}

function Shells() {
  const atmosphere = usePlanetStore((s) => s.params.atmosphereDensity);
  const clouds = usePlanetStore((s) => s.params.cloudCoverage);
  const atmo = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (atmo.current) atmo.current.rotation.y = clock.elapsedTime * 0.02;
  });
  return (
    <>
      <mesh ref={atmo} scale={1.08}>
        <sphereGeometry args={[1, 48, 48]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          args={[
            {
              uniforms: {
                uAtmosphereDensity: { value: atmosphere },
                uSun: { value: [1, 0.4, 0.2] },
              },
              vertexShader: `varying vec3 vWorld; void main(){ vWorld = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
              fragmentShader: atmosphereFrag,
            },
          ]}
        />
      </mesh>
      <mesh scale={1.03}>
        <sphereGeometry args={[1, 48, 48]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          args={[
            {
              uniforms: {
                uCloudCoverage: { value: clouds },
                uTime: { value: 0 },
              },
              vertexShader: `varying vec3 vWorld; void main(){ vWorld = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
              fragmentShader: cloudsFrag,
            },
          ]}
        />
      </mesh>
    </>
  );
}

export function PlanetScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.2], fov: 45 }}
      className="h-full w-full"
    >
      <color attach="background" args={['#05070d']} />
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 2, 3]} intensity={1.4} />
      <Patches />
      <Shells />
      <OrbitControls enablePan={false} minDistance={1.2} maxDistance={8} />
    </Canvas>
  );
}
