import { useState, useRef } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import VideoTemplate from "./components/video/VideoTemplate";
import { VideoModeContext } from "./contexts/VideoModeContext";

const TOTAL_DURATION_MS = 7000 + 9000 + 10000 + 11000 + 12000 + 2500;
const COUNTDOWN_SECONDS = 5;

type RecordState = "idle" | "waiting" | "countdown" | "recording" | "converting" | "done" | "error" | "converterror";

function pickWebmMimeType(): string {
  if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9")) return "video/webm;codecs=vp9";
  if (MediaRecorder.isTypeSupported("video/webm;codecs=vp8")) return "video/webm;codecs=vp8";
  return "video/webm";
}

function App() {
  const [recState, setRecState]     = useState<RecordState>("idle");
  const [countdown, setCountdown]   = useState(COUNTDOWN_SECONDS);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [convertProgress, setConvertProgress] = useState("");
  const [convertError, setConvertError]       = useState("");
  const webmFallbackRef = useRef<{ blob: Blob; name: string } | null>(null);
  const [videoKey, setVideoKey]     = useState(0);
  const [portrait, setPortrait]     = useState(false);
  const mediaRef    = useRef<MediaRecorder | null>(null);
  const chunksRef   = useRef<Blob[]>([]);
  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef   = useRef<MediaStream | null>(null);
  const ffmpegRef   = useRef<FFmpeg | null>(null);
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
      convertToMp4(blob, baseName);
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

  async function loadFFmpeg(): Promise<FFmpeg> {
    if (ffmpegRef.current) return ffmpegRef.current;
    const ffmpeg = new FFmpeg();
    ffmpeg.on("log", ({ message }) => {
      const m = message.match(/time=(\S+)/);
      if (m) setConvertProgress(`Converting… ${m[1]}`);
    });
    // Try unpkg first, fall back to jsdelivr
    const cdns = [
      "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm",
      "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/esm",
    ];
    let loaded = false;
    for (const base of cdns) {
      try {
        setConvertProgress(`Downloading converter from ${new URL(base).hostname}…`);
        await ffmpeg.load({
          coreURL: await toBlobURL(`${base}/ffmpeg-core.js`,   "text/javascript"),
          wasmURL: await toBlobURL(`${base}/ffmpeg-core.wasm`, "application/wasm"),
        });
        loaded = true;
        break;
      } catch {
        // try next CDN
      }
    }
    if (!loaded) throw new Error("Could not download the MP4 converter from any CDN.");
    ffmpegRef.current = ffmpeg;
    return ffmpeg;
  }

  async function convertToMp4(webmBlob: Blob, baseName: string) {
    setRecState("converting");
    setConvertProgress("Loading converter…");
    webmFallbackRef.current = { blob: webmBlob, name: `${baseName}.webm` };

    try {
      const ffmpeg = await loadFFmpeg();

      setConvertProgress("Writing video data…");
      await ffmpeg.writeFile("input.webm", await fetchFile(webmBlob));

      setConvertProgress("Converting to MP4…");
      const ret = await ffmpeg.exec([
        "-i", "input.webm",
        "-c:v", "libx264", "-preset", "ultrafast", "-crf", "23",
        "-c:a", "aac",
        "-movflags", "+faststart",
        "output.mp4",
      ]);
      if (ret !== 0) throw new Error(`FFmpeg exited with code ${ret}`);

      setConvertProgress("Saving…");
      const data = await ffmpeg.readFile("output.mp4");
      const mp4Blob = new Blob([data as Uint8Array], { type: "video/mp4" });
      triggerDownload(mp4Blob, `${baseName}.mp4`, "video/mp4");

      await ffmpeg.deleteFile("input.webm").catch(() => {});
      await ffmpeg.deleteFile("output.mp4").catch(() => {});
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setConvertError(msg);
      setRecState("converterror");
    }
  }

  function triggerDownload(blob: Blob, filename: string, _type: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    lastFilenameRef.current = filename;
    setRecState("done");
  }

  function cancelRecording() {
    if (timerRef.current) clearInterval(timerRef.current);
    mediaRef.current?.stop();
    streamRef.current?.getTracks().forEach(t => t.stop());
    setRecState("idle");
  }

  const stageStyle = portrait
    ? {
        width:  `min(100vw, calc((100vh - 76px) * 9 / 16))`,
        height: `min(calc(100vh - 76px), calc(100vw * 16 / 9))`,
      }
    : {
        width:  `min(100vw, calc((100vh - 76px) * 16 / 9))`,
        height: `min(calc(100vh - 76px), calc(100vw * 9 / 16))`,
      };

  return (
    <VideoModeContext.Provider value={portrait}>
      <div className="w-screen h-screen bg-black flex items-center justify-center overflow-hidden relative">
        {/* Video stage — only the video lives here */}
        <div className="video-stage relative overflow-hidden" style={stageStyle}>
          <VideoTemplate key={videoKey} />
          {/* Persistent footer — outside scene motion divs so it's always visible */}
          <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pointer-events-none z-[100]" style={{ paddingBottom: '0.8cqh' }}>
            <span style={{
              fontSize: '1.1cqw', fontWeight: 700, letterSpacing: '0.04em',
              color: 'rgba(255,255,255,0.9)',
              background: 'rgba(0,0,0,0.45)',
              borderRadius: '20px',
              padding: '0.2cqh 1.2cqw',
            }}>© CatalogKit</span>
          </div>
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

        {recState === "countdown" && countdown > 0 && (
          <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="text-white text-center">
              <div className="text-8xl font-black tabular-nums" style={{ textShadow: '0 0 40px rgba(249,115,22,0.8)' }}>
                {countdown}
              </div>
              <div className="text-lg font-semibold text-white/60 mt-2">Recording starts…</div>
            </div>
          </div>
        )}

        {recState === "recording" && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center gap-3 bg-black/80 backdrop-blur-md border border-red-500/40 text-white text-sm px-5 py-2 rounded-full shadow-lg">
              <span className="animate-pulse text-red-400">●</span>
              Recording… {secondsLeft}s left
              <button onClick={cancelRecording} className="ml-1 text-white/40 hover:text-white/80 text-xs transition-colors">
                cancel
              </button>
            </div>
          </div>
        )}

        {recState === "converting" && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center gap-3 bg-black/80 backdrop-blur-md border border-orange-500/40 text-white text-sm px-5 py-3 rounded-2xl shadow-lg text-center">
              <span className="animate-spin text-orange-400">⟳</span>
              <span>{convertProgress || "Converting to MP4…"}</span>
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

        {recState === "converterror" && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-sm w-full px-3">
            <div className="flex flex-col gap-2 bg-red-900/80 backdrop-blur-md border border-red-500/40 text-red-200 text-sm px-5 py-3 rounded-xl shadow-lg">
              <span className="font-semibold">✕ MP4 conversion failed</span>
              <span className="text-xs text-red-300/80 break-words">{convertError}</span>
              <div className="flex gap-3 mt-1 justify-center">
                <button
                  onClick={() => {
                    if (webmFallbackRef.current) {
                      triggerDownload(webmFallbackRef.current.blob, webmFallbackRef.current.name, "video/webm");
                    }
                  }}
                  className="text-red-200 hover:text-white text-xs underline"
                >
                  Download WebM instead
                </button>
                <button onClick={() => setRecState("idle")} className="text-red-300/70 hover:text-red-100 text-xs underline">
                  Record again
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </VideoModeContext.Provider>
  );
}

export default App;
