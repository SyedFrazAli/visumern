import { useRef, useCallback, useEffect } from 'react';
import { useSimulationStore } from '../store/useSimulationStore';

export function useSimulationRunner() {
  const events = useSimulationStore((state) => state.events);


  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const asyncPendingRef = useRef<boolean>(false);
  const pendingResolvedByRef = useRef<number | null>(null);

  const playStep = useCallback(
    (index: number) => {
      // 1. Check bounds
      if (index >= events.length) {
        useSimulationStore.setState({ playbackStatus: 'done' });
        return;
      }

      // 2. Update store to currentStepIndex = index
      useSimulationStore.setState({ currentStepIndex: index });
      const currentEvent = events[index];

      // 3. When a step that resolves an async event is executed, check if any pending 
      // event is waiting for this index; if so, clear pending and continue.
      if (asyncPendingRef.current && pendingResolvedByRef.current === index) {
        asyncPendingRef.current = false;
        pendingResolvedByRef.current = null;
        useSimulationStore.setState({ playbackStatus: 'playing' });
      }

      // 4. If asyncPending true, set internal flag and stop.
      if (currentEvent.asyncPending) {
        asyncPendingRef.current = true;
        pendingResolvedByRef.current = currentEvent.resolvedBy ?? null;
        return;
      }

      // 5. Check status: Only schedule if currently 'playing'
      if (useSimulationStore.getState().playbackStatus !== 'playing') {
        return;
      }

      // 6. Else, schedule next step after durationMs (or 0)
      const duration = currentEvent.durationMs ?? 800;
      timerRef.current = setTimeout(() => {
        playStep(index + 1);
      }, duration);
    },
    [events]
  );

  const run = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const state = useSimulationStore.getState();
    if (state.events.length === 0 || state.currentStepIndex >= state.events.length) return;

    useSimulationStore.setState({ playbackStatus: 'playing' });
    playStep(state.currentStepIndex);
  }, [playStep]);

  const pause = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    useSimulationStore.setState({ playbackStatus: 'paused' });
  }, []);

  const resume = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const state = useSimulationStore.getState();
    if (state.events.length === 0 || state.currentStepIndex >= state.events.length) return;

    useSimulationStore.setState({ playbackStatus: 'playing' });
    playStep(state.currentStepIndex);
  }, [playStep]);

  const stepForward = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const state = useSimulationStore.getState();

    if (state.currentStepIndex >= events.length - 1) {
      if (state.currentStepIndex === events.length - 1) {
        useSimulationStore.setState({ playbackStatus: 'done' });
      }
      return;
    }

    useSimulationStore.setState({ playbackStatus: 'paused' });
    playStep(state.currentStepIndex + 1);
  }, [events.length, playStep]);

  const reset = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    useSimulationStore.setState({ currentStepIndex: 0, playbackStatus: 'idle' });
    asyncPendingRef.current = false;
    pendingResolvedByRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return {
    run,
    pause,
    resume,
    stepForward,
    reset,
  };
}
