import { useCallback, useEffect, useRef, useState } from 'react';

export const STORY_DURATION_MS = 5000;
const TICK_MS = 50;
const SWIPE_THRESHOLD_PX = 40;
const TAP_SLOP_PX = 12;

export function useStoryGallery(count: number) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const [progress, setProgress] = useState(0);
    const [reducedMotion, setReducedMotion] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const remainingMsRef = useRef(STORY_DURATION_MS);
    const touchStartRef = useRef({ x: 0, y: 0 });
    const suppressClickRef = useRef(false);

    useEffect(() => {
        setActiveIndex((index) => (count === 0 ? 0 : Math.min(index, count - 1)));
        remainingMsRef.current = STORY_DURATION_MS;
        setProgress(count === 1 ? 100 : 0);
    }, [count]);

    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        const update = () => setReducedMotion(mq.matches);
        update();
        mq.addEventListener('change', update);
        return () => mq.removeEventListener('change', update);
    }, []);

    useEffect(() => {
        const element = containerRef.current;
        if (!element) {
            return undefined;
        }

        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { threshold: 0.25 },
        );
        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    const resetProgress = useCallback(() => {
        remainingMsRef.current = STORY_DURATION_MS;
        setProgress(0);
    }, []);

    const goTo = useCallback(
        (index: number) => {
            if (count <= 0) {
                return;
            }
            const next = ((index % count) + count) % count;
            setActiveIndex(next);
            resetProgress();
        },
        [count, resetProgress],
    );

    const goNext = useCallback(() => {
        if (count <= 1) {
            return;
        }
        goTo(activeIndex + 1);
    }, [activeIndex, count, goTo]);

    const goPrev = useCallback(() => {
        if (count <= 1) {
            return;
        }
        goTo(activeIndex - 1);
    }, [activeIndex, count, goTo]);

    useEffect(() => {
        if (count <= 1 || reducedMotion || !isVisible || paused) {
            if (count === 1) {
                setProgress(100);
            }
            return undefined;
        }

        const tick = () => {
            remainingMsRef.current = Math.max(0, remainingMsRef.current - TICK_MS);
            const pct = ((STORY_DURATION_MS - remainingMsRef.current) / STORY_DURATION_MS) * 100;
            setProgress(pct);

            if (remainingMsRef.current <= 0) {
                setActiveIndex((index) => (index >= count - 1 ? 0 : index + 1));
                remainingMsRef.current = STORY_DURATION_MS;
                setProgress(0);
            }
        };

        const id = window.setInterval(tick, TICK_MS);
        return () => window.clearInterval(id);
    }, [activeIndex, count, isVisible, paused, reducedMotion]);

    const pause = useCallback(() => setPaused(true), []);
    const resume = useCallback(() => setPaused(false), []);

    const handlePointerDown = useCallback(() => {
        pause();
    }, [pause]);

    const handlePointerUp = useCallback(() => {
        resume();
    }, [resume]);

    const handleTap = useCallback(
        (clientX: number, width: number) => {
            if (count <= 1 || width <= 0) {
                return;
            }
            if (clientX < width * 0.33) {
                goPrev();
            } else {
                goNext();
            }
        },
        [count, goNext, goPrev],
    );

    const handleTouchStart = useCallback(
        (event: React.TouchEvent<HTMLDivElement>) => {
            if (count <= 1) {
                return;
            }
            const touch = event.touches[0];
            touchStartRef.current = { x: touch.clientX, y: touch.clientY };
            suppressClickRef.current = false;
            pause();
        },
        [count, pause],
    );

    const handleTouchEnd = useCallback(
        (event: React.TouchEvent<HTMLDivElement>) => {
            if (count <= 1) {
                resume();
                return;
            }

            const touch = event.changedTouches[0];
            const deltaX = touch.clientX - touchStartRef.current.x;
            const deltaY = touch.clientY - touchStartRef.current.y;
            const rect = event.currentTarget.getBoundingClientRect();

            if (
                Math.abs(deltaX) > SWIPE_THRESHOLD_PX &&
                Math.abs(deltaX) > Math.abs(deltaY)
            ) {
                suppressClickRef.current = true;
                if (deltaX < 0) {
                    goNext();
                } else {
                    goPrev();
                }
            } else if (Math.abs(deltaX) <= TAP_SLOP_PX && Math.abs(deltaY) <= TAP_SLOP_PX) {
                handleTap(touch.clientX - rect.left, rect.width);
            }

            resume();
        },
        [count, goNext, goPrev, handleTap, resume],
    );

    const handleClick = useCallback(
        (event: React.MouseEvent<HTMLDivElement>) => {
            if (count <= 1 || suppressClickRef.current) {
                suppressClickRef.current = false;
                return;
            }
            const rect = event.currentTarget.getBoundingClientRect();
            handleTap(event.clientX - rect.left, rect.width);
        },
        [count, handleTap],
    );

    return {
        activeIndex,
        progress,
        paused,
        reducedMotion,
        containerRef,
        goNext,
        goPrev,
        goTo,
        pause,
        resume,
        handlePointerDown,
        handlePointerUp,
        handleTouchStart,
        handleTouchEnd,
        handleClick,
    };
}
