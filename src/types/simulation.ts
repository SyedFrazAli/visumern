/**
 * VisuMERN – Simulation Types
 * Defines all shared types used across the store and simulation runner.
 */

// ─── Scenario ────────────────────────────────────────────────────────────────

export type ScenarioId = 'react-state' | 'props-flow' | 'request-flow';

// ─── Simulation Event ────────────────────────────────────────────────────────

/**
 * A single discrete event in a simulation scenario.
 *
 * @property step         - Zero-based index of this event in the sequence.
 * @property source       - The architectural node that originates the action
 *                          (e.g. "Browser", "React", "Express", "MongoDB").
 * @property target       - The node that receives / processes the action.
 * @property action       - Short label describing what is happening
 *                          (e.g. "setState", "HTTP GET", "query").
 * @property payload      - Optional arbitrary data carried by the event
 *                          (request body, query result, new state value, …).
 * @property editorLine   - Optional 1-based line number in the code snippet
 *                          panel that should be highlighted during this event.
 * @property asyncPending - When true the event represents an in-flight
 *                          asynchronous operation (e.g. a fetch that has not
 *                          yet resolved).
 * @property resolvedBy   - Step index of the event that resolves this async
 *                          operation.  Only meaningful when asyncPending is
 *                          true.
 * @property durationMs   - How long the playback engine should pause on this
 *                          event before advancing automatically (milliseconds).
 */
export interface SimulationEvent {
  step: number;
  source: string;
  target: string;
  action: string;
  payload?: unknown;
  editorLine?: number;
  asyncPending?: boolean;
  resolvedBy?: number;
  durationMs: number;
}

// ─── Chat ────────────────────────────────────────────────────────────────────

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  timestamp: number; // Unix ms
}
