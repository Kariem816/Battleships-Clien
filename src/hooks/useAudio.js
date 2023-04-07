import { useMemo, useEffect, useState } from "react";

export default function useAudio(url) {
    const audio = useMemo(() => new Audio(url), []);
    const [isPlaying, setIsPlaying] = useState(false);

    const toggle = () => setIsPlaying(!isPlaying);
    const play = () => audio.play();

    useEffect(() => {
        isPlaying ? audio.play() : audio.pause();
    }, [isPlaying]);

    useEffect(() => {
        audio.addEventListener('ended', () => setIsPlaying(false));
        return () => {
            audio.removeEventListener('ended', () => setIsPlaying(false));
        };
    }, []);

    return [isPlaying, toggle];
};
