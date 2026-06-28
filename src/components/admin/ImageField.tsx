import { useState } from 'react';
import { Loader2, Upload } from 'lucide-react';
import { compressImageFile, encodedBytes, isUnderFirestoreLimit, type ImageKind } from '@/lib/imageClient';

interface ImageFieldProps {
  label: string;
  value: string;
  kind?: ImageKind;
  onChange: (dataUri: string) => void;
}

const kb = (n: number) => `${Math.round(n / 1024)} KB`;

const ImageField = ({ label, value, kind = 'photo', onChange }: ImageFieldProps) => {
  const [busy, setBusy] = useState(false);
  const [warn, setWarn] = useState<string | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setWarn(null);
    try {
      const dataUri = await compressImageFile(file, kind);
      if (!isUnderFirestoreLimit(dataUri)) {
        setWarn(`Image is ${kb(encodedBytes(dataUri))} — too large for one Firestore doc. Try a smaller image.`);
      }
      onChange(dataUri);
    } catch (err) {
      setWarn('Could not process this image.');
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">{label}</label>
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 rounded-xl border border-border/40 bg-muted/20 overflow-hidden flex items-center justify-center shrink-0">
          {value ? (
            <img src={value} alt={label} className="w-full h-full object-cover" />
          ) : (
            <span className="text-[10px] text-muted-foreground">No image</span>
          )}
        </div>
        <div className="space-y-1">
          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border/40 bg-card/40 hover:border-primary/40 cursor-pointer text-sm transition-colors">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {busy ? 'Compressing…' : 'Upload image'}
            <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={busy} />
          </label>
          {value && <p className="text-[10px] text-muted-foreground">≈ {kb(encodedBytes(value))} stored inline</p>}
          {warn && <p className="text-[10px] text-destructive">{warn}</p>}
        </div>
      </div>
    </div>
  );
};

export default ImageField;
