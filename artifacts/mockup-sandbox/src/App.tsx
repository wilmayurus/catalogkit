import { useState, useRef } from "react";
import VideoTemplate from "./components/video/VideoTemplate";

const TOTAL_DURATION_MS = 8000 + 12000 + 16000 + 12000 + 12000; // 60s

type RecordState = "idle" | "waiting" | "recording" | "done" | "error";

function App() {
  const [recState, setRecState] = useState<RecordState>("idle");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function startDownload() {
    setRecState("waiting");
    chunksRef.current = [];

    let stream: MediaStream;
    try {
      stream = await (navigator.mediaDevices as any).getDisplayMedia({
        video: { frameRate: 30, width: 1920, height: 1080 },
        audio: false,
        preferCurrentTab: true,
      } as any);
    } catch {
      setRecState("error");
      return;
    }

    const recorder = new MediaRecorder(stream, {
      mimeType: MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : "video/webm",
    });
    mediaRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      stream.getTracks().forEach((t) => t.stop());
      if (timerRef.current) clearInterval(timerRef.current);
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "catalogkit-demo.webm";
      a.click();
      URL.revokeObjectURL(url);
      setRecState("done");
    };

    recorder.start(200);
    setRecState("recording");

    let remaining = Math.ceil(TOTAL_DURATION_MS / 1000);
    setSecondsLeft(remaining);
    timerRef.current = setInterval(() => {
      remaining -= 1;
      setSecondsLeft(remaining);
      if (remaining <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        mediaRef.current?.stop();
      }
    }, 1000);
  }

  function cancelRecording() {
    if (timerRef.current) clearInterval(timerRef.current);
    mediaRef.current?.stop();
    setRecState("idle");
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <VideoTemplate />

      {/* Overlay controls — hidden during recording so they don't appear in the captured video */}
      {recState !== "recording" && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3">
          {recState === "idle" && (
            <button
              onClick={startDownload}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold text-sm px-5 py-2.5 rounded-full shadow-lg transition-all"
            >
              <span>⬇</span> Download Video
            </button>
          )}

          {recState === "waiting" && (
            <div className="bg-black/60 backdrop-blur-md border border-white/20 text-white text-sm px-5 py-3 rounded-full shadow-lg text-center">
              <span className="animate-pulse">● </span>
              Select this tab in the sharing dialog…
            </div>
          )}

          {recState === "done" && (
            <div className="flex items-center gap-2 bg-green-900/70 backdrop-blur-md border border-green-500/40 text-green-200 text-sm px-5 py-3 rounded-full shadow-lg">
              <span>✓</span> catalogkit-demo.webm downloaded!
              <button
                onClick={() => setRecState("idle")}
                className="ml-2 text-green-300/70 hover:text-green-100 text-xs underline"
              >
                again
              </button>
            </div>
          )}

          {recState === "error" && (
            <div className="flex items-center gap-2 bg-red-900/70 backdrop-blur-md border border-red-500/40 text-red-200 text-sm px-5 py-3 rounded-full shadow-lg">
              <span>✕</span> Permission denied.
              <button
                onClick={() => setRecState("idle")}
                className="ml-2 text-red-300/70 hover:text-red-100 text-xs underline"
              >
                retry
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
