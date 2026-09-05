import React, { useEffect, useRef, useState, useMemo } from 'react';
import Plotly from 'plotly.js-dist-min';
import { RefreshCw, Maximize2, Sliders, Info, Eye, Layers } from 'lucide-react';

export type GraphMode = 'quadratic' | 'trigonometric' | 'polynomial' | 'vector_3d' | 'surface_3d' | 'custom_equation';

interface PlotlyGraphVisualizerProps {
  initialMode?: GraphMode;
  topicTitle?: string;
  subjectName?: string;
  grade?: number;
}

export const PlotlyGraphVisualizer: React.FC<PlotlyGraphVisualizerProps> = ({
  initialMode = 'quadratic',
  topicTitle = 'Quadratic Functions',
  subjectName = 'Mathematics',
  grade = 10,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<GraphMode>(initialMode);

  // Parameters for 2D Quadratic: f(x) = a*x^2 + b*x + c
  const [paramA, setParamA] = useState<number>(1);
  const [paramB, setParamB] = useState<number>(-2);
  const [paramC, setParamC] = useState<number>(-3);

  // Parameters for 2D Trig: f(x) = A * sin(B*x + C) + D
  const [amp, setAmp] = useState<number>(2);
  const [freq, setFreq] = useState<number>(1);
  const [phase, setPhase] = useState<number>(0);
  const [vShift, setVShift] = useState<number>(0);

  // Parameters for 3D Vector: Vector U and V
  const [vecUx, setVecUx] = useState<number>(3);
  const [vecUy, setVecUy] = useState<number>(4);
  const [vecUz, setVecUz] = useState<number>(5);

  const [vecVx, setVecVx] = useState<number>(-2);
  const [vecVy, setVecVy] = useState<number>(3);
  const [vecVz, setVecVz] = useState<number>(1);

  // 3D Surface parameter (wave frequency / curvature)
  const [surfaceK, setSurfaceK] = useState<number>(1.2);
  const [surfaceType, setSurfaceType] = useState<'saddle' | 'paraboloid' | 'electric_potential'>('paraboloid');

  // Quadratic Calculations
  const discriminant = useMemo(() => {
    return paramB * paramB - 4 * paramA * paramC;
  }, [paramA, paramB, paramC]);

  const vertex = useMemo(() => {
    if (paramA === 0) return { x: 0, y: paramC };
    const vx = -paramB / (2 * paramA);
    const vy = paramA * vx * vx + paramB * vx + paramC;
    return { x: Number(vx.toFixed(3)), y: Number(vy.toFixed(3)) };
  }, [paramA, paramB, paramC]);

  const roots = useMemo(() => {
    if (paramA === 0) {
      if (paramB === 0) return [];
      return [Number((-paramC / paramB).toFixed(3))];
    }
    if (discriminant < 0) return [];
    if (discriminant === 0) {
      return [Number((-paramB / (2 * paramA)).toFixed(3))];
    }
    const sqrtD = Math.sqrt(discriminant);
    const r1 = (-paramB + sqrtD) / (2 * paramA);
    const r2 = (-paramB - sqrtD) / (2 * paramA);
    return [Number(Math.min(r1, r2).toFixed(3)), Number(Math.max(r1, r2).toFixed(3))];
  }, [paramA, paramB, paramC, discriminant]);

  // Vector 3D calculations
  const vectorMagU = useMemo(() => {
    return Number(Math.sqrt(vecUx * vecUx + vecUy * vecUy + vecUz * vecUz).toFixed(2));
  }, [vecUx, vecUy, vecUz]);

  const vectorDot = useMemo(() => {
    return Number((vecUx * vecVx + vecUy * vecVy + vecUz * vecVz).toFixed(2));
  }, [vecUx, vecUy, vecUz, vecVx, vecVy, vecVz]);

  const vectorCross = useMemo(() => {
    return {
      x: Number((vecUy * vecVz - vecUz * vecVy).toFixed(2)),
      y: Number((vecUz * vecVx - vecUx * vecVz).toFixed(2)),
      z: Number((vecUx * vecVy - vecUy * vecVx).toFixed(2)),
    };
  }, [vecUx, vecUy, vecUz, vecVx, vecVy, vecVz]);

  // Build Plotly Data and Layout based on active mode
  useEffect(() => {
    if (!containerRef.current) return;

    let plotData: Plotly.Data[] = [];
    let plotLayout: Partial<Plotly.Layout> = {};

    if (mode === 'quadratic') {
      const xs: number[] = [];
      const ys: number[] = [];
      const range = 8;
      const step = 0.1;
      for (let x = -range; x <= range; x += step) {
        xs.push(Number(x.toFixed(2)));
        ys.push(paramA * x * x + paramB * x + paramC);
      }

      plotData.push({
        x: xs,
        y: ys,
        mode: 'lines',
        name: `f(x) = ${paramA}x² ${paramB >= 0 ? '+' : ''}${paramB}x ${paramC >= 0 ? '+' : ''}${paramC}`,
        line: { color: '#2563EB', width: 3.5 },
      });

      // Highlight Vertex
      plotData.push({
        x: [vertex.x],
        y: [vertex.y],
        mode: 'markers+text',
        name: 'Vertex (ጫፍ)',
        marker: { color: '#DC2626', size: 11, symbol: 'diamond' },
        text: [`(${vertex.x}, ${vertex.y})`],
        textposition: vertex.y >= 0 ? 'top center' : 'bottom center',
      });

      // Highlight Real Roots if any
      if (roots.length > 0) {
        plotData.push({
          x: roots,
          y: roots.map(() => 0),
          mode: 'markers+text',
          name: 'Roots / X-intercepts (ስሮች)',
          marker: { color: '#16A34A', size: 10, symbol: 'circle' },
          text: roots.map((r) => `x = ${r}`),
          textposition: 'top center',
        });
      }

      plotLayout = {
        title: {
          text: `<b>የኳድራቲክ ፈንክሽን ግራፍ፡</b> f(x) = ${paramA}x² ${paramB >= 0 ? '+' : ''}${paramB}x ${paramC >= 0 ? '+' : ''}${paramC}`,
          font: { family: 'serif', size: 15, color: '#1E1B18' },
        },
        paper_bgcolor: '#FAF6EC',
        plot_bgcolor: '#FFFFFF',
        font: { family: 'serif', color: '#1E1B18' },
        xaxis: {
          title: 'x',
          zeroline: true,
          zerolinecolor: '#38332D',
          zerolinewidth: 2,
          gridcolor: '#EDE6D4',
          range: [-7, 7],
        },
        yaxis: {
          title: 'f(x)',
          zeroline: true,
          zerolinecolor: '#38332D',
          zerolinewidth: 2,
          gridcolor: '#EDE6D4',
          range: [-10, 15],
        },
        margin: { l: 45, r: 25, t: 45, b: 40 },
        showlegend: true,
        legend: { orientation: 'h', y: -0.2 },
      };
    } else if (mode === 'trigonometric') {
      const xs: number[] = [];
      const ysSin: number[] = [];
      const ysCos: number[] = [];
      const step = 0.05;
      for (let x = -2 * Math.PI; x <= 2 * Math.PI; x += step) {
        xs.push(Number(x.toFixed(2)));
        ysSin.push(amp * Math.sin(freq * x + phase) + vShift);
        ysCos.push(amp * Math.cos(freq * x + phase) + vShift);
      }

      plotData.push({
        x: xs,
        y: ysSin,
        mode: 'lines',
        name: `f(x) = ${amp} sin(${freq}x ${phase >= 0 ? '+' : ''}${phase.toFixed(1)})`,
        line: { color: '#0284C7', width: 3 },
      });

      plotData.push({
        x: xs,
        y: ysCos,
        mode: 'lines',
        name: `g(x) = ${amp} cos(${freq}x ${phase >= 0 ? '+' : ''}${phase.toFixed(1)})`,
        line: { color: '#E11D48', width: 2, dash: 'dot' },
      });

      plotLayout = {
        title: {
          text: `<b>የትሪጎኖሜትሪክ ሞገድ ግራፍ (Trigonometric Waveforms)</b>`,
          font: { family: 'serif', size: 15, color: '#1E1B18' },
        },
        paper_bgcolor: '#FAF6EC',
        plot_bgcolor: '#FFFFFF',
        font: { family: 'serif', color: '#1E1B18' },
        xaxis: {
          title: 'Angle x (Radians: -2π to 2π)',
          zeroline: true,
          zerolinecolor: '#38332D',
          gridcolor: '#EDE6D4',
        },
        yaxis: {
          title: 'Amplitude',
          zeroline: true,
          zerolinecolor: '#38332D',
          gridcolor: '#EDE6D4',
          range: [-Math.max(4, amp + 1), Math.max(4, amp + 1)],
        },
        margin: { l: 45, r: 25, t: 45, b: 40 },
        showlegend: true,
        legend: { orientation: 'h', y: -0.2 },
      };
    } else if (mode === 'vector_3d') {
      // 3D Vectors Origin to (Ux, Uy, Uz) and (Vx, Vy, Vz)
      plotData.push({
        type: 'scatter3d',
        mode: 'lines+markers+text',
        x: [0, vecUx],
        y: [0, vecUy],
        z: [0, vecUz],
        name: `Vector U (${vecUx}, ${vecUy}, ${vecUz})`,
        line: { color: '#2563EB', width: 7 },
        marker: { size: [4, 7], color: '#2563EB' },
        text: ['', `U (${vecUx}, ${vecUy}, ${vecUz})`],
        textposition: 'top center',
      } as any);

      plotData.push({
        type: 'scatter3d',
        mode: 'lines+markers+text',
        x: [0, vecVx],
        y: [0, vecVy],
        z: [0, vecVz],
        name: `Vector V (${vecVx}, ${vecVy}, ${vecVz})`,
        line: { color: '#DC2626', width: 7 },
        marker: { size: [4, 7], color: '#DC2626' },
        text: ['', `V (${vecVx}, ${vecVy}, ${vecVz})`],
        textposition: 'top center',
      } as any);

      // Resultant U x V (Cross Product Vector)
      plotData.push({
        type: 'scatter3d',
        mode: 'lines+markers+text',
        x: [0, vectorCross.x],
        y: [0, vectorCross.y],
        z: [0, vectorCross.z],
        name: `U × V Cross Product (${vectorCross.x}, ${vectorCross.y}, ${vectorCross.z})`,
        line: { color: '#16A34A', width: 6, dash: 'dash' },
        marker: { size: [3, 6], color: '#16A34A' },
        text: ['', 'U × V'],
        textposition: 'top center',
      } as any);

      plotLayout = {
        title: {
          text: `<b>3D ቬክተሮች እና የቬክተር ብዜት (3D Vectors & Cross Product)</b>`,
          font: { family: 'serif', size: 15, color: '#1E1B18' },
        },
        paper_bgcolor: '#FAF6EC',
        scene: {
          xaxis: { title: 'X Axis', gridcolor: '#D1C7B7' },
          yaxis: { title: 'Y Axis', gridcolor: '#D1C7B7' },
          zaxis: { title: 'Z Axis', gridcolor: '#D1C7B7' },
          camera: {
            eye: { x: 1.5, y: 1.5, z: 1.2 },
          },
        },
        margin: { l: 0, r: 0, t: 40, b: 20 },
      };
    } else if (mode === 'surface_3d') {
      const size = 30;
      const xVals: number[] = [];
      const yVals: number[] = [];
      const zVals: number[][] = [];

      for (let i = 0; i < size; i++) {
        const x = -3 + (6 * i) / (size - 1);
        xVals.push(Number(x.toFixed(2)));
      }
      for (let j = 0; j < size; j++) {
        const y = -3 + (6 * j) / (size - 1);
        yVals.push(Number(y.toFixed(2)));
      }

      for (let i = 0; i < size; i++) {
        const row: number[] = [];
        const x = xVals[i];
        for (let j = 0; j < size; j++) {
          const y = yVals[j];
          let z = 0;
          if (surfaceType === 'saddle') {
            z = surfaceK * (x * x - y * y);
          } else if (surfaceType === 'electric_potential') {
            const r1 = Math.sqrt((x - 1) ** 2 + y ** 2 + 0.5);
            const r2 = Math.sqrt((x + 1) ** 2 + y ** 2 + 0.5);
            z = surfaceK * (1 / r1 - 1 / r2);
          } else {
            // Paraboloid
            z = surfaceK * (x * x + y * y);
          }
          row.push(Number(z.toFixed(3)));
        }
        zVals.push(row);
      }

      plotData.push({
        type: 'surface',
        x: xVals,
        y: yVals,
        z: zVals,
        colorscale: surfaceType === 'electric_potential' ? 'Electric' : 'Viridis',
        contours: {
          z: { show: true, usecolormap: true, highlightcolor: '#42f4eb', project: { z: true } },
        },
      } as any);

      plotLayout = {
        title: {
          text: `<b>የ3D ገጽታ እይታ (3D Surface Visualizer - ${surfaceType.toUpperCase()})</b>`,
          font: { family: 'serif', size: 15, color: '#1E1B18' },
        },
        paper_bgcolor: '#FAF6EC',
        scene: {
          xaxis: { title: 'X' },
          yaxis: { title: 'Y' },
          zaxis: { title: 'Z' },
        },
        margin: { l: 0, r: 0, t: 40, b: 20 },
      };
    }

    Plotly.newPlot(containerRef.current, plotData, plotLayout, {
      responsive: true,
      displayModeBar: true,
      modeBarButtonsToRemove: ['lasso2d', 'select2d'],
    });

    const handleResize = () => {
      if (containerRef.current) {
        Plotly.Plots.resize(containerRef.current);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [
    mode,
    paramA,
    paramB,
    paramC,
    vertex,
    roots,
    amp,
    freq,
    phase,
    vShift,
    vecUx,
    vecUy,
    vecUz,
    vecVx,
    vecVy,
    vecVz,
    vectorCross,
    surfaceK,
    surfaceType,
  ]);

  return (
    <div className="bg-[#FAF6EC] border-[1.5px] border-[#38332D] rounded-xl overflow-hidden shadow-sm flex flex-col">
      {/* Sub-toolbar */}
      <div className="bg-[#EDE6D4] px-4 py-2.5 border-b-[1.5px] border-[#38332D] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setMode('quadratic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-serif-ethiopic transition-all cursor-pointer ${
              mode === 'quadratic'
                ? 'bg-[#1E1B18] text-[#FAF6EC] shadow-2xs'
                : 'bg-[#FAF6EC] text-[#38332D] hover:bg-[#E3DAC4] border border-[#38332D]/30'
            }`}
          >
            📐 ኳድራቲክ ፈንክሽን (2D Parabola)
          </button>
          <button
            onClick={() => setMode('trigonometric')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-serif-ethiopic transition-all cursor-pointer ${
              mode === 'trigonometric'
                ? 'bg-[#1E1B18] text-[#FAF6EC] shadow-2xs'
                : 'bg-[#FAF6EC] text-[#38332D] hover:bg-[#E3DAC4] border border-[#38332D]/30'
            }`}
          >
            🌊 ሳይን እና ኮሳይን (Trig Waves)
          </button>
          <button
            onClick={() => setMode('vector_3d')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-serif-ethiopic transition-all cursor-pointer ${
              mode === 'vector_3d'
                ? 'bg-[#1E1B18] text-[#FAF6EC] shadow-2xs'
                : 'bg-[#FAF6EC] text-[#38332D] hover:bg-[#E3DAC4] border border-[#38332D]/30'
            }`}
          >
            🧭 3D ቬክተር ስሌት (Vectors & Cross Product)
          </button>
          <button
            onClick={() => setMode('surface_3d')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-serif-ethiopic transition-all cursor-pointer ${
              mode === 'surface_3d'
                ? 'bg-[#1E1B18] text-[#FAF6EC] shadow-2xs'
                : 'bg-[#FAF6EC] text-[#38332D] hover:bg-[#E3DAC4] border border-[#38332D]/30'
            }`}
          >
            🌐 3D ሰርፌስ እና ሜዳ (3D Surfaces)
          </button>
        </div>

        <div className="text-[11px] text-[#5A5143] font-sans font-bold flex items-center gap-1">
          <Eye className="w-3.5 h-3.5 text-amber-700" />
          <span>Interactive Plotly.js Engine</span>
        </div>
      </div>

      {/* Main Plot Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[440px]">
        {/* Plot Graph on Left 2 Cols */}
        <div className="lg:col-span-2 p-2 sm:p-3 bg-[#FFFFFF] border-b lg:border-b-0 lg:border-r-[1.5px] border-[#38332D] relative flex flex-col justify-center">
          <div ref={containerRef} className="w-full h-[380px] sm:h-[440px]" />
        </div>

        {/* Sliders and Live Calculations on Right Col */}
        <div className="p-4 sm:p-5 bg-[#FAF6EC] space-y-4 overflow-y-auto max-h-[500px]">
          <div className="flex items-center gap-1.5 border-b border-[#38332D]/20 pb-2">
            <Sliders className="w-4 h-4 text-amber-800" />
            <h3 className="font-bold text-xs sm:text-sm font-serif-ethiopic text-[#1E1B18]">
              የመለኪያዎች ማስተካከያ (Interactive Controls)
            </h3>
          </div>

          {/* Controls for Quadratic Mode */}
          {mode === 'quadratic' && (
            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs font-bold font-sans">
                  <span>Parameter a (Curvature):</span>
                  <span className="text-blue-700 font-black">{paramA}</span>
                </div>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.2"
                  value={paramA}
                  onChange={(e) => setParamA(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <span className="text-[10px] text-[#665C4D]">
                  {paramA > 0 ? 'ወደ ላይ የሚከፈት (Minimum)' : paramA < 0 ? 'ወደ ታች የሚከፈት (Maximum)' : 'ቀጥተኛ መስመር'}
                </span>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold font-sans">
                  <span>Parameter b (Slope at y-intercept):</span>
                  <span className="text-blue-700 font-black">{paramB}</span>
                </div>
                <input
                  type="range"
                  min="-6"
                  max="6"
                  step="0.5"
                  value={paramB}
                  onChange={(e) => setParamB(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold font-sans">
                  <span>Parameter c (Y-intercept):</span>
                  <span className="text-blue-700 font-black">{paramC}</span>
                </div>
                <input
                  type="range"
                  min="-8"
                  max="8"
                  step="0.5"
                  value={paramC}
                  onChange={(e) => setParamC(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Real-time Math Diagnostics */}
              <div className="bg-[#EDE6D4] border border-[#38332D]/30 rounded-xl p-3 space-y-2 text-xs font-serif-ethiopic">
                <div className="font-bold text-[#1E1B18] border-b border-[#38332D]/20 pb-1 flex justify-between items-center">
                  <span>የስሌት ውጤቶች (Live Diagnostics)</span>
                  <span className="text-[10px] font-sans px-1.5 py-0.5 bg-amber-200 text-amber-900 rounded-sm">
                    D = {discriminant}
                  </span>
                </div>

                <div className="text-[11px] space-y-1 text-[#332C24]">
                  <p>
                    <strong>የጫፍ ነጥብ (Vertex):</strong> ({vertex.x}, {vertex.y})
                  </p>
                  <p>
                    <strong>የዲሰክሪሚናንት ተፈጥሮ:</strong>{' '}
                    {discriminant > 0 ? (
                      <span className="text-emerald-700 font-bold">2 የተለያዩ እውነተኛ ስሮች (2 Real Roots)</span>
                    ) : discriminant === 0 ? (
                      <span className="text-amber-700 font-bold">1 ተደጋጋሚ ስር (1 Repeated Root)</span>
                    ) : (
                      <span className="text-rose-700 font-bold">እውነተኛ ስሮች የሉትም (No Real Roots, Complex)</span>
                    )}
                  </p>
                  {roots.length > 0 && (
                    <p>
                      <strong>ስሮች (X-intercepts):</strong> {roots.join(' እና ')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Controls for Trig Mode */}
          {mode === 'trigonometric' && (
            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs font-bold font-sans">
                  <span>Amplitude (A):</span>
                  <span className="text-sky-700 font-black">{amp}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="4"
                  step="0.25"
                  value={amp}
                  onChange={(e) => setAmp(parseFloat(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold font-sans">
                  <span>Frequency / Period factor (B):</span>
                  <span className="text-sky-700 font-black">{freq}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.25"
                  value={freq}
                  onChange={(e) => setFreq(parseFloat(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
                <span className="text-[10px] text-[#665C4D]">
                  ወቅት (Period T) = {( (2 * Math.PI) / freq ).toFixed(2)} radians
                </span>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold font-sans">
                  <span>Phase Shift (C):</span>
                  <span className="text-sky-700 font-black">{phase.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="-3.14"
                  max="3.14"
                  step="0.1"
                  value={phase}
                  onChange={(e) => setPhase(parseFloat(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Controls for 3D Vector Mode */}
          {mode === 'vector_3d' && (
            <div className="space-y-3 text-xs">
              <div className="bg-[#EDE6D4] p-3 rounded-lg border border-[#38332D]/30 space-y-2">
                <span className="font-bold font-serif-ethiopic text-blue-900 block">
                  🔵 ቬክተር U (Vector U):
                </span>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <span className="text-[10px] font-bold">X: {vecUx}</span>
                    <input
                      type="range"
                      min="-5"
                      max="5"
                      value={vecUx}
                      onChange={(e) => setVecUx(parseInt(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold">Y: {vecUy}</span>
                    <input
                      type="range"
                      min="-5"
                      max="5"
                      value={vecUy}
                      onChange={(e) => setVecUy(parseInt(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold">Z: {vecUz}</span>
                    <input
                      type="range"
                      min="-5"
                      max="5"
                      value={vecUz}
                      onChange={(e) => setVecUz(parseInt(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-[#EDE6D4] p-3 rounded-lg border border-[#38332D]/30 space-y-2">
                <span className="font-bold font-serif-ethiopic text-rose-900 block">
                  🔴 ቬክተር V (Vector V):
                </span>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <span className="text-[10px] font-bold">X: {vecVx}</span>
                    <input
                      type="range"
                      min="-5"
                      max="5"
                      value={vecVx}
                      onChange={(e) => setVecVx(parseInt(e.target.value))}
                      className="w-full accent-rose-600"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold">Y: {vecVy}</span>
                    <input
                      type="range"
                      min="-5"
                      max="5"
                      value={vecVy}
                      onChange={(e) => setVecVy(parseInt(e.target.value))}
                      className="w-full accent-rose-600"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold">Z: {vecVz}</span>
                    <input
                      type="range"
                      min="-5"
                      max="5"
                      value={vecVz}
                      onChange={(e) => setVecVz(parseInt(e.target.value))}
                      className="w-full accent-rose-600"
                    />
                  </div>
                </div>
              </div>

              {/* Vector Product Analytics */}
              <div className="p-3 bg-[#FAF6EC] border border-[#38332D]/30 rounded-lg space-y-1 font-serif-ethiopic text-[11px]">
                <p>
                  <strong>|U| የቬክተር U ርዝመት:</strong> {vectorMagU}
                </p>
                <p>
                  <strong>U • V ነጥብ ብዜት (Dot Product):</strong> {vectorDot}
                </p>
                <p className="text-emerald-800 font-bold">
                  <strong>U × V መስቀለኛ ብዜት:</strong> ({vectorCross.x}, {vectorCross.y}, {vectorCross.z})
                </p>
              </div>
            </div>
          )}

          {/* Controls for 3D Surface Mode */}
          {mode === 'surface_3d' && (
            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-bold block mb-1 font-serif-ethiopic">የገጽታ አይነት (Surface Type):</label>
                <div className="flex flex-col gap-1 text-xs font-serif-ethiopic">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="surface"
                      checked={surfaceType === 'paraboloid'}
                      onChange={() => setSurfaceType('paraboloid')}
                    />
                    <span>ፓራቦሎይድ (Paraboloid z = x² + y²)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="surface"
                      checked={surfaceType === 'saddle'}
                      onChange={() => setSurfaceType('saddle')}
                    />
                    <span>የኮርቻ ቅርፅ (Hyperbolic Saddle z = x² - y²)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="surface"
                      checked={surfaceType === 'electric_potential'}
                      onChange={() => setSurfaceType('electric_potential')}
                    />
                    <span>የኤሌክትሪክ ፖቴንሻል ሜዳ (Electric Dipole Potential)</span>
                  </label>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold font-sans">
                  <span>Curvature Factor:</span>
                  <span>{surfaceK}</span>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="2.5"
                  step="0.1"
                  value={surfaceK}
                  onChange={(e) => setSurfaceK(parseFloat(e.target.value))}
                  className="w-full accent-amber-700 cursor-pointer"
                />
              </div>

              <p className="text-[11px] text-[#5A5143] font-serif-ethiopic bg-[#EDE6D4] p-2.5 rounded-lg border border-[#38332D]/30">
                💡 <strong>ጠቃሚ ምክር፡</strong> በግራፉ ላይ ማውዝዎን በመያዝ በ3D ማዕዘን ዙሪያ ማሽከርከር እና ማጉላት ይችላሉ።
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
