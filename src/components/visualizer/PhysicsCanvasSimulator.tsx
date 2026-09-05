import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Sliders, Info, Zap, Activity, Flame, Compass } from 'lucide-react';

export type SimulationType = 'projectile' | 'pendulum' | 'wave_interference' | 'circuit_ohm' | 'photosynthesis';

interface PhysicsCanvasSimulatorProps {
  initialSimulation?: SimulationType;
  topicTitle?: string;
}

export const PhysicsCanvasSimulator: React.FC<PhysicsCanvasSimulatorProps> = ({
  initialSimulation = 'projectile',
  topicTitle = 'Physics Simulation',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [simType, setSimType] = useState<SimulationType>(initialSimulation);
  const [isRunning, setIsRunning] = useState<boolean>(true);

  // --- Projectile Motion State ---
  const [launchSpeed, setLaunchSpeed] = useState<number>(45); // m/s
  const [launchAngle, setLaunchAngle] = useState<number>(45); // degrees
  const [gravity, setGravity] = useState<number>(9.8); // m/s^2
  const [initialHeight, setInitialHeight] = useState<number>(0); // meters

  // Simulation loop references
  const animFrameRef = useRef<number | null>(null);
  const simTimeRef = useRef<number>(0);
  const projectileTrailRef = useRef<{ x: number; y: number }[]>([]);

  // --- Pendulum State ---
  const [pendulumLength, setPendulumLength] = useState<number>(180); // px
  const [pendulumAngleInit, setPendulumAngleInit] = useState<number>(40); // deg
  const [pendulumDamping, setPendulumDamping] = useState<number>(0.002);
  const pendulumAngleRef = useRef<number>((40 * Math.PI) / 180);
  const pendulumVelRef = useRef<number>(0);

  // --- Wave Interference State ---
  const [waveFrequency, setWaveFrequency] = useState<number>(2.5);
  const [sourceSeparation, setSourceSeparation] = useState<number>(140);

  // --- Circuit / Ohm's Law State ---
  const [voltage, setVoltage] = useState<number>(9); // Volts
  const [resistance, setResistance] = useState<number>(15); // Ohms
  const currentAmp = Number((voltage / resistance).toFixed(2)); // Amperes
  const powerWatts = Number((voltage * currentAmp).toFixed(2)); // Watts

  // Reset current simulation
  const handleReset = () => {
    simTimeRef.current = 0;
    projectileTrailRef.current = [];
    pendulumAngleRef.current = (pendulumAngleInit * Math.PI) / 180;
    pendulumVelRef.current = 0;
  };

  useEffect(() => {
    handleReset();
  }, [simType, launchSpeed, launchAngle, gravity, initialHeight, pendulumAngleInit]);

  // Main Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTimestamp = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - lastTimestamp) / 1000, 0.05); // cap at 50ms
      lastTimestamp = now;

      // Clear Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background graph paper styling
      ctx.fillStyle = '#FAF6EC';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw subtle coordinate grid
      ctx.strokeStyle = '#E8E1CF';
      ctx.lineWidth = 1;
      const gridSize = 30;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // ==========================================
      // SIMULATION 1: Projectile Motion
      // ==========================================
      if (simType === 'projectile') {
        const groundY = canvas.height - 45;
        const originX = 60;
        const scale = 3.2; // px per meter

        // Draw Ground & Scale
        ctx.fillStyle = '#6E6252';
        ctx.fillRect(0, groundY, canvas.width, 45);
        ctx.fillStyle = '#4D8B31';
        ctx.fillRect(0, groundY, canvas.width, 5);

        // Physics equations
        const rad = (launchAngle * Math.PI) / 180;
        const vx = launchSpeed * Math.cos(rad);
        const vy0 = launchSpeed * Math.sin(rad);

        // Theoretical maximums
        const tFlight = (vy0 + Math.sqrt(vy0 * vy0 + 2 * gravity * initialHeight)) / gravity;
        const maxH = initialHeight + (vy0 * vy0) / (2 * gravity);
        const rangeR = vx * tFlight;

        if (isRunning) {
          simTimeRef.current += dt * 1.4; // time speed
          if (simTimeRef.current > tFlight + 1.2) {
            simTimeRef.current = 0;
            projectileTrailRef.current = [];
          }
        }

        const t = Math.min(simTimeRef.current, tFlight);
        const curX = vx * t;
        const curY = initialHeight + vy0 * t - 0.5 * gravity * t * t;

        const screenX = originX + curX * scale;
        const screenY = groundY - curY * scale;

        // Add to trajectory trail
        if (projectileTrailRef.current.length === 0 || t > 0.02) {
          if (t <= tFlight) {
            projectileTrailRef.current.push({ x: screenX, y: screenY });
          }
        }

        // Draw Full Trajectory Path (Dotted parabola)
        ctx.beginPath();
        ctx.strokeStyle = '#94A3B8';
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1.5;
        for (let pt = 0; pt <= tFlight; pt += 0.05) {
          const px = originX + vx * pt * scale;
          const py = groundY - (initialHeight + vy0 * pt - 0.5 * gravity * pt * pt) * scale;
          if (pt === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw Live Trajectory Trail
        if (projectileTrailRef.current.length > 1) {
          ctx.beginPath();
          ctx.strokeStyle = '#DC2626';
          ctx.lineWidth = 3;
          ctx.moveTo(projectileTrailRef.current[0].x, projectileTrailRef.current[0].y);
          for (let i = 1; i < projectileTrailRef.current.length; i++) {
            ctx.lineTo(projectileTrailRef.current[i].x, projectileTrailRef.current[i].y);
          }
          ctx.stroke();
        }

        // Draw Cannon / Launch Base
        ctx.fillStyle = '#1E1B18';
        ctx.beginPath();
        ctx.arc(originX, groundY - initialHeight * scale, 12, 0, Math.PI * 2);
        ctx.fill();

        // Cannon barrel angled
        ctx.save();
        ctx.translate(originX, groundY - initialHeight * scale);
        ctx.rotate(-rad);
        ctx.fillStyle = '#38332D';
        ctx.fillRect(0, -5, 30, 10);
        ctx.restore();

        // Draw Projectile Ball
        ctx.fillStyle = '#2563EB';
        ctx.beginPath();
        ctx.arc(screenX, screenY, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw Velocity Vectors (Vx and Vy components)
        if (t < tFlight) {
          const curVy = vy0 - gravity * t;
          ctx.strokeStyle = '#16A34A';
          ctx.lineWidth = 2;

          // Vx horizontal arrow
          ctx.beginPath();
          ctx.moveTo(screenX, screenY);
          ctx.lineTo(screenX + vx * 0.8, screenY);
          ctx.stroke();

          // Vy vertical arrow
          ctx.beginPath();
          ctx.moveTo(screenX, screenY);
          ctx.lineTo(screenX, screenY - curVy * 0.8);
          ctx.stroke();
        }

        // In-Canvas HUD overlay
        ctx.fillStyle = '#1E1B18';
        ctx.font = 'bold 12px serif';
        ctx.fillText(`ጊዜ (Time t): ${t.toFixed(2)} ሰከንድ`, 20, 25);
        ctx.fillText(`ከፍታ (Height y): ${Math.max(0, curY).toFixed(1)} m`, 20, 42);
        ctx.fillText(`ርቀት (Distance x): ${curX.toFixed(1)} m`, 20, 59);

        ctx.fillStyle = '#78350F';
        ctx.fillText(`ከፍተኛ ከፍታ (H max): ${maxH.toFixed(1)} m`, canvas.width - 210, 25);
        ctx.fillText(`አጠቃላይ ርቀት (Range R): ${rangeR.toFixed(1)} m`, canvas.width - 210, 42);
        ctx.fillText(`የበረራ ጊዜ (Total Time): ${tFlight.toFixed(2)} s`, canvas.width - 210, 59);
      }

      // ==========================================
      // SIMULATION 2: Simple Pendulum
      // ==========================================
      else if (simType === 'pendulum') {
        const pivotX = canvas.width / 2;
        const pivotY = 55;

        if (isRunning) {
          // Angular acceleration alpha = -(g / L) * sin(theta) - damping * omega
          const gPx = 400; // visual gravity scale
          const alpha = -(gPx / pendulumLength) * Math.sin(pendulumAngleRef.current) - pendulumDamping * pendulumVelRef.current;
          pendulumVelRef.current += alpha * dt;
          pendulumAngleRef.current += pendulumVelRef.current * dt;
        }

        const bobX = pivotX + pendulumLength * Math.sin(pendulumAngleRef.current);
        const bobY = pivotY + pendulumLength * Math.cos(pendulumAngleRef.current);

        // Pivot support bar
        ctx.fillStyle = '#38332D';
        ctx.fillRect(pivotX - 40, pivotY - 8, 80, 8);
        ctx.beginPath();
        ctx.arc(pivotX, pivotY, 5, 0, Math.PI * 2);
        ctx.fill();

        // Pendulum Rod
        ctx.strokeStyle = '#1E1B18';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(pivotX, pivotY);
        ctx.lineTo(bobX, bobY);
        ctx.stroke();

        // Pendulum Bob
        ctx.fillStyle = '#DC2626';
        ctx.beginPath();
        ctx.arc(bobX, bobY, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#38332D';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Bob highlight
        ctx.fillStyle = '#FCA5A5';
        ctx.beginPath();
        ctx.arc(bobX - 4, bobY - 4, 5, 0, Math.PI * 2);
        ctx.fill();

        // Angle arc
        ctx.strokeStyle = '#94A3B8';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(pivotX, pivotY, 40, Math.PI / 2, Math.PI / 2 + pendulumAngleRef.current, pendulumAngleRef.current < 0);
        ctx.stroke();

        const currentDeg = Number(((pendulumAngleRef.current * 180) / Math.PI).toFixed(1));
        const periodT = Number((2 * Math.PI * Math.sqrt((pendulumLength / 20) / 9.8)).toFixed(2));

        // Physics data
        ctx.fillStyle = '#1E1B18';
        ctx.font = 'bold 12px serif';
        ctx.fillText(`ማዕዘን (Angle θ): ${currentDeg}°`, 25, 30);
        ctx.fillText(`የተወዛዋዥ ርዝመት (Length L): ${(pendulumLength / 40).toFixed(2)} m`, 25, 48);
        ctx.fillText(`የተሟላ ዙር ጊዜ (Period T = 2π√(L/g)): ${periodT} s`, 25, 66);
      }

      // ==========================================
      // SIMULATION 3: Wave Interference
      // ==========================================
      else if (simType === 'wave_interference') {
        if (isRunning) {
          simTimeRef.current += dt * waveFrequency * 4;
        }
        const time = simTimeRef.current;
        const cy = canvas.height / 2;
        const s1x = canvas.width / 2 - sourceSeparation / 2;
        const s2x = canvas.width / 2 + sourceSeparation / 2;

        const imgData = ctx.createImageData(canvas.width, canvas.height);
        const data = imgData.data;

        // Sample in a 4px step resolution for smooth 60fps performance
        const step = 4;
        const k = 0.08; // wave number

        for (let y = 0; y < canvas.height; y += step) {
          for (let x = 0; x < canvas.width; x += step) {
            const d1 = Math.sqrt((x - s1x) ** 2 + (y - cy) ** 2);
            const d2 = Math.sqrt((x - s2x) ** 2 + (y - cy) ** 2);

            const wave1 = Math.sin(k * d1 - time);
            const wave2 = Math.sin(k * d2 - time);
            const total = (wave1 + wave2) / 2; // -1 to 1

            // Color: Blue for peaks, Red for troughs, Cream for nodes
            const intensity = Math.floor((total + 1) * 127);
            const r = total > 0 ? 250 - intensity * 0.4 : 50 + intensity;
            const g = total > 0 ? 240 - intensity * 0.3 : 100 + intensity;
            const b = total > 0 ? 230 + intensity * 0.2 : 240;

            for (let dy = 0; dy < step && y + dy < canvas.height; dy++) {
              for (let dx = 0; dx < step && x + dx < canvas.width; dx++) {
                const idx = ((y + dy) * canvas.width + (x + dx)) * 4;
                data[idx] = r;
                data[idx + 1] = g;
                data[idx + 2] = b;
                data[idx + 3] = 255;
              }
            }
          }
        }
        ctx.putImageData(imgData, 0, 0);

        // Highlight coherent wave sources S1 and S2
        ctx.fillStyle = '#DC2626';
        ctx.beginPath();
        ctx.arc(s1x, cy, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#2563EB';
        ctx.beginPath();
        ctx.arc(s2x, cy, 7, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#1E1B18';
        ctx.font = 'bold 12px serif';
        ctx.fillText('ምንጭ 1 (Source S1)', s1x - 45, cy - 14);
        ctx.fillText('ምንጭ 2 (Source S2)', s2x - 45, cy - 14);
        ctx.fillText(`የሞገድ ድግግሞሽ: ${waveFrequency} Hz • የርቀት ልዩነት d = ${sourceSeparation} px`, 20, 25);
      }

      // ==========================================
      // SIMULATION 4: Electric Circuit & Ohm's Law
      // ==========================================
      else if (simType === 'circuit_ohm') {
        if (isRunning) {
          simTimeRef.current += dt * (currentAmp * 1.5 + 0.2);
        }
        const t = simTimeRef.current;

        const left = 90;
        const right = canvas.width - 90;
        const top = 70;
        const bottom = canvas.height - 70;

        // Draw Wires
        ctx.strokeStyle = '#38332D';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(left, top);
        ctx.lineTo(right, top);
        ctx.lineTo(right, bottom);
        ctx.lineTo(left, bottom);
        ctx.closePath();
        ctx.stroke();

        // Battery on Left Wire
        ctx.fillStyle = '#FAF6EC';
        ctx.fillRect(left - 15, (top + bottom) / 2 - 35, 30, 70);
        ctx.strokeStyle = '#1E1B18';
        ctx.lineWidth = 4;
        ctx.strokeRect(left - 12, (top + bottom) / 2 - 30, 24, 60);

        ctx.fillStyle = '#DC2626';
        ctx.fillRect(left - 10, (top + bottom) / 2 - 28, 20, 25);
        ctx.fillStyle = '#1E1B18';
        ctx.fillRect(left - 10, (top + bottom) / 2 + 3, 20, 25);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText('+', left - 4, (top + bottom) / 2 - 12);
        ctx.fillText('-', left - 3, (top + bottom) / 2 + 18);

        ctx.fillStyle = '#1E1B18';
        ctx.font = 'bold 12px serif';
        ctx.fillText(`ባትሪ: ${voltage}V`, left - 32, (top + bottom) / 2 + 48);

        // Resistor on Bottom Wire
        const rx = (left + right) / 2;
        ctx.fillStyle = '#FAF6EC';
        ctx.fillRect(rx - 45, bottom - 15, 90, 30);
        ctx.strokeStyle = '#854D0E';
        ctx.lineWidth = 3;
        ctx.beginPath();
        // Zigzag resistor
        ctx.moveTo(rx - 45, bottom);
        ctx.lineTo(rx - 30, bottom - 10);
        ctx.lineTo(rx - 15, bottom + 10);
        ctx.lineTo(rx, bottom - 10);
        ctx.lineTo(rx + 15, bottom + 10);
        ctx.lineTo(rx + 30, bottom - 10);
        ctx.lineTo(rx + 45, bottom);
        ctx.stroke();

        ctx.fillStyle = '#1E1B18';
        ctx.fillText(`ተቃውሞ (R): ${resistance} Ω`, rx - 45, bottom + 25);

        // Lightbulb on Top Wire
        const bx = (left + right) / 2;
        const by = top;

        // Glow radius proportional to power
        const glowRadius = Math.min(80, 15 + powerWatts * 3);
        const grad = ctx.createRadialGradient(bx, by, 5, bx, by, glowRadius);
        grad.addColorStop(0, `rgba(253, 224, 71, ${Math.min(0.9, 0.2 + powerWatts * 0.15)})`);
        grad.addColorStop(1, 'rgba(253, 224, 71, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(bx, by, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Bulb glass
        ctx.fillStyle = powerWatts > 1 ? '#FEF08A' : '#E2E8F0';
        ctx.strokeStyle = '#38332D';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(bx, by, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#1E1B18';
        ctx.fillText(`መብራት (Lightbulb): ${powerWatts}W`, bx - 60, top - 25);

        // Animated Electrons flowing clockwise around loop
        const perimeter = 2 * (right - left) + 2 * (bottom - top);
        const electronCount = 24;
        ctx.fillStyle = '#0284C7';

        for (let i = 0; i < electronCount; i++) {
          const dist = ((t * 80 + (i * perimeter) / electronCount) % perimeter);
          let ex = 0;
          let ey = 0;

          if (dist < right - left) {
            // Top wire (left to right)
            ex = left + dist;
            ey = top;
          } else if (dist < (right - left) + (bottom - top)) {
            // Right wire (top to bottom)
            ex = right;
            ey = top + (dist - (right - left));
          } else if (dist < 2 * (right - left) + (bottom - top)) {
            // Bottom wire (right to left)
            ex = right - (dist - ((right - left) + (bottom - top)));
            ey = bottom;
          } else {
            // Left wire (bottom to top)
            ex = left;
            ey = bottom - (dist - (2 * (right - left) + (bottom - top)));
          }

          ctx.beginPath();
          ctx.arc(ex, ey, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Ohm's Law formula badge
        ctx.fillStyle = '#1E1B18';
        ctx.font = 'bold 13px serif';
        ctx.fillText(`የኦህም ህግ (Ohm's Law): V = I × R`, 20, 25);
        ctx.fillStyle = '#0369A1';
        ctx.fillText(`የኤሌክትሪክ ፍሰት (Current I = V / R): ${currentAmp} A`, 20, 44);
        ctx.fillStyle = '#B45309';
        ctx.fillText(`የኤሌክትሪክ ሃይል (Power P = V × I): ${powerWatts} W`, 20, 63);
      }

      // ==========================================
      // SIMULATION 5: Photosynthesis & Cellular Respiration
      // ==========================================
      else if (simType === 'photosynthesis') {
        if (isRunning) {
          simTimeRef.current += dt * 1.5;
        }
        const t = simTimeRef.current;
        const cy = canvas.height / 2;

        // Chloroplast Cell in center
        ctx.fillStyle = '#DCFCE7';
        ctx.strokeStyle = '#15803D';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(canvas.width / 2, cy, 140, 90, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#166534';
        ctx.font = 'bold 13px serif';
        ctx.fillText('ክሎሮፕላስት (Chloroplast)', canvas.width / 2 - 65, cy - 10);
        ctx.font = '11px serif';
        ctx.fillText('የፎቶሲንተሲስ ማዕከል', canvas.width / 2 - 50, cy + 10);

        // Sunlight Beams from top-left
        ctx.strokeStyle = '#FACC15';
        ctx.lineWidth = 3;
        const sunX = 40;
        const sunY = 40;
        ctx.fillStyle = '#FBBF24';
        ctx.beginPath();
        ctx.arc(sunX, sunY, 20, 0, Math.PI * 2);
        ctx.fill();

        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
          ctx.beginPath();
          ctx.moveTo(sunX + Math.cos(angle) * 24, sunY + Math.sin(angle) * 24);
          ctx.lineTo(sunX + Math.cos(angle) * 34, sunY + Math.sin(angle) * 34);
          ctx.stroke();
        }

        // Animated Input Molecules: CO2 + H2O moving in from left
        const inProgress = (t % 3) / 3;
        const inX = 90 + inProgress * (canvas.width / 2 - 140 - 90);

        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.arc(inX, cy - 30, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#1E1B18';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText('CO₂', inX - 9, cy - 42);

        ctx.fillStyle = '#0284C7';
        ctx.beginPath();
        ctx.arc(inX, cy + 30, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#1E1B18';
        ctx.fillText('H₂O', inX - 9, cy + 45);

        // Animated Output Molecules: Glucose (C6H12O6) + O2 moving out to right
        const outX = canvas.width / 2 + 140 + inProgress * 110;
        ctx.fillStyle = '#EA580C';
        ctx.beginPath();
        ctx.arc(outX, cy - 25, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#1E1B18';
        ctx.fillText('C₆H₁₂O₆ (Glucose)', outX - 25, cy - 40);

        ctx.fillStyle = '#16A34A';
        ctx.beginPath();
        ctx.arc(outX, cy + 25, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#1E1B18';
        ctx.fillText('O₂ (ኦክስጅን)', outX - 15, cy + 42);

        // Overall Reaction Formula Header
        ctx.fillStyle = '#14532D';
        ctx.font = 'bold 13px serif';
        ctx.fillText('የፎቶሲንተሲስ ቀመር፡ 6CO₂ + 6H₂O + የፀሐይ ብርሃን ➔ C₆H₁₂O₆ + 6O₂', 20, 25);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [
    simType,
    isRunning,
    launchSpeed,
    launchAngle,
    gravity,
    initialHeight,
    pendulumLength,
    pendulumDamping,
    waveFrequency,
    sourceSeparation,
    voltage,
    resistance,
    currentAmp,
    powerWatts,
  ]);

  return (
    <div className="bg-[#FAF6EC] border-[1.5px] border-[#38332D] rounded-xl overflow-hidden shadow-sm flex flex-col">
      {/* Simulation Selector Bar */}
      <div className="bg-[#EDE6D4] px-4 py-2.5 border-b-[1.5px] border-[#38332D] flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSimType('projectile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-serif-ethiopic transition-all cursor-pointer ${
              simType === 'projectile'
                ? 'bg-[#1E1B18] text-[#FAF6EC] shadow-2xs'
                : 'bg-[#FAF6EC] text-[#38332D] hover:bg-[#E3DAC4] border border-[#38332D]/30'
            }`}
          >
            🚀 ፕሮጀክትይል ሞሽን (Projectile)
          </button>
          <button
            onClick={() => setSimType('pendulum')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-serif-ethiopic transition-all cursor-pointer ${
              simType === 'pendulum'
                ? 'bg-[#1E1B18] text-[#FAF6EC] shadow-2xs'
                : 'bg-[#FAF6EC] text-[#38332D] hover:bg-[#E3DAC4] border border-[#38332D]/30'
            }`}
          >
            ⏱️ ፔንዱለም ወላዋይ (Pendulum)
          </button>
          <button
            onClick={() => setSimType('wave_interference')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-serif-ethiopic transition-all cursor-pointer ${
              simType === 'wave_interference'
                ? 'bg-[#1E1B18] text-[#FAF6EC] shadow-2xs'
                : 'bg-[#FAF6EC] text-[#38332D] hover:bg-[#E3DAC4] border border-[#38332D]/30'
            }`}
          >
            🌊 የሞገድ መደራረብ (Wave Interference)
          </button>
          <button
            onClick={() => setSimType('circuit_ohm')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-serif-ethiopic transition-all cursor-pointer ${
              simType === 'circuit_ohm'
                ? 'bg-[#1E1B18] text-[#FAF6EC] shadow-2xs'
                : 'bg-[#FAF6EC] text-[#38332D] hover:bg-[#E3DAC4] border border-[#38332D]/30'
            }`}
          >
            ⚡ የኦህም ህግ ሰርኪዩት (Ohm's Circuit)
          </button>
          <button
            onClick={() => setSimType('photosynthesis')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-serif-ethiopic transition-all cursor-pointer ${
              simType === 'photosynthesis'
                ? 'bg-[#1E1B18] text-[#FAF6EC] shadow-2xs'
                : 'bg-[#FAF6EC] text-[#38332D] hover:bg-[#E3DAC4] border border-[#38332D]/30'
            }`}
          >
            🌿 ፎቶሲንተሲስ (Photosynthesis)
          </button>
        </div>

        {/* Play/Pause/Reset Action controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-[#1E1B18] text-[#FAF6EC] hover:bg-[#38332D] text-xs font-bold flex items-center gap-1 cursor-pointer"
            title={isRunning ? 'አፍታ አቁም (Pause)' : 'አስጀምር (Play)'}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5 text-amber-300" /> : <Play className="w-3.5 h-3.5 text-emerald-300" />}
            <span className="hidden sm:inline font-serif-ethiopic">{isRunning ? 'አቁም' : 'ቀጥል'}</span>
          </button>

          <button
            onClick={handleReset}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-[#FAF6EC] text-[#1E1B18] border border-[#38332D]/40 hover:bg-[#E3DAC4] text-xs font-bold flex items-center gap-1 cursor-pointer"
            title="እንደገና ጀምር (Reset)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-serif-ethiopic">ዳግም ጀምር</span>
          </button>
        </div>
      </div>

      {/* Main Canvas & Sliders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3">
        {/* Canvas Display */}
        <div className="lg:col-span-2 p-2 sm:p-3 bg-[#FAF6EC] border-b lg:border-b-0 lg:border-r-[1.5px] border-[#38332D] flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={620}
            height={400}
            className="w-full max-w-full h-auto bg-[#FAF6EC] rounded-lg border border-[#38332D]/30 shadow-2xs"
          />
        </div>

        {/* Interactive Parameter Sliders */}
        <div className="p-4 sm:p-5 bg-[#FAF6EC] space-y-4 overflow-y-auto max-h-[460px]">
          <div className="flex items-center gap-1.5 border-b border-[#38332D]/20 pb-2">
            <Sliders className="w-4 h-4 text-amber-800" />
            <h3 className="font-bold text-xs sm:text-sm font-serif-ethiopic text-[#1E1B18]">
              የማስመሰያው መቆጣጠሪያዎች (Simulation Parameters)
            </h3>
          </div>

          {/* Controls for Projectile */}
          {simType === 'projectile' && (
            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs font-bold font-sans">
                  <span>የመነሻ ፍጥነት (Speed v₀):</span>
                  <span className="text-blue-700 font-black">{launchSpeed} m/s</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="70"
                  step="1"
                  value={launchSpeed}
                  onChange={(e) => setLaunchSpeed(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold font-sans">
                  <span>የማስወንጨፊያ ማዕዘን (Angle θ):</span>
                  <span className="text-blue-700 font-black">{launchAngle}°</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="85"
                  step="1"
                  value={launchAngle}
                  onChange={(e) => setLaunchAngle(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <span className="text-[10px] text-[#665C4D]">
                  💡 45° ከፍተኛውን አግድም ርቀት (Maximum Range) ያስገኛል።
                </span>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold font-sans">
                  <span>የስበት ማጣደፍ (Gravity g):</span>
                  <span className="text-blue-700 font-black">{gravity} m/s²</span>
                </div>
                <input
                  type="range"
                  min="1.6"
                  max="25"
                  step="0.2"
                  value={gravity}
                  onChange={(e) => setGravity(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <span className="text-[10px] text-[#665C4D]">
                  ምድር = 9.8 m/s² • ጨረቃ = 1.6 m/s² • ጁፒተር = 24.8 m/s²
                </span>
              </div>
            </div>
          )}

          {/* Controls for Pendulum */}
          {simType === 'pendulum' && (
            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs font-bold font-sans">
                  <span>የገመድ ርዝመት (Length L):</span>
                  <span className="text-red-700 font-black">{(pendulumLength / 40).toFixed(2)} m</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="260"
                  step="5"
                  value={pendulumLength}
                  onChange={(e) => setPendulumLength(parseFloat(e.target.value))}
                  className="w-full accent-red-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold font-sans">
                  <span>የመነሻ ማዕዘን (Initial θ):</span>
                  <span className="text-red-700 font-black">{pendulumAngleInit}°</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="75"
                  step="5"
                  value={pendulumAngleInit}
                  onChange={(e) => setPendulumAngleInit(parseFloat(e.target.value))}
                  className="w-full accent-red-600 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Controls for Wave Interference */}
          {simType === 'wave_interference' && (
            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs font-bold font-sans">
                  <span>ድግግሞሽ (Frequency):</span>
                  <span className="text-sky-700 font-black">{waveFrequency} Hz</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.5"
                  value={waveFrequency}
                  onChange={(e) => setWaveFrequency(parseFloat(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold font-sans">
                  <span>የርቀት ልዩነት (Separation d):</span>
                  <span className="text-sky-700 font-black">{sourceSeparation} px</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="240"
                  step="10"
                  value={sourceSeparation}
                  onChange={(e) => setSourceSeparation(parseFloat(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Controls for Circuit */}
          {simType === 'circuit_ohm' && (
            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs font-bold font-sans">
                  <span>የቮልቴጅ መጠን (Voltage V):</span>
                  <span className="text-amber-700 font-black">{voltage} V</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="24"
                  step="1"
                  value={voltage}
                  onChange={(e) => setVoltage(parseFloat(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold font-sans">
                  <span>ተቃውሞ (Resistance R):</span>
                  <span className="text-amber-700 font-black">{resistance} Ω</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="50"
                  step="1"
                  value={resistance}
                  onChange={(e) => setResistance(parseFloat(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>

              <div className="bg-[#EDE6D4] p-3 rounded-lg border border-[#38332D]/30 text-xs font-serif-ethiopic space-y-1">
                <p>
                  <strong>የኤሌክትሪክ ፍሰት (Current):</strong> {currentAmp} A
                </p>
                <p>
                  <strong>የመብራቱ ብሩህነት (Power):</strong> {powerWatts} W
                </p>
              </div>
            </div>
          )}

          {/* Controls for Photosynthesis */}
          {simType === 'photosynthesis' && (
            <div className="space-y-3 text-xs font-serif-ethiopic">
              <p className="leading-relaxed text-[#38332D]">
                በእፅዋት ሕዋስ ውስጥ ክሎሮፕላስት የፀሐይ ብርሃንን በመጠቀም ካርቦን ዳይኦክሳይድ (CO₂) እና ውሃ (H₂O) ወደ ግሉኮስ ምግብ እና ኦክስጅን ጋዝ ይለውጣል።
              </p>
              <div className="p-3 bg-[#EDE6D4] rounded-lg border border-[#38332D]/30 space-y-1.5">
                <div className="font-bold text-[#14532D]">የተከናወነው ተግባር፡</div>
                <div>1. የብርሃን ሃይል ወደ ኬሚካል ሃይል ተቀየረ።</div>
                <div>2. ATP እና NADPH ተመረተ።</div>
                <div>3. ካልቪን ዑደት (Calvin Cycle) ግሉኮስን አዘጋጀ።</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
