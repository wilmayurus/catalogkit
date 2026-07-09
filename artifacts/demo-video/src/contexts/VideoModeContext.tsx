import { createContext, useContext } from 'react';
export const VideoModeContext = createContext<boolean>(false);
export const usePortrait = () => useContext(VideoModeContext);
