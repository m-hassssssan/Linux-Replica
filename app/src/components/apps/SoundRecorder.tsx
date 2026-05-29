import { useState, useRef, useEffect } from 'react';
import * as Icons from 'lucide-react';

export default function SoundRecorder() {
  const [recording, setRecording] = useState(false);
  const [time, setTime] = useState<number>(0);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioURL(URL.createObjectURL(blob));
        stream.getTracks().forEach(t => t.stop());
      };
      recorder.start();
      setRecording(true);
      setTime(0);
      intervalRef.current = window.setInterval(() => setTime(t => t + 1), 1000);
    } catch {
      setHasPermission(false);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  // Animated waveform
  const [bars, setBars] = useState<number[]>(new Array(40).fill(3));
  useEffect(() => {
    if (!recording) return;
    const iv = setInterval(() => {
      setBars(Array.from({ length: 40 }, () => 2 + Math.random() * 28));
    }, 100);
    return () => clearInterval(iv);
  }, [recording]);

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d12] p-6 items-center justify-center">
      {/* Waveform */}
      <div className="flex items-end justify-center gap-0.5 h-24 mb-6 w-full">
        {bars.map((h, i) => (
          <div key={i} className="flex-1 rounded-full transition-all duration-100"
            style={{ height: `${h * 4}px`, background: recording ? '#00d4ff' : 'rgba(255,255,255,0.1)' }} />
        ))}
      </div>

      {/* Timer */}
      <div className="text-3xl text-white font-mono font-bold mb-6">{formatTime(time)}</div>

      {/* Status */}
      {recording && (
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs text-red-400">Recording</span>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={recording ? stopRecording : startRecording}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all hover:scale-105
            ${recording ? 'bg-red-500/20 hover:bg-red-500/30' : 'bg-[#00d4ff]/20 hover:bg-[#00d4ff]/30'}`}
        >
          {recording ? <Icons.Square className="w-6 h-6 text-red-400" /> : <Icons.Mic className="w-6 h-6 text-[#00d4ff]" />}
        </button>
      </div>

      {/* Playback */}
      {audioURL && !recording && (
        <div className="mt-6">
          <audio src={audioURL} controls className="w-64 h-8" />
        </div>
      )}

      {hasPermission === false && (
        <p className="text-xs text-white/30 mt-4">Microphone access denied. Please allow access to record.</p>
      )}
    </div>
  );
}
