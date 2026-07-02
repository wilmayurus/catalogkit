import { useState, useRef } from "react";
import VideoTemplate from "./components/video/VideoTemplate";

const TOTAL_DURATION_MS = 7000 + 9000 + 10000 + 11000 + 12000 + 2500;

type RecordState = "idle" | "waiting" | "recording" | "done" | "error";

function App() {
  const [recState, setRecState] = useState<RecordState>("idle");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [videoKey, setVideoKey] = useState(0);
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
        audio: true,
        preferCurrentTab: true,
      } as any);
    } catch {
      setRecState("error");
      return;
    }

    setVideoKey(k => k + 1);
    await new Promise(r => setTimeout(r, 600));

    const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
      ? "video/webm;codecs=vp9"
      : MediaRecorder.isTypeSupported("video/webm;codecs=vp8")
      ? "video/webm;codecs=vp8"
      : "video/webm";

    const recorder = new MediaRecorder(stream, { mimeType });
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
    <div className="w-screen h-screen bg-black flex items-center justify-center overflow-hidden">
      {/*
        16:9 container — fills the screen without distorting.
        container-type:size makes cqw/cqh inside reference THIS box,
        not the browser window, so everything scales correctly at any size.
      */}
      <div
        className="video-stage relative overflow-hidden"
        style={{
          width: "min(100vw, calc(100vh * 16 / 9))",
          height: "min(100vh, calc(100vw * 9 / 16))",
        }}
      >
        <VideoTemplate key={videoKey} />

        {recState !== "recording" && (
          <div className="absolute bottom-[2cqh] left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3">
            {recState === "idle" && (
              <button
                onClick={startDownload}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold text-[1.4cqw] px-[2cqw] py-[0.8cqh] rounded-full shadow-lg transition-all"
              >
                <span>⬇</span> Download Video
              </button>
            )}
            {recState === "waiting" && (
              <div className="bg-black/60 backdrop-blur-md border border-white/20 text-white text-[1.2cqw] px-[2.5cqw] py-[1.2cqh] rounded-2xl shadow-lg text-center leading-snug">
                <span className="animate-pulse text-yellow-400">● </span>
                <strong>Select this tab</strong> in the sharing dialog,<br />
                then the video will record automatically.
              </div>
            )}
            {recState === "done" && (
              <div className="flex items-center gap-2 bg-green-900/70 backdrop-blur-md border border-green-500/40 text-green-200 text-[1.2cqw] px-[2cqw] py-[1cqh] rounded-full shadow-lg">
                <span>✓</span> catalogkit-demo.webm downloaded!
                <button onClick={() => setRecState("idle")} className="ml-2 text-green-300/70 hover:text-green-100 text-[1cqw] underline">
                  record again
                </button>
              </div>
            )}
            {recState === "error" && (
              <div className="flex flex-col items-center gap-2 bg-red-900/70 backdrop-blur-md border border-red-500/40 text-red-200 text-[1.2cqw] px-[2cqw] py-[1cqh] rounded-xl shadow-lg text-center">
                <span>✕ Permission denied or cancelled.</span>
                <span className="text-[1cqw] text-red-300/70">Select <strong>this tab</strong> when the browser asks.</span>
                <button onClick={() => setRecState("idle")} className="mt-1 text-red-300 hover:text-red-100 text-[1cqw] underline">Try again</button>
              </div>
            )}
          </div>
        )}

        {recState === "recording" && (
          <div className="absolute bottom-[1.5cqh] right-[1.5cqw] z-50 flex items-center gap-2 bg-black/50 backdrop-blur-sm text-white text-[1cqw] px-[1.5cqw] py-[0.6cqh] rounded-full border border-red-500/50">
            <span className="w-[0.8cqw] h-[0.8cqw] rounded-full bg-red-500 animate-pulse" />
            Recording… {secondsLeft}s
            <button onClick={cancelRecording} className="ml-1 text-white/50 hover:text-white transition-colors" title="Cancel">✕</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
