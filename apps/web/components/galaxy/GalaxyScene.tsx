'use client';

import { dustFrag, starsFrag, starsVert } from '@exoforge/shaders';
import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef, useState } from 'react';
import { AdditiveBlending, MultiplyBlending, NoToneMapping } from 'three';
import { buildGalaxyBuffers } from '@/lib/galaxy/params';
import { useGalaxyStore } from '@/lib/galaxy/store';

const dustVert = /* glsl */ `
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = clamp(7.0 * (2.2 / -mv.z), 2.0, 18.0);
  gl_Position = projectionMatrix * mv;
}
`;

const hiiFrag = /* glsl */ `
void main() {
  vec2 uv = gl_PointCoord * 2.0 - 1.0;
  float d = dot(uv, uv);
  if (d > 1.0) discard;
  float core = smoothstep(1.0, 0.4, d);
  gl_FragColor = vec4(1.0, 0.25, 0.55, core);
}
`;

function Stars() {
  const params = useGalaxyStore((s) => s.params);
  const buffers = useMemo(() => buildGalaxyBuffers(params), [params]);
  return (
    <group>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[buffers.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-aColor"
            args={[buffers.colors, 3]}
          />
        </bufferGeometry>
        <shaderMaterial
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
          vertexShader={starsVert}
          fragmentShader={starsFrag}
        />
      </points>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[buffers.dustPositions, 3]}
          />
        </bufferGeometry>
        <shaderMaterial
          transparent
          depthWrite={false}
          blending={MultiplyBlending}
          uniforms={{ uDustDensity: { value: params.dustDensity } }}
          vertexShader={dustVert}
          fragmentShader={dustFrag}
        />
      </points>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[buffers.hiiPositions, 3]}
          />
        </bufferGeometry>
        <shaderMaterial
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
          vertexShader={dustVert}
          fragmentShader={hiiFrag}
        />
      </points>
      <mesh renderOrder={2}>
        <sphereGeometry
          args={[Math.max(0.02, params.coreSize * 0.08), 16, 16]}
        />
        <meshBasicMaterial color="#ffe6c4" />
      </mesh>
    </group>
  );
}

export function GalaxyCanvas() {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [fps, setFps] = useState(0);
  return (
    <div className="relative h-full w-full">
      <Canvas
        gl={{ preserveDrawingBuffer: true, toneMapping: NoToneMapping }}
        camera={{ position: [0, 1.6, 2.2], fov: 50 }}
        onCreated={({ gl }) => {
          setCanvas(gl.domElement);
        }}
      >
        <color attach="background" args={['#05060c']} />
        <Fps onFrame={setFps} />
        <Stars />
        <OrbitControls
          enableDamping
          enablePan={false}
          minDistance={0.8}
          maxDistance={6}
        />
      </Canvas>
      <div className="absolute right-4 top-4 flex gap-2 text-xs">
        <span className="rounded-lg bg-black/50 px-2 py-1">{fps} FPS</span>
        <button
          type="button"
          className="rounded-lg bg-black/50 px-2 py-1"
          onClick={() => canvas?.requestFullscreen()}
        >
          Fullscreen
        </button>
        <button
          type="button"
          className="rounded-lg bg-black/50 px-2 py-1"
          onClick={() => {
            const url = canvas?.toDataURL('image/png');
            if (!url) return;
            const link = document.createElement('a');
            link.href = url;
            link.download = 'exoforge-galaxy.png';
            link.click();
          }}
        >
          PNG
        </button>
      </div>
    </div>
  );
}

function Fps({ onFrame }: { onFrame: (fps: number) => void }) {
  const frames = useRef(0);
  const last = useRef(0);
  useFrame(({ clock }) => {
    frames.current += 1;
    if (clock.elapsedTime - last.current > 0.5) {
      onFrame(Math.round(frames.current / (clock.elapsedTime - last.current)));
      frames.current = 0;
      last.current = clock.elapsedTime;
    }
  });
  return null;
}
