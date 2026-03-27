import { useSimulationStore } from '../../store/useSimulationStore';
import ArrowLayer from './ArrowLayer';

// Define fixed positions for our three main architectural nodes
export const NODE_POSITIONS = {
  Client: { x: 150, y: 200 },
  Server: { x: 450, y: 200 },
  Database: { x: 750, y: 200 },
};

// Map specific sub-components (like "Browser", "React", "Express") to main nodes
export function getNodeCategory(name: string): keyof typeof NODE_POSITIONS {
  const n = name.toLowerCase();
  if (n.includes('mongo') || n.includes('db') || n.includes('database')) return 'Database';
  if (n.includes('server') || n.includes('express') || n.includes('node') || n.includes('controller')) return 'Server';
  return 'Client'; // Default fallback for Browser, React, etc.
}

export default function VisualisationCanvas() {
  const { events, currentStepIndex } = useSimulationStore();
  
  const activeEvent = events[currentStepIndex];
  
  // Determine which main nodes are active based on the current event
  let activeSourceCat = '';
  let activeTargetCat = '';
  
  if (activeEvent) {
    if (activeEvent.source) activeSourceCat = getNodeCategory(activeEvent.source);
    if (activeEvent.target) activeTargetCat = getNodeCategory(activeEvent.target);
  }

  const nodes = (Object.keys(NODE_POSITIONS) as Array<keyof typeof NODE_POSITIONS>).map((cat) => {
    const { x, y } = NODE_POSITIONS[cat];
    const isActive = cat === activeSourceCat || cat === activeTargetCat;
    
    return (
      <g key={cat} transform={`translate(${x}, ${y})`}>
        <rect
          x={-60}
          y={-40}
          width={120}
          height={80}
          rx={8}
          fill={isActive ? '#3b82f6' : '#1f2937'}
          stroke={isActive ? '#60a5fa' : '#374151'}
          strokeWidth={2}
          className={`transition-colors duration-300`}
        />
        <text
          x={0}
          y={5}
          textAnchor="middle"
          fill={isActive ? '#ffffff' : '#9ca3af'}
          className="text-sm font-semibold select-none"
        >
          {cat}
        </text>
      </g>
    );
  });

  return (
    <div className="w-full h-[400px] bg-gray-950 border border-gray-800 rounded-xl overflow-hidden relative shadow-inner">
      <svg className="w-full h-full" viewBox="0 0 900 400">
        {/* Draw abstract connecting lines */}
        <line x1={NOTE_POSITIONS.Client.x + 60} y1={200} x2={NOTE_POSITIONS.Server.x - 60} y2={200} stroke="#374151" strokeWidth="2" strokeDasharray="4 4" />
        <line x1={NOTE_POSITIONS.Server.x + 60} y1={200} x2={NOTE_POSITIONS.Database.x - 60} y2={200} stroke="#374151" strokeWidth="2" strokeDasharray="4 4" />
        
        {/* Render Arrows Layer */}
        <ArrowLayer />

        {/* Render Nodes */}
        {nodes}
      </svg>
    </div>
  );
}

// Quick typo fix for the lines above:
const NOTE_POSITIONS = NODE_POSITIONS;
