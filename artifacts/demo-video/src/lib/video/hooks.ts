import { useEffect, useState } from "react";

export function useVideoPlayer({ durations }: { durations: Record<string, number> }) {
  const [currentScene, setCurrentScene] = useState(0);

  useEffect(() => {
    let isCancelled = false;
    const keys = Object.keys(durations);

    const runScenes = async () => {
      for (let i = 0; i < keys.length; i++) {
        if (isCancelled) break;
        setCurrentScene(i);
        await new Promise((resolve) => setTimeout(resolve, durations[keys[i]]));
      }
    };

    runScenes();

    return () => {
      isCancelled = true;
    };
  }, []);

  return { currentScene };
}
