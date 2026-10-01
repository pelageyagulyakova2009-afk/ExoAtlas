'use client';

import { dustFrag, starsFrag, starsVert } from '@exoforge/shaders';
import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef, useState } from 'react';
import { buildGalaxyBuffers } from '@/lib/galaxy/params';
import { useGalaxyStore } from '@/lib/galaxy/store';

const dustVert = /* glsl */ `
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = 3.0 * (6.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
}
`;

const hiiFrag = /* glsl */ `
void main() {
  vec2 uv = gl_PointCoord * 2.0 - 1.0;
  float d = dot(uv, uv);
  if (d > 1.0) discard;
  gl_FragColor = vec4(1.0, 0.35, 0.55, 0.75 * (1.0 - d));
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
          vertexShader={dustVert}
          fragmentShader={hiiFrag}
        />
      </points>
      <mesh>
        <sphereGeometry args={[params.coreSize * 0.15, 16, 16]} />
        <meshBasicMaterial color="#fff4d2" />
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
        gl={{ preserveDrawingBuffer: true }}
        camera={{ position: [0, 1.2, 1.6], fov: 50 }}
        onCreated={({ gl }) => {
          setCanvas(gl.domElement);
        }}
      >
        <color attach="background" args={['#05060c']} />
        <Fps onFrame={setFps} />
        <Stars />
        <OrbitControls enableDamping enablePan={false} />
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
