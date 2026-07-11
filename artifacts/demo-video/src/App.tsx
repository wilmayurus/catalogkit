import { useState, useRef } from "react";
import VideoTemplate from "./components/video/VideoTemplate";
import { VideoModeContext } from "./contexts/VideoModeContext";

const TOTAL_DURATION_MS = 7000 + 9000 + 10000 + 11000 + 12000 + 2500;
const COUNTDOWN_SECONDS = 5;

type RecordState = "idle" | "recording" | "done" | "error";

function pickWebmMimeType(): string {
  if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9")) return "video/webm;codecs=vp9";
  if (MediaRecorder.isTypeSupported("video/webm;codecs=vp8")) return "video/webm;codecs=vp8";
  return "video/webm";
}

/** Wait for two animation frames so React flushes all pending state to the DOM. */
function twoFrames(): Promise<void> {
  return new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
}

function App() {
  const [recState, setRecState] = useState<RecordState>("idle");
  const [videoKey, setVideoKey] = useState(0);
  const [portrait, setPortrait] = useState(false);
  const mediaRef    = useRef<MediaRecorder | null>(null);
  const chunksRef   = useRef<Blob[]>([]);
  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef   = useRef<MediaStream | null>(null);
  const portraitRef = useRef(portrait);
  const lastFilenameRef = useRef<string>("");
  portraitRef.current = portrait;

  function switchMode() {
    setPortrait(p => !p);
    setVideoKey(k => k + 1);
  }

  async function startDownload() {
    chunksRef.current = [];
    const isPortrait = portraitRef.current;

    // 1. Hide ALL UI before doing anything else.
    //    Wait two rAF cycles so React flushes and the DOM is clean.
    setRecState("recording");
    await twoFrames();

    // 2. Now request capture — the tab has zero overlays at this point.
    let stream: MediaStream;
    try {
      stream = await (navigator.mediaDevices as any).getDisplayMedia({
        video: isPortrait
          ? { frameRate: 30, width: 1080, height: 1920 }
          : { frameRate: 30, width: 1920, height: 1080 },
        audio: true,
        preferCurrentTab: true,
      } as any);
    } catch {
      setRecState("error");
      return;
    }

    streamRef.current = stream;

    // 3. Silent countdown — no UI is shown during this wait.
    let count = COUNTDOWN_SECONDS;
    const countTimer = setInterval(async () => {
      count -= 1;
      if (count <= 0) {
        clearInterval(countTimer);
        setVideoKey(k => k + 1);          // restart animation from Scene 1
        await new Promise(r => setTimeout(r, 600));
        beginRecording(stream, isPortrait);
      }
    }, 1000);
  }

  function beginRecording(stream: MediaStream, isPortrait: boolean) {
    const mimeType = pickWebmMimeType();
    const baseName = isPortrait ? "catalogkit-demo-portrait" : "catalogkit-demo";

    const recorder = new MediaRecorder(stream, { mimeType });
    mediaRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      stream.getTracks().forEach(t => t.stop());
      if (timerRef.current) clearInterval(timerRef.current);
      const blob = new Blob(chunksRef.current, { type: mimeType });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `${baseName}.webm`;
      a.click();
      URL.revokeObjectURL(url);
      lastFilenameRef.current = `${baseName}.webm`;
      setRecState("done");
    };

    recorder.start(200);

    let remaining = Math.ceil(TOTAL_DURATION_MS / 1000);
    timerRef.current = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        mediaRef.current?.stop();
      }
    }, 1000);
  }

  const stageStyle = portrait
    ? { width:  "min(100vw, calc((100vh - 76px) * 9 / 16))",
        height: "min(calc(100vh - 76px), calc(100vw * 16 / 9))" }
    : { width:  "min(100vw, calc((100vh - 76px) * 16 / 9))",
        height: "min(calc(100vh - 76px), calc(100vw * 9 / 16))" };

  return (
    <VideoModeContext.Provider value={portrait}>
      <div className="w-screen h-screen bg-black flex items-center justify-center overflow-hidden relative">

        {/* ── Video stage ── */}
        <div className="video-stage relative overflow-hidden" style={stageStyle}>
          <VideoTemplate key={videoKey} />
          {/* Persistent © pill — part of the content, always visible */}
          <div
            className="absolute bottom-0 left-0 right-0 flex flex-col items-center pointer-events-none z-[100]"
            style={{ paddingBottom: "0.8cqh" }}
          >
            <span style={{
              fontSize: "1.1cqw", fontWeight: 700, letterSpacing: "0.04em",
              color: "rgba(255,255,255,0.9)",
              background: "rgba(0,0,0,0.45)",
              borderRadius: "20px",
              padding: "0.2cqh 1.2cqw",
            }}>© CatalogKit</span>
          </div>
        </div>

        {/* ── Controls — only shown in idle/done/error states, NEVER during recording ── */}

        {recState === "idle" && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2">
            <button
              onClick={startDownload}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold text-sm px-5 py-2 rounded-full shadow-lg transition-all"
            >
              <span>⬇</span> Download {portrait ? "Portrait" : "Landscape"} Video
            </button>
            <button
              onClick={switchMode}
              className="text-white/40 hover:text-white/70 text-xs transition-colors"
            >
              Switch to {portrait ? "Landscape (16:9) 🖥" : "Portrait (9:16) 📱"}
            </button>
          </div>
        )}

        {recState === "done" && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50">
            <div className="flex flex-col items-center gap-1 bg-green-900/70 backdrop-blur-md border border-green-500/40 text-green-200 text-sm px-5 py-3 rounded-2xl shadow-lg text-center">
              <div className="flex items-center gap-2">
                <span>✓</span> <strong>{lastFilenameRef.current}</strong> downloaded!
              </div>
              <div className="text-xs text-green-300/70">
                Open with <strong>VLC</strong> · or convert to MP4 via <strong>HandBrake</strong> (free)
              </div>
              <button
                onClick={() => setRecState("idle")}
                className="mt-1 text-green-300/60 hover:text-green-100 text-xs underline"
              >
                record again
              </button>
            </div>
          </div>
        )}

        {recState === "error" && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50">
            <div className="flex flex-col items-center gap-2 bg-red-900/70 backdrop-blur-md border border-red-500/40 text-red-200 text-sm px-5 py-2 rounded-xl shadow-lg text-center">
              <span>✕ Permission denied or cancelled.</span>
              <span className="text-xs text-red-300/70">Select <strong>this tab</strong> when the browser asks.</span>
              <button
                onClick={() => setRecState("idle")}
                className="mt-1 text-red-300 hover:text-red-100 text-xs underline"
              >
                Try again
              </button>
            </div>
          </div>
        )}

      </div>
    </VideoModeContext.Provider>
  );
}

export default App;
