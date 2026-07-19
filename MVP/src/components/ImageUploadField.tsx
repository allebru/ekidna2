import { useRef, useState } from 'react';
import { Input } from './ui/input';
import { Loader2, Upload } from 'lucide-react';
import { getToken } from '../config/api';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

// Campo immagine riusabile: URL manuale + upload da computer (drag&drop non
// necessario qui, un click basta). Usato per singole immagini (hero, foto
// sede, OG image SEO...) e riusato dentro EventiEditor/GalleriaEditor per le
// immagini ripetibili.
export function ImageUploadField({
  value,
  onChange,
  placeholder = 'URL immagine (https://...)',
}: {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });
      const data = await res.json();
      if (data.url) onChange(data.url);
      else alert(data.error || 'Errore upload');
    } catch {
      alert('Errore durante il caricamento');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      {value && (
        <img
          src={value}
          alt=""
          className="w-14 h-14 object-cover rounded border border-zinc-700 flex-shrink-0"
          onError={(e) => (e.currentTarget.style.display = 'none')}
        />
      )}
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-zinc-800 border-zinc-700 text-white text-sm flex-1"
      />
      <button
        type="button"
        title="Carica dal computer"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="px-3 py-2 border border-[#d4a017]/50 text-[#d4a017] hover:bg-[#d4a017]/10 disabled:opacity-50 flex-shrink-0"
      >
        {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
      </button>
      <input
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
        ref={fileRef}
        onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
      />
    </div>
  );
}
