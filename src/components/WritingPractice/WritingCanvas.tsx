import React, { useRef, useEffect, useState, useCallback } from 'react';
import { RotateCcw, Check, Palette } from 'lucide-react';
import { PracticeLetter } from './lettersData';
import { sound } from '../../utils/audio';

interface WritingCanvasProps {
  letter: PracticeLetter;
  mode: 'trace' | 'copy' | 'remember' | 'game';
  onEvaluate?: (accuracy: number, passed: boolean) => void;
  onCheckWithImage?: (imageBase64: string, accuracy: number, passed: boolean) => void;
  lang: 'ta' | 'en';
}

const COLORS = [
  { name: 'Yellow Gold', value: '#fbbf24' },
  { name: 'Sky Blue', value: '#38bdf8' },
  { name: 'Emerald', value: '#34d399' },
  { name: 'Chalk White', value: '#ffffff' },
  { name: 'Coral', value: '#f87171' },
];

export const WritingCanvas: React.FC<WritingCanvasProps> = ({
  letter,
  mode,
  onEvaluate,
  onCheckWithImage,
  lang,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string>('#fbbf24');
  const [strokeCount, setStrokeCount] = useState<number>(0);
  const [drawnPoints, setDrawnPoints] = useState<{ x: number; y: number }[]>([]);
  const [evaluatedScore, setEvaluatedScore] = useState<number | null>(null);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  // Redraw canvas background & guidelines
  const drawBackground = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Blackboard / Slate background styling
    ctx.fillStyle = '#1e293b'; // Slate 800 blackboard
    ctx.fillRect(0, 0, width, height);

    // Primary school ruled notebook guide lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);

    // Top line (Ascender)
    ctx.beginPath();
    ctx.moveTo(15, height * 0.22);
    ctx.lineTo(width - 15, height * 0.22);
    ctx.stroke();

    // Midline (Mean line)
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)'; // Amber tone for midline
    ctx.beginPath();
    ctx.moveTo(15, height * 0.52);
    ctx.lineTo(width - 15, height * 0.52);
    ctx.stroke();

    // Baseline
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.beginPath();
    ctx.moveTo(15, height * 0.82);
    ctx.lineTo(width - 15, height * 0.82);
    ctx.stroke();
    ctx.setLineDash([]);

    // Mode-specific watermark/dots
    if (mode === 'trace') {
      // Draw big dotted guide letter
      ctx.font = '900 230px "Baloo 2", "Noto Sans Tamil", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Ghost outline
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.lineWidth = 14;
      ctx.strokeText(letter.char, width / 2, height / 2 + 10);

      // Dotted trajectory dots
      ctx.fillStyle = '#fde68a'; // Amber 200
      letter.guideDots.forEach((dot, idx) => {
        const scaleX = width / 400;
        const scaleY = height / 400;
        const px = dot.x * scaleX;
        const py = dot.y * scaleY;

        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fill();

        // Number indicator for start
        if (idx === 0) {
          ctx.font = 'bold 12px sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.fillText('1', px, py - 10);
        }
      });
    }
  }, [letter, mode]);

  // Clear and reset canvas
  const handleClear = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawBackground(ctx, canvas.width, canvas.height);
    setStrokeCount(0);
    setDrawnPoints([]);
    setEvaluatedScore(null);
    lastPointRef.current = null;
    sound.playPop();
  }, [drawBackground]);

  // Initial setup and when letter/mode changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawBackground(ctx, canvas.width, canvas.height);
    setStrokeCount(0);
    setDrawnPoints([]);
    setEvaluatedScore(null);
    lastPointRef.current = null;
  }, [letter, mode, drawBackground]);

  // Coordinate calculation using Pointer Events (touch, mouse, stylus)
  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startPointerDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Capture pointer so drawing continues smoothly even if finger slides slightly off
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore if not supported
    }

    const { x, y } = getCoordinates(e);
    setIsDrawing(true);
    setStrokeCount((prev) => prev + 1);
    setDrawnPoints((prev) => [...prev, { x, y }]);
    lastPointRef.current = { x, y };

    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.fillStyle = selectedColor;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = 14;
    ctx.shadowBlur = 4;
    ctx.shadowColor = selectedColor;
  };

  const pointerDraw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    setDrawnPoints((prev) => [...prev, { x, y }]);

    if (lastPointRef.current) {
      const midPoint = {
        x: (lastPointRef.current.x + x) / 2,
        y: (lastPointRef.current.y + y) / 2,
      };
      ctx.quadraticCurveTo(lastPointRef.current.x, lastPointRef.current.y, midPoint.x, midPoint.y);
      ctx.stroke();
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    lastPointRef.current = { x, y };
  };

  const stopPointerDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    setIsDrawing(false);
    lastPointRef.current = null;
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore
    }
  };

  // Evaluate the drawing accuracy
  const handleCheck = () => {
    if (drawnPoints.length < 12) {
      sound.playWrong();
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check hit coverage against guide points
    const scaleX = canvas.width / 400;
    const scaleY = canvas.height / 400;
    let coveredPoints = 0;
    const thresholdRadius = mode === 'trace' ? 48 : 68;

    letter.guideDots.forEach((dot) => {
      const targetX = dot.x * scaleX;
      const targetY = dot.y * scaleY;

      const isCovered = drawnPoints.some((pt) => {
        const dx = pt.x - targetX;
        const dy = pt.y - targetY;
        return Math.sqrt(dx * dx + dy * dy) <= thresholdRadius;
      });

      if (isCovered) coveredPoints++;
    });

    const ratio = coveredPoints / letter.guideDots.length;
    let score = Math.round(ratio * 100);
    if (drawnPoints.length > 20 && score < 75 && (mode === 'remember' || mode === 'game')) {
      score = Math.max(score, 82);
    }
    score = Math.min(100, Math.max(25, score));

    const passed = score >= 65;
    setEvaluatedScore(score);

    const imageBase64 = canvas.toDataURL('image/png');

    if (passed) {
      sound.playSuccess();
      try {
        if ('vibrate' in navigator) navigator.vibrate(50);
      } catch {
        // Ignore
      }
    } else {
      sound.playWrong();
    }

    if (onEvaluate) {
      onEvaluate(score, passed);
    }

    if (onCheckWithImage) {
      onCheckWithImage(imageBase64, score, passed);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm sm:max-w-md mx-auto">
      {/* Palette & Tools Toolbar */}
      <div className="flex items-center justify-between w-full mb-2.5 px-1 text-xs">
        {/* Chalk Colors */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-xl border border-slate-700">
          <Palette className="w-3.5 h-3.5 text-amber-300 ml-0.5" />
          {COLORS.map((c) => (
            <button
              key={c.value}
              onClick={() => setSelectedColor(c.value)}
              style={{ backgroundColor: c.value }}
              className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full transition-transform cursor-pointer ${
                selectedColor === c.value ? 'scale-115 ring-2 ring-white shadow-md' : 'opacity-75 hover:opacity-100'
              }`}
              title={c.name}
            />
          ))}
        </div>

        {/* Clear Button */}
        <button
          onClick={handleClear}
          className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold border border-slate-700 shadow-xs cursor-pointer transition-colors active:scale-95 text-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{lang === 'ta' ? 'அழி' : 'Clear'}</span>
        </button>
      </div>

      {/* Main Touch & Stylus Canvas Container (Responsive Slate Design) */}
      <div className="relative w-full aspect-square max-h-[50vh] sm:max-h-[380px] rounded-3xl overflow-hidden border-4 border-amber-900 shadow-2xl bg-slate-900 select-none">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          onPointerDown={startPointerDrawing}
          onPointerMove={pointerDraw}
          onPointerUp={stopPointerDrawing}
          onPointerCancel={stopPointerDrawing}
          style={{ touchAction: 'none' }}
          className="w-full h-full cursor-crosshair block select-none"
        />

        {/* Live Stroke Counter badge */}
        <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-black/60 backdrop-blur-xs rounded-lg text-[10px] font-mono font-bold text-amber-300">
          {strokeCount === 0
            ? (lang === 'ta' ? 'விரலால் எழுது' : 'Draw with finger')
            : `${lang === 'ta' ? 'வரிகள்' : 'Strokes'}: ${strokeCount}`}
        </div>

        {/* Watermark in Trace mode */}
        {mode === 'trace' && strokeCount === 0 && (
          <div className="absolute bottom-2.5 left-0 right-0 text-center pointer-events-none text-xs text-amber-200/80 font-semibold px-2">
            👆 {lang === 'ta' ? 'புள்ளிகளை இணைத்து விரலால் வரைக' : 'Trace along the dotted lines'}
          </div>
        )}

        {/* Score Stamp overlay */}
        {evaluatedScore !== null && (
          <div className="absolute inset-0 bg-black/55 backdrop-blur-xs flex flex-col items-center justify-center pointer-events-none animate-in fade-in">
            <div className={`p-3.5 sm:p-4 rounded-2xl border-2 text-center max-w-[85%] ${
              evaluatedScore >= 65 ? 'bg-emerald-950/90 border-emerald-400 text-emerald-200' : 'bg-rose-950/90 border-rose-400 text-rose-200'
            }`}>
              <div className="text-3xl font-black font-mono">{evaluatedScore}%</div>
              <div className="text-xs font-bold mt-1">
                {evaluatedScore >= 65
                  ? (lang === 'ta' ? '🎉 அற்புதம்! மிகச் சரியான வரிவடிவம்!' : '🎉 Great job! Perfect shape!')
                  : (lang === 'ta' ? 'இன்னொரு முறை முயற்சி செய்!' : 'Try tracing once more!')}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Check Button */}
      <div className="w-full mt-3 flex items-center justify-between gap-2">
        <p className="text-[11px] sm:text-xs text-slate-500 font-medium line-clamp-1">
          {mode === 'trace'
            ? (lang === 'ta' ? 'வரைந்து முடித்து சரிபார்க்கவும்' : 'Trace and press check')
            : (lang === 'ta' ? 'எழுதி முடித்ததும் சரிபார்க்கவும்' : 'Write and press check')}
        </p>

        <button
          onClick={handleCheck}
          className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer shrink-0"
        >
          <Check className="w-4 h-4 stroke-[3]" />
          <span>{lang === 'ta' ? 'சரிபார்' : 'Check'}</span>
        </button>
      </div>
    </div>
  );
};
