import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SignaturePadProps {
  onSign: (signed: boolean) => void;
  /** Emits the signature as a PNG data URL (or null when cleared) so it can be persisted. */
  onSignatureChange?: (dataUrl: string | null) => void;
}

const SignaturePad = ({ onSign, onSignatureChange }: SignaturePadProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = '#BFFF00';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#BFFF00';
  }, []);

  const getPointerPos = (e: React.MouseEvent | React.TouchEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const { x, y } = getPointerPos(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getPointerPos(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    onSign(true);
    onSignatureChange?.(canvasRef.current?.toDataURL('image/png') ?? null);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onSign(false);
    onSignatureChange?.(null);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="relative group rounded-3xl overflow-hidden border border-primary/30 bg-card/60 backdrop-blur-xl shadow-premium">
        <canvas
          ref={canvasRef}
          width={800}
          height={300}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-48 md:h-64 cursor-crosshair touch-none"
        />
        <div className="absolute inset-0 pointer-events-none border border-primary/10 rounded-3xl" />
        <button 
          onClick={clear}
          className="absolute top-4 right-4 px-4 py-2 bg-muted/80 backdrop-blur-sm text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-destructive rounded-full border border-border/40 transition-all hover:border-destructive/40"
        >
          Reset
        </button>
      </div>
      <p className="text-center text-xs text-muted-foreground uppercase tracking-[0.3em] font-medium">
        Affix your digital mark above
      </p>
    </motion.div>
  );
};

export default SignaturePad;
