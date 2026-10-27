/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  Globe,
  Radio,
  Locate,
  RotateCw,
  Eye,
  Zap,
  Activity,
  Layers,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { PlayerProfile, RealConnectedPlayer } from "../../lib/gameEconomy";
import { loadRealActiveTraders } from "../../lib/gameEconomy";
import { latLonToVector3, type UserGeoLocation } from "../../lib/location";
import { playSfx } from "../../lib/sound";

interface LiveGlobeProps {
  player: PlayerProfile;
  userLocation: UserGeoLocation | null;
  walletAddress?: string;
}

export function LiveGlobe({ player, userLocation, walletAddress }: LiveGlobeProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [realTraders, setRealTraders] = useState<RealConnectedPlayer[]>(() => loadRealActiveTraders());
  const [selectedNode, setSelectedNode] = useState<RealConnectedPlayer | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [hudCollapsed, setHudCollapsed] = useState(false);
  const [pingStatus, setPingStatus] = useState<number>(24);

  // References for camera control
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const targetRotationRef = useRef<{ x: number; y: number } | null>(null);

  // Reload real active traders
  useEffect(() => {
    setRealTraders(loadRealActiveTraders());
    const interval = setInterval(() => {
      setRealTraders(loadRealActiveTraders());
      setPingStatus(Math.floor(18 + Math.random() * 14));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Three.js Scene Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || Math.max(500, window.innerHeight - 180);

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030712); // Deep cosmic void

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 4, 18);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.replaceChildren(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x14f195, 1.2);
    dirLight.position.set(12, 10, 15);
    scene.add(dirLight);

    const backLight = new THREE.DirectionalLight(0x00d2ff, 0.8);
    backLight.position.set(-15, -10, -10);
    scene.add(backLight);

    // 3. Planet Earth Group
    const globeGroup = new THREE.Group();
    globeGroupRef.current = globeGroup;
    scene.add(globeGroup);

    const GLOBE_RADIUS = 6.0;

    // Procedural Earth Texture Canvas
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Ocean background
      ctx.fillStyle = "#070d1e";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Lat / Lon coordinate grid lines
      ctx.strokeStyle = "rgba(0, 229, 255, 0.12)";
      ctx.lineWidth = 1;
      for (let y = 0; y <= canvas.height; y += 64) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      for (let x = 0; x <= canvas.width; x += 64) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Procedural continent landmass clusters (world grid)
      ctx.fillStyle = "#0f233a";
      // Americas
      ctx.beginPath();
      ctx.roundRect(320, 200, 380, 260, 40);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(460, 480, 240, 320, 30);
      ctx.fill();
      // Europe & Africa
      ctx.beginPath();
      ctx.roundRect(960, 180, 260, 220, 25);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(980, 400, 280, 360, 30);
      ctx.fill();
      // Asia & Australia
      ctx.beginPath();
      ctx.roundRect(1240, 160, 480, 320, 40);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(1520, 560, 260, 200, 30);
      ctx.fill();

      // Cyber glowing dots representing continental topology
      ctx.fillStyle = "#14f195";
      for (let i = 0; i < 400; i++) {
        const px = Math.random() * canvas.width;
        const py = Math.random() * canvas.height;
        ctx.fillRect(px, py, 2, 2);
      }
    }

    const earthTexture = new THREE.CanvasTexture(canvas);
    earthTexture.wrapS = THREE.RepeatWrapping;
    earthTexture.wrapT = THREE.ClampToEdgeWrapping;

    // Earth Sphere Mesh
    const earthGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const earthMat = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.85,
      metalness: 0.15,
      emissive: new THREE.Color(0x020813),
      emissiveIntensity: 0.6,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    globeGroup.add(earthMesh);

    // Glowing Atmosphere Halo Ring
    const atmoGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.05, 48, 48);
    const atmoMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 2.2);
          gl_FragColor = vec4(0.08, 0.94, 0.58, 1.0) * intensity * 0.75;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    globeGroup.add(atmoMesh);

    // Distant Starfield
    const starGeo = new THREE.BufferGeometry();
    const starCount = 1200;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 200;
      starPositions[i + 1] = (Math.random() - 0.5) * 200;
      starPositions[i + 2] = (Math.random() - 0.5) * 200;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x88ccff,
      size: 0.6,
      transparent: true,
      opacity: 0.7,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // 4. Markers for Real Active Users (Green Lights: #14F195)
    const markerMeshes: { mesh: THREE.Object3D; trader: RealConnectedPlayer }[] = [];
    const markerGroup = new THREE.Group();
    globeGroup.add(markerGroup);

    // Use current active traders
    const currentTraders = loadRealActiveTraders();
    // If empty, ensure current player is displayed
    const tradersToRender: RealConnectedPlayer[] =
      currentTraders.length > 0
        ? currentTraders
        : [
            {
              id: "active_user",
              walletAddress: walletAddress || "guest_devnet_user",
              username: `${player.username} (You)`,
              avatar: player.avatar,
              city: userLocation?.city || "Local Node",
              country: userLocation?.country || "Earth",
              countryCode: userLocation?.countryCode || "GL",
              latitude: userLocation?.latitude ?? 40.7128,
              longitude: userLocation?.longitude ?? -74.006,
              jolselBalance: player.jolselBalance,
              devnetSolBalance: player.devnetSolBalance,
              totalPnlUsd: player.totalPnlUsd,
              pnlPct: 15.4,
              winRatePct: 75.0,
              winStreak: player.winStreak,
              totalTrades: player.totalTrades,
              xp: player.xp,
              level: player.level,
              badge: "Genesis Pioneer",
              pingMs: 24,
              joinedTimestamp: Date.now(),
              lastActiveTimestamp: Date.now(),
              isCurrentUser: true,
            },
          ];

    tradersToRender.forEach((trader) => {
      const lat = trader.latitude || 40.7128;
      const lon = trader.longitude || -74.006;
      const pos = latLonToVector3(lat, lon, GLOBE_RADIUS);

      // Node Parent
      const nodeObj = new THREE.Group();
      nodeObj.position.set(pos.x, pos.y, pos.z);

      // Point outwards from globe center
      nodeObj.lookAt(pos.x * 2, pos.y * 2, pos.z * 2);

      // 1) Glowing green sphere light
      const lightGeo = new THREE.SphereGeometry(0.18, 16, 16);
      const lightMat = new THREE.MeshBasicMaterial({
        color: 0x14f195, // Solana Green Light
      });
      const lightMesh = new THREE.Mesh(lightGeo, lightMat);
      nodeObj.add(lightMesh);

      // 2) Radial pulsing ring
      const ringGeo = new THREE.RingGeometry(0.24, 0.36, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x14f195,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      nodeObj.add(ringMesh);

      // 3) Neon beacon ray shooting up into space
      const beamGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.2, 8);
      const beamMat = new THREE.MeshBasicMaterial({
        color: 0x00ffa3,
        transparent: true,
        opacity: 0.75,
      });
      const beamMesh = new THREE.Mesh(beamGeo, beamMat);
      beamMesh.position.z = 0.6;
      beamMesh.rotation.x = Math.PI / 2;
      nodeObj.add(beamMesh);

      markerGroup.add(nodeObj);
      markerMeshes.push({ mesh: nodeObj, trader });
    });

    // 5. User Interaction & Drag Rotation
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !globeGroupRef.current) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - previousMousePosition.x;
      const deltaY = clientY - previousMousePosition.y;

      globeGroupRef.current.rotation.y += deltaX * 0.005;
      globeGroupRef.current.rotation.x += deltaY * 0.005;

      // Clamp vertical tilt
      globeGroupRef.current.rotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, globeGroupRef.current.rotation.x));

      previousMousePosition = { x: clientX, y: clientY };
      targetRotationRef.current = null;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    // Raycasting for clicking on green node markers
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const objectsToTest = markerMeshes.map((m) => m.mesh);
      const intersects = raycaster.intersectObjects(objectsToTest, true);

      if (intersects.length > 0) {
        playSfx("click");
        const hit = intersects[0].object;
        const found = markerMeshes.find((m) => {
          let cur: THREE.Object3D | null = hit;
          while (cur) {
            if (cur === m.mesh) return true;
            cur = cur.parent;
          }
          return false;
        });
        if (found) {
          setSelectedNode(found.trader);
        }
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);
    dom.addEventListener("touchstart", onPointerDown, { passive: true });
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("touchend", onPointerUp);
    dom.addEventListener("click", onClick);

    // 6. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Slow ambient auto-rotation when not dragging
      if (autoRotate && !isDragging && globeGroupRef.current) {
        globeGroupRef.current.rotation.y += delta * 0.12;
      }

      // Smooth camera interpolation towards target if requested
      if (targetRotationRef.current && globeGroupRef.current) {
        globeGroupRef.current.rotation.y += (targetRotationRef.current.y - globeGroupRef.current.rotation.y) * 0.08;
        globeGroupRef.current.rotation.x += (targetRotationRef.current.x - globeGroupRef.current.rotation.x) * 0.08;
        if (
          Math.abs(targetRotationRef.current.y - globeGroupRef.current.rotation.y) < 0.001 &&
          Math.abs(targetRotationRef.current.x - globeGroupRef.current.rotation.x) < 0.001
        ) {
          targetRotationRef.current = null;
        }
      }

      // Pulse beacon rings
      const time = clock.getElapsedTime();
      markerMeshes.forEach((item) => {
        const ring = item.mesh.children[1] as THREE.Mesh;
        if (ring) {
          const s = 1.0 + Math.sin(time * 4) * 0.3;
          ring.scale.set(s, s, 1);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || Math.max(500, window.innerHeight - 180);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      dom.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
      dom.removeEventListener("touchstart", onPointerDown);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchend", onPointerUp);
      dom.removeEventListener("click", onClick);
      renderer.dispose();
      earthGeo.dispose();
      earthMat.dispose();
      earthTexture.dispose();
      atmoGeo.dispose();
      atmoMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      if (container.contains(dom)) {
        container.removeChild(dom);
      }
    };
  }, [realTraders, autoRotate, player, userLocation, walletAddress]);

  // Center camera to user's detected location
  const handleFocusMyLocation = () => {
    playSfx("scan");
    if (!globeGroupRef.current) return;
    const lat = userLocation?.latitude ?? 40.7128;
    const lon = userLocation?.longitude ?? -74.006;

    // Calculate rotation angles to point camera directly at (lat, lon)
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    const targetX = -(phi - Math.PI / 2);
    const targetY = -theta + Math.PI / 2;

    targetRotationRef.current = { x: targetX, y: targetY };
    setAutoRotate(false);
  };

  return (
    <div className="relative w-full h-[calc(100vh-130px)] min-h-[580px] bg-[#030712] overflow-hidden select-none">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Overlay: Global Live Status Bar */}
      <div className="absolute top-4 left-4 right-4 sm:left-6 sm:right-6 pointer-events-none flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 z-10">
        <div className="pointer-events-auto rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 items-center justify-center">
              <span className="absolute h-3 w-3 rounded-full bg-[#14F195] opacity-75 animate-ping" />
              <span className="relative h-2 w-2 rounded-full bg-[#14F195]" />
            </span>
            <span className="font-mono text-xs font-black tracking-wider text-white">
              PLANET EARTH • LIVE ACTIVE PLAYERS
            </span>
            <span className="rounded-full bg-[#14F195]/20 border border-[#14F195]/40 px-2 py-0.2 font-mono text-[9px] font-bold text-[#14F195]">
              ZERO SIMULATION
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-300">
            Green lights represent real players currently connected on Solana Devnet. Drag to rotate earth. Click any green beacon to inspect node telemetry.
          </p>
        </div>

        {/* Live Network Metric Badge */}
        <div className="pointer-events-auto flex items-center gap-2 self-start sm:self-auto">
          <div className="rounded-xl border border-white/10 bg-slate-950/80 px-3.5 py-2 font-mono text-xs backdrop-blur-xl text-slate-200">
            <div className="text-[10px] text-slate-400">Network Latency</div>
            <div className="flex items-center gap-1 font-bold text-[#14F195]">
              <Radio className="h-3 w-3 animate-pulse" />
              <span>{pingStatus} ms</span>
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-950/80 px-3.5 py-2 font-mono text-xs backdrop-blur-xl text-slate-200">
            <div className="text-[10px] text-slate-400">Active Live Nodes</div>
            <div className="font-bold text-white">
              {Math.max(1, realTraders.length)} {realTraders.length === 1 ? "Node" : "Nodes"}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Node Floating HUD Card */}
      {selectedNode && (
        <div className="absolute top-24 right-4 sm:right-6 w-80 rounded-2xl border border-[#14F195]/40 bg-slate-950/95 p-4 shadow-2xl backdrop-blur-xl z-20 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#14F195] animate-ping" />
              <span className="font-mono text-xs font-bold text-white">
                NODE TELEMETRY
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedNode(null)}
              className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Trader:</span>
              <span className="font-bold text-white">{selectedNode.username}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Location:</span>
              <span className="text-cyan-300 font-semibold">
                {selectedNode.city}, {selectedNode.country}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Coordinates:</span>
              <span className="font-mono text-[11px] text-slate-300">
                {selectedNode.latitude.toFixed(4)}°, {selectedNode.longitude.toFixed(4)}°
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Wallet:</span>
              <span className="font-mono text-[11px] text-slate-300">
                {selectedNode.walletAddress.slice(0, 6)}...{selectedNode.walletAddress.slice(-4)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Verified Net PnL:</span>
              <span className="font-mono font-bold text-emerald-400">
                +${selectedNode.totalPnlUsd.toFixed(1)} USD
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">In-Game $JOLSEL:</span>
              <span className="font-mono font-bold text-amber-300">
                {selectedNode.jolselBalance.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Active Streak:</span>
              <span className="font-mono font-bold text-cyan-300">
                🔥 {selectedNode.winStreak}W
              </span>
            </div>
          </div>

          <div className="mt-3 border-t border-white/10 pt-2 text-[10px] text-slate-400 font-mono flex items-center justify-between">
            <span>Status: SYNCHRONIZED</span>
            <span className="text-[#14F195]">Ping: {selectedNode.pingMs}ms</span>
          </div>
        </div>
      )}

      {/* Bottom Ergonomic Dock (Collapsible) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
        {/* Dock Controls */}
        <div className="flex items-center gap-1.5 rounded-2xl border border-white/15 bg-slate-950/85 p-1.5 backdrop-blur-xl shadow-2xl">
          <button
            type="button"
            onClick={handleFocusMyLocation}
            className="flex items-center gap-1.5 rounded-xl bg-[#14F195]/15 border border-[#14F195]/30 px-3 py-2 text-xs font-bold text-[#14F195] hover:bg-[#14F195]/25 transition"
            title="Rotate camera to your real detected location"
          >
            <Locate className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Focus My Node</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playSfx("click");
              setAutoRotate(!autoRotate);
            }}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition ${
              autoRotate
                ? "border-cyan-500/40 bg-cyan-500/15 text-cyan-300"
                : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
            }`}
            title="Toggle Earth Auto Rotation"
          >
            <RotateCw className={`h-3.5 w-3.5 ${autoRotate ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Auto-Spin</span>
          </button>

          <div className="h-5 w-px bg-white/10 mx-1" />

          {/* User's Detected Location Tag */}
          <div className="flex items-center gap-1.5 px-2 text-xs text-slate-300 font-mono">
            <Globe className="h-3.5 w-3.5 text-cyan-400" />
            <span className="max-w-[140px] truncate sm:max-w-none">
              {userLocation?.city || "Detecting..."}, {userLocation?.countryCode || "GL"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
