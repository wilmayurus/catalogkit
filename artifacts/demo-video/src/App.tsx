import { useState, useRef } from "react";
import VideoTemplate from "./components/video/VideoTemplate";
import { VideoModeContext } from "./contexts/VideoModeContext";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

const TOTAL_DURATION_MS = 7000 + 9000 + 10000 + 11000 + 12000 + 2500;
const COUNTDOWN_SECONDS = 3;

type RecordState = "idle" | "waiting" | "countdown" | "recording" | "converting" | "done" | "error";

function App() {
  const [recState, setRecState] = useState<RecordState>("idle");
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [videoKey, setVideoKey] = useState(0);
  const [portrait, setPortrait] = useState(false);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const portraitRef = useRef(portrait);
  const lastFilenameRef = useRef<string>("");
  portraitRef.current = portrait;

  function switchMode() {
    setPortrait(p => !p);
    setVideoKey(k => k + 1);
  }

  async function startDownload() {
    setRecState("waiting");
    chunksRef.current = [];

    const isPortrait = portraitRef.current;
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

    setCountdown(COUNTDOWN_SECONDS);
    setRecState("countdown");

    let count = COUNTDOWN_SECONDS;
    const countTimer = setInterval(async () => {
      count -= 1;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(countTimer);
        setVideoKey(k => k + 1);
        await new Promise(r => setTimeout(r, 600));
        beginRecording(stream, isPortrait);
      }
    }, 1000);
  }

  function beginRecording(stream: MediaStream, isPortrait: boolean) {
    const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
      ? "video/webm;codecs=vp9"
      : MediaRecorder.isTypeSupported("video/webm;codecs=vp8")
      ? "video/webm;codecs=vp8"
      : "video/webm";

    const baseName = isPortrait ? "catalogkit-demo-portrait" : "catalogkit-demo";

    const recorder = new MediaRecorder(stream, { mimeType });
    mediaRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      stream.getTracks().forEach((t) => t.stop());
      if (timerRef.current) clearInterval(timerRef.current);
      const webmBlob = new Blob(chunksRef.current, { type: mimeType });
      convertToMp4(webmBlob, baseName);
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

  async function convertToMp4(webmBlob: Blob, baseName: string) {
    setRecState("converting");
    try {
      const ffmpeg = new FFmpeg();
      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
      });
      await ffmpeg.writeFile("input.webm", await fetchFile(webmBlob));
      await ffmpeg.exec([
        "-i", "input.webm",
        "-c:v", "libx264",
        "-preset", "ultrafast",
        "-crf", "23",
        "-c:a", "aac",
        "-movflags", "+faststart",
        "output.mp4",
      ]);
      const data = await ffmpeg.readFile("output.mp4") as Uint8Array;
      const mp4Blob = new Blob([data.buffer as ArrayBuffer], { type: "video/mp4" });
      const url = URL.createObjectURL(mp4Blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${baseName}.mp4`;
      a.click();
      URL.revokeObjectURL(url);
      lastFilenameRef.current = `${baseName}.mp4`;
    } catch {
      // ffmpeg failed — fall back to WebM download
      const url = URL.createObjectURL(webmBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${baseName}.webm`;
      a.click();
      URL.revokeObjectURL(url);
      lastFilenameRef.current = `${baseName}.webm`;
    }
    setRecState("done");
  }

  function cancelRecording() {
    if (timerRef.current) clearInterval(timerRef.current);
    mediaRef.current?.stop();
    streamRef.current?.getTracks().forEach(t => t.stop());
    setRecState("idle");
  }

  // Reserve 76px for the download/switch controls so they're never hidden behind the video
  // or behind the mobile browser nav bar on small screens.
  const CTRL_H = 76;
  const stageStyle = portrait
    ? {
        width: `min(100vw, calc((100vh - ${CTRL_H}px) * 9 / 16))`,
        height: `min(calc(100vh - ${CTRL_H}px), calc(100vw * 16 / 9))`,
      }
    : {
        width: `min(100vw, calc((100vh - ${CTRL_H}px) * 16 / 9))`,
        height: `min(calc(100vh - ${CTRL_H}px), calc(100vw * 9 / 16))`,
      };

  return (
    <VideoModeContext.Provider value={portrait}>
      <div className="w-screen h-screen bg-black flex items-center justify-center overflow-hidden relative">
        {/* Video stage — only the video lives here */}
        <div className="video-stage relative overflow-hidden" style={stageStyle}>
          <VideoTemplate key={videoKey} />
        </div>

        {/* All UI is outside the video stage so it never appears in the recording */}

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

        {recState === "waiting" && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50">
            <div className="bg-black/80 backdrop-blur-md border border-white/20 text-white text-sm px-5 py-3 rounded-2xl shadow-lg text-center leading-snug">
              <span className="animate-pulse text-yellow-400">● </span>
              <strong>Select this tab</strong> in the sharing dialog…
            </div>
          </div>
        )}

        {recState === "countdown" && (
          <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="text-white text-center">
              <div className="text-8xl font-black tabular-nums" style={{ textShadow: '0 0 40px rgba(249,115,22,0.8)' }}>
                {countdown}
              </div>
              <div className="text-lg font-semibold text-white/60 mt-2">Recording starts…</div>
            </div>
          </div>
        )}

        {recState === "converting" && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50">
            <div className="bg-black/80 backdrop-blur-md border border-white/20 text-white text-sm px-5 py-3 rounded-2xl shadow-lg text-center leading-snug">
              <span className="animate-spin inline-block mr-2">⏳</span>
              <strong>Converting to MP4…</strong>
              <div className="text-white/50 text-xs mt-1">This takes about 30–60 seconds. Please wait.</div>
            </div>
          </div>
        )}

        {recState === "done" && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center gap-2 bg-green-900/70 backdrop-blur-md border border-green-500/40 text-green-200 text-sm px-5 py-2 rounded-full shadow-lg">
              <span>✓</span> {lastFilenameRef.current} downloaded!
              <button onClick={() => setRecState("idle")} className="ml-2 text-green-300/70 hover:text-green-100 text-xs underline">
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
              <button onClick={() => setRecState("idle")} className="mt-1 text-red-300 hover:text-red-100 text-xs underline">Try again</button>
            </div>
          </div>
        )}
      </div>
    </VideoModeContext.Provider>
  );
}

export default App;
