'use client';

import { dustFrag, starsFrag, starsVert } from '@exoforge/shaders';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useMemo } from 'react';
import { buildGalaxyBuffers } from '@/lib/galaxy/params';
import { useGalaxyStore } from '@/lib/galaxy/store';

function Stars() {
  const params = useGalaxyStore((s) => s.params);
  const buffers = useMemo(() => buildGalaxyBuffers(params), [params]);
  return (
    <>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[buffers.positions, 3]}
          />
          <bufferAttribute attach="attributes-aAge" args={[buffers.ages, 1]} />
        </bufferGeometry>
        <shaderMaterial
          transparent
          depthWrite={false}
          args={[{ vertexShader: starsVert, fragmentShader: starsFrag }]}
        />
      </points>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[buffers.dustPositions, 3]}
          />
          <bufferAttribute attach="attributes-aAge" args={[buffers.ages, 1]} />
        </bufferGeometry>
        <shaderMaterial
          transparent
          depthWrite={false}
          args={[
            {
              uniforms: { uDustDensity: { value: params.dustDensity } },
              vertexShader: starsVert,
              fragmentShader: dustFrag,
            },
          ]}
        />
      </points>
    </>
  );
}

export function GalaxyScene() {
  return (
    <Canvas camera={{ position: [0, 1.4, 1.8], fov: 50 }}>
      <color attach="background" args={['#05070d']} />
      <Stars />
      <OrbitControls enablePan={false} />
    </Canvas>
  );
}
