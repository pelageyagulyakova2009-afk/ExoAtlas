'use client';

import {
  atmosphereFrag,
  cloudsFrag,
  planetFrag,
  planetVert,
} from '@exoforge/shaders';
import { OrbitControls, useTexture } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  LinearFilter,
  LinearMipmapLinearFilter,
  NoToneMapping,
  SRGBColorSpace,
  type Mesh,
  type Texture,
} from 'three';
import { buildPatch, MAX_LOD, selectPatches } from '@/lib/planet/lod';
import { usePlanetStore } from '@/lib/planet/store';

function Patches() {
  const params = usePlanetStore((s) => s.params);
  const lodLevel = usePlanetStore((s) => s.lodLevel);
  const camera = useThree((s) => s.camera);
  const gl = useThree((s) => s.gl);
  const [day, night] = useTexture([
    '/textures/earth-day.jpg',
    '/textures/earth-night.jpg',
  ]);
  const [distance, setDistance] = useState(() => camera.position.length());
  useEffect(() => {
    for (const map of [day, night] as Texture[]) {
      map.generateMipmaps = true;
      map.minFilter = LinearMipmapLinearFilter;
      map.magFilter = LinearFilter;
      map.anisotropy = gl.capabilities.getMaxAnisotropy();
      map.colorSpace = SRGBColorSpace;
      map.needsUpdate = true;
    }
  }, [day, night, gl]);
  const patches = useMemo(
    () =>
      selectPatches(distance, Math.min(lodLevel, MAX_LOD)).map((id) =>
        buildPatch(id, 12),
      ),
    [distance, lodLevel],
  );
  useFrame((_, delta) => {
    const state = usePlanetStore.getState();
    state.setTime(state.time + delta);
    const next = camera.position.length();
    setDistance((prev) => (Math.abs(prev - next) > 0.15 ? next : prev));
  });
  const sun = [1, 0.35, 0.15] as const;
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
            key={`${params.seaLevel}-${params.temperature}-${params.moisture}-${params.useEarth}`}
            vertexShader={planetVert}
            fragmentShader={planetFrag}
            uniforms={{
              uSeaLevel: { value: params.seaLevel },
              uTemperature: { value: params.temperature },
              uMoisture: { value: params.moisture },
              uUseEarth: { value: params.useEarth },
              uSunDir: { value: sun },
              uTime: { value: 0 },
              uDay: { value: day },
              uNight: { value: night },
            }}
          />
        </mesh>
      ))}
    </group>
  );
}

function Shell({
  scale,
  fragment,
  uniforms,
}: {
  scale: number;
  fragment: string;
  uniforms: Record<string, { value: unknown }>;
}) {
  const mesh = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (mesh.current) mesh.current.rotation.y = clock.elapsedTime * 0.01;
  });
  return (
    <mesh ref={mesh} scale={scale}>
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        side={2}
        key={JSON.stringify(uniforms)}
        args={[
          {
            uniforms,
            vertexShader: `varying vec3 vWorld; void main(){ vWorld = (modelMatrix * vec4(position,1.0)).xyz; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
            fragmentShader: fragment,
          },
        ]}
      />
    </mesh>
  );
}

export function PlanetScene() {
  const atmosphere = usePlanetStore((s) => s.params.atmosphereDensity);
  const clouds = usePlanetStore((s) => s.params.cloudCoverage);
  return (
    <>
      <Patches />
      <Shell
        scale={1.04}
        fragment={cloudsFrag}
        uniforms={{ uCloudCoverage: { value: clouds }, uTime: { value: 0 } }}
      />
      <Shell
        scale={1.12}
        fragment={atmosphereFrag}
        uniforms={{
          uAtmosphereDensity: { value: atmosphere },
          uSun: { value: [1, 0.35, 0.15] },
        }}
      />
    </>
  );
}

export function PlanetCanvas() {
  const [fps, setFps] = useState(0);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  return (
    <div className="relative h-full w-full">
      <Canvas
        gl={{ preserveDrawingBuffer: true, toneMapping: NoToneMapping }}
        camera={{ position: [0, 0.4, 2.6], fov: 40 }}
        onCreated={({ gl }) => {
          setCanvas(gl.domElement);
        }}
      >
        <color attach="background" args={['#05060c']} />
        <Fps onFrame={setFps} />
        <PlanetScene />
        <OrbitControls
          enablePan
          makeDefault
          enableDamping
          minDistance={1.15}
          maxDistance={8}
        />
      </Canvas>
      <Hud fps={fps} canvas={canvas} />
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

function Hud({
  fps,
  canvas,
}: {
  fps: number;
  canvas: HTMLCanvasElement | null;
}) {
  const useEarth = usePlanetStore((s) => s.params.useEarth);
  return (
    <>
      <img
        alt="Planet preview"
        className="absolute bottom-4 left-4 h-24 w-24 rounded-xl border border-white/20 object-cover"
        src={
          useEarth > 0.5
            ? '/textures/earth-day.jpg'
            : '/textures/earth-night.jpg'
        }
      />
      <div className="absolute right-4 top-4 flex gap-2 text-xs">
        <span className="rounded-lg bg-black/50 px-2 py-1">{fps} FPS</span>
        <button
          type="button"
          className="rounded-lg bg-black/50 px-2 py-1 hover:bg-white/10"
          onClick={() => canvas?.requestFullscreen()}
        >
          Fullscreen
        </button>
        <button
          type="button"
          className="rounded-lg bg-black/50 px-2 py-1 hover:bg-white/10"
          onClick={() => {
            const url = canvas?.toDataURL('image/png');
            if (!url) return;
            const link = document.createElement('a');
            link.href = url;
            link.download = 'exoforge-planet.png';
            link.click();
          }}
        >
          PNG
        </button>
      </div>
    </>
  );
}
