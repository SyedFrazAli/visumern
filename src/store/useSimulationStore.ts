import { create } from 'zustand';
import { ScenarioId, SimulationEvent, ChatMessage, ChatRole } from '../types/simulation';

interface SimulationState {
  // State
  scenarioId: ScenarioId;
  events: SimulationEvent[];
  currentStepIndex: number;
  playbackStatus: 'idle' | 'playing' | 'paused' | 'done';
  messages: ChatMessage[];

  // Actions
  setScenario: (id: ScenarioId) => void;
  run: () => Promise<void>;
  pause: () => void;
  resume: () => void;
  stepForward: () => void;
  reset: () => void;
  sendMessage: (text: string) => Promise<void>;
}

export const useSimulationStore = create<SimulationState>((set, get) => ({
  // Initial State
  scenarioId: 'react-state',
  events: [],
  currentStepIndex: 0,
  playbackStatus: 'idle',
  messages: [],

  // Implementations
  setScenario: (id: ScenarioId) => {
    console.log(`[Store] setScenario: ${id}`);
    set({ scenarioId: id, currentStepIndex: 0, playbackStatus: 'idle', events: [] });
  },

  run: async () => {
    console.log('[Store] run: Fetching events and starting playback...');
    // Placeholder logic for fetching events (to be implemented)
    const dummyEvents: SimulationEvent[] = [
      { step: 0, source: 'Browser', target: 'React', action: 'Mount', durationMs: 1000 },
    ];
    
    set({ events: dummyEvents, currentStepIndex: 0, playbackStatus: 'playing' });
  },

  pause: () => {
    const status = get().playbackStatus;
    if (status === 'playing') {
      console.log('[Store] pause: Pausing playback.');
      set({ playbackStatus: 'paused' });
    }
  },

  resume: () => {
    const status = get().playbackStatus;
    if (status === 'paused') {
      console.log('[Store] resume: Resuming playback.');
      set({ playbackStatus: 'playing' });
    }
  },

  stepForward: () => {
    const { currentStepIndex, events } = get();
    if (currentStepIndex < events.length - 1) {
      console.log(`[Store] stepForward: Advancing from step ${currentStepIndex} to ${currentStepIndex + 1}.`);
      set({ currentStepIndex: currentStepIndex + 1 });
    } else {
      console.log('[Store] stepForward: Reached end of simulation.');
      set({ playbackStatus: 'done' });
    }
  },

  reset: () => {
    console.log('[Store] reset: Resetting simulation state.');
    set({ currentStepIndex: 0, playbackStatus: 'idle', events: [] });
  },

  sendMessage: async (text: string) => {
    console.log(`[Store] sendMessage: Sending user message "${text}"...`);
    
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      text,
      timestamp: Date.now(),
    };

    set((state) => ({ messages: [...state.messages, userMessage] }));

    // Placeholder for AI reply processing
    setTimeout(() => {
      const aiReply: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        text: 'This is a placeholder reply for your message.',
        timestamp: Date.now(),
      };
      set((state) => ({ messages: [...state.messages, aiReply] }));
    }, 1000);
  },
}));
