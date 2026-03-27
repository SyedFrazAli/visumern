import { motion } from 'framer-motion';
import { useSimulationStore } from '../../store/useSimulationStore';
import { NODE_POSITIONS, getNodeCategory } from './VisualisationCanvas';

export default function ArrowLayer() {
  const { events, currentStepIndex } = useSimulationStore();

  return (
    <>
      {events.map((event, idx) => {
        if (!event.source || !event.target) return null;

        const sourceCat = getNodeCategory(event.source);
        const targetCat = getNodeCategory(event.target);

        // Don't draw an arrow if source and target are mapped to the same main node
        if (sourceCat === targetCat) return null;

        const sourcePos = NODE_POSITIONS[sourceCat];
        const targetPos = NODE_POSITIONS[targetCat];

        // Add an offset so arrows don't start exactly at center
        const isForward = sourcePos.x < targetPos.x;
        const startX = isForward ? sourcePos.x + 60 : sourcePos.x - 60;
        const endX = isForward ? targetPos.x - 60 : targetPos.x + 60;
        const startY = sourcePos.y;
        const endY = targetPos.y;

        // Slight curve depending on step index to prevent exact overlap
        const midX = (startX + endX) / 2;
        const curveOffset = isForward ? -40 - (idx * 5) : 40 + (idx * 5); // forward goes up, backward goes down
        const pathData = `M ${startX} ${startY} Q ${midX} ${startY + curveOffset} ${endX} ${endY}`;

        const isActive = currentStepIndex === event.step;

        return (
          <g key={`arrow-${idx}`}>
            <motion.path
              d={pathData}
              fill="transparent"
              stroke={isActive ? '#60a5fa' : 'rgba(156, 163, 175, 0.2)'}
              strokeWidth="3"
              strokeDasharray={isActive ? 'none' : '4 4'}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: isActive ? 1 : (event.step < currentStepIndex ? 1 : 0),
                opacity: isActive ? 1 : (event.step < currentStepIndex ? 0.3 : 0)
              }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              markerEnd={isActive ? 'url(#arrowhead-active)' : 'url(#arrowhead-inactive)'}
            />
            {/* Tooltip for Payload on active events */}
            {isActive && event.payload ? (
              <motion.foreignObject
                x={midX - 50}
                y={startY + curveOffset - 30}
                width="100"
                height="40"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="bg-gray-800 text-xs text-blue-200 p-1 rounded border border-gray-700 shadow flex items-center justify-center truncate">
                  {typeof event.payload === 'object' ? JSON.stringify(event.payload) : String(event.payload)}
                </div>
              </motion.foreignObject>
            ) : null}
          </g>
        );
      })}

      {/* Define arrowheads */}
      <defs>
        <marker id="arrowhead-active" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#60a5fa" />
        </marker>
        <marker id="arrowhead-inactive" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="rgba(156, 163, 175, 0.4)" />
        </marker>
      </defs>
    </>
  );
}
