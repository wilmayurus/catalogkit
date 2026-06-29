import { useEffect, useState } from "react";

export function useVideoPlayer({ durations }: { durations: Record<string, number> }) {
  const [currentScene, setCurrentScene] = useState(0);

  useEffect(() => {
    // @ts-ignore
    window.startRecording?.();

    let isCancelled = false;
    let sceneIndex = 0;
    const keys = Object.keys(durations);

    const runScenes = async () => {
      while (!isCancelled) {
        for (let i = 0; i < keys.length; i++) {
          if (isCancelled) break;
          sceneIndex = i;
          setCurrentScene(sceneIndex);
          await new Promise((resolve) => setTimeout(resolve, durations[keys[i]]));
        }
        if (!isCancelled) {
          // @ts-ignore
          window.stopRecording?.();
        }
      }
    };

    runScenes();

    return () => {
      isCancelled = true;
    };
  }, [durations]);

  return { currentScene };
}
