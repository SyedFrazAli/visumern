import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';
import { useSimulationStore } from '../../store/useSimulationStore';

export default function TimelinePanel() {
  const { events, currentStepIndex, pause } = useSimulationStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Custom setter mapped to the fact we need to update state and pause securely
  const handleStepClick = (idx: number) => {
    // Only allow jumping to completed steps or the current step,
    // though the requirement just says "click of a completed step"
    if (idx <= currentStepIndex) {
      useSimulationStore.setState({ currentStepIndex: idx });
      pause();
    }
  };

  useEffect(() => {
    // Auto sync scroll to current step
    if (scrollRef.current) {
      const activeEl = scrollRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentStepIndex]);

  return (
    <div className="w-full h-[120px] bg-gray-900 border-t border-gray-800 flex flex-col p-4 overflow-hidden">
      <h3 className="text-gray-400 text-sm font-semibold mb-2 uppercase tracking-wider">Timeline</h3>
      <div 
        ref={scrollRef}
        className="flex-1 flex items-center space-x-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-700"
      >
        {events.map((event, idx) => {
          const isActive = idx === currentStepIndex;
          const isCompleted = idx < currentStepIndex;
          const isPendingAsync = event.asyncPending && !isCompleted; // Simple check for async pending
          
          return (
            <div 
              key={`timeline-step-${idx}`}
              data-active={isActive}
              onClick={() => handleStepClick(idx)}
              className={`
                flex items-center flex-shrink-0 cursor-pointer transition-all duration-300
                ${isCompleted ? 'opacity-80 hover:opacity-100' : ''}
                ${isActive ? 'opacity-100 scale-105' : ''}
                ${!isCompleted && !isActive ? 'opacity-40 cursor-not-allowed' : ''}
              `}
            >
              {/* Step indicator circle */}
              <div 
                className={`
                  w-10 h-10 rounded-full flex justify-center items-center border-2 border-gray-700 bg-gray-800 relative z-10
                  ${isActive ? 'border-blue-500 bg-blue-900 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : ''}
                  ${isCompleted ? 'border-green-500 bg-green-900' : ''}
                `}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 text-green-400" />
                ) : isPendingAsync && isActive ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  >
                    <Loader2 className="w-5 h-5 text-blue-400" />
                  </motion.div>
                ) : (
                  <span className={`text-sm font-bold ${isActive ? 'text-blue-200' : 'text-gray-400'}`}>
                    {event.step + 1}
                  </span>
                )}
              </div>
              
              {/* Step info text */}
              <div className="ml-3 mr-4 flex flex-col">
                <span className={`text-xs font-semibold ${isActive ? 'text-blue-400' : 'text-gray-500'}`}>
                  {event.source} → {event.target || 'Self'}
                </span>
                <span className={`text-sm whitespace-nowrap ${isActive ? 'text-gray-100' : 'text-gray-400'}`}>
                  {event.action}
                </span>
              </div>
              
              {/* Connecting line (hide for last element) */}
              {idx < events.length - 1 && (
                <div className="w-12 h-[2px] bg-gray-700 ml-2" />
              )}
            </div>
          );
        })}
        {events.length === 0 && (
          <div className="text-gray-500 text-sm italic">No events in sequence yet.</div>
        )}
      </div>
    </div>
  );
}
