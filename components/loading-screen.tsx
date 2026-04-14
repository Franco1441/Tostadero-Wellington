'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [percent, setPercent] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [videoAvailable, setVideoAvailable] = useState<boolean | null>(null);
  const [showBlue, setShowBlue] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent((prev) => {
        const next = prev + Math.floor(Math.random() * 5) + 2;
        if (next >= 100) {
          clearInterval(interval);
          // show a solid blue overlay, then unmount and notify parent
          setTimeout(() => setShowBlue(true), 200);
          setTimeout(() => setIsComplete(true), 600);
          setTimeout(onComplete, 1200);
          return 100;
        }
        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 bg-primary md:bg-transparent z-[9999] flex items-center justify-center text-primary-foreground overflow-hidden"
        >
          {/* Video full-bleed como fondo; overlay para texto */}
          {videoAvailable !== false ? (
            <>
              {/* Mobile: full-bleed background video */}
              <div className="absolute inset-0 z-0 md:hidden">
                <video
                  autoPlay
                  muted
                  playsInline
                  loop
                  onError={() => setVideoAvailable(false)}
                  onLoadedData={() => setVideoAvailable(true)}
                  className="w-full h-full object-cover"
                  style={{ minHeight: '100vh' }}
                  aria-hidden
                >
                  {/* Mobile prefers MP4 (fallback) for best compatibility */}
                  <source src="/loading-animation.mp4" type="video/mp4" />
                  <source src="/loading-animation.webm" type="video/webm" />
                </video>
              </div>

              {/* Desktop: full-bleed background video (use PC-specific file if present) */}
              <div className="hidden md:block absolute inset-0 z-0">
                <video
                  autoPlay
                  muted
                  playsInline
                  loop
                  onError={() => setVideoAvailable(false)}
                  onLoadedData={() => setVideoAvailable(true)}
                  className="w-full h-full object-cover"
                  aria-hidden
                >
                  <source src="/loading-animation-pc.mp4" type="video/mp4" />
                  <source src="/loading-animation.webm" type="video/webm" />
                  <source src="/loading-animation.mp4" type="video/mp4" />
                </video>
              </div>
            </>
          ) : (
            <>
              {/* Mobile fallback SVG */}
              <div className="absolute inset-0 z-0 flex items-center justify-center md:hidden bg-primary">
                <div className="w-[70vw] max-w-[260px]">
                  <svg
                    viewBox="0 0 200 200"
                    className="w-full h-auto"
                    style={{ overflow: 'visible' }}
                  >
                  {/* Taza - vista cenital (círculo exterior) */}
                  <circle 
                    cx="85" 
                    cy="110" 
                    r="42" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="4"
                    opacity="0.9"
                  />
                  
                  {/* Café dentro de la taza */}
                  <circle 
                    cx="85" 
                    cy="110" 
                    r="35" 
                    fill="currentColor" 
                    opacity="0.15"
                  />
                  
                  {/* Remolino del café - animado */}
                  <motion.g
                    style={{ transformOrigin: '85px 110px' }}
                    animate={{ rotate: 360 }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      ease: 'linear' 
                    }}
                  >
                    <path 
                      d="M85 90 Q95 100 85 110 Q75 120 85 130" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      opacity="0.5"
                    />
                  </motion.g>
                  
                  {/* Asa de la taza */}
                  <path 
                    d="M127 100 Q145 100 145 115 Q145 130 127 130" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="4"
                    strokeLinecap="round"
                    opacity="0.9"
                  />
                </svg>
                </div>
              </div>

              {/* Desktop fallback SVG centered and smaller */}
              <div className="hidden md:flex absolute inset-0 z-0 items-center justify-center bg-primary">
                <div className="w-[40vw] max-w-[420px]">
                  <svg
                    viewBox="0 0 200 200"
                    className="w-full h-auto"
                    style={{ overflow: 'visible' }}
                  >
                    {/* Taza - vista cenital (círculo exterior) */}
                    <circle
                      cx="85"
                      cy="110"
                      r="42"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      opacity="0.9"
                    />

                    {/* Café dentro de la taza */}
                    <circle
                      cx="85"
                      cy="110"
                      r="35"
                      fill="currentColor"
                      opacity="0.15"
                    />

                    {/* Remolino del café - animado */}
                    <motion.g
                      style={{ transformOrigin: '85px 110px' }}
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    >
                      <path
                        d="M85 90 Q95 100 85 110 Q75 120 85 130"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        opacity="0.5"
                      />
                    </motion.g>

                    {/* Asa de la taza */}
                    <path
                      d="M127 100 Q145 100 145 115 Q145 130 127 130"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      opacity="0.9"
                    />
                  </svg>
                </div>
              </div>
            </>
          )}

          {/* Solid blue overlay shown briefly when loading completes */}
          {showBlue && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0 z-20 bg-primary"
            />
          )}

          {/* Overlay del porcentaje debajo de la taza (posicionado relativo al centro) */}
          <div className="absolute inset-0 z-30 pointer-events-none">
            <div className="absolute left-1/2 top-[58%] md:top-[58%] -translate-x-1/2 text-center pointer-events-none">
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <span className="font-serif text-4xl italic text-white opacity-95">
                  {percent}%
                </span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
