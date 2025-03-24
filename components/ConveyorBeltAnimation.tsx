"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion, AnimatePresence, useAnimationFrame } from "framer-motion"
import { Bot, Zap, Smartphone, Database, Layout, BookOpen } from "lucide-react"

export default function ConveyorBeltAnimation() {
  // State and refs
  const [dataItems, setDataItems] = useState<{ 
    id: number; 
    repository: string;
    title: string;
    processed: boolean; 
    position: number 
  }[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const processorPosition = useMemo(() => isMobile ? 0.65 : 0.85, [isMobile])
  const processingDistance = useMemo(() => isMobile ? 60 : 80, [isMobile])
  const processingThreshold = useMemo(() => isMobile ? 0.5 : 0.7, [isMobile])
  const lastUpdateTimeRef = useRef<number>(0)
  const speedFactor = isMobile ? 0.50 : 0.30
  const itemsToRemoveRef = useRef<Set<number>>(new Set())
  const frameSkipCountRef = useRef(0) // Skip frames for smoother performance

  // Memoize static values
  const repositories = useMemo(() => [
    "main/core", 
    "ui/components", 
    "docs/guides", 
    "mobile/app", 
    "api/endpoints", 
    "utils/helpers"
  ], [])
  
  const issueTitles = useMemo(() => [
    "Fix navigation bug",
    "Add dark mode",
    "Update docs",
    "Performance issue",
    "UI inconsistency",
    "Support for mobile",
    "Login fails on Safari",
    "Add export option",
    "Improve accessibility",
    "Fix broken links",
    "Memory leak",
    "Add unit tests"
  ], [])
  
  // Optimize resize listener with mobile detection
  const updateWidth = useCallback(() => {
    if (containerRef.current) {
      const width = containerRef.current.offsetWidth
      setContainerWidth(width)
      setIsMobile(width < 768) // Set mobile breakpoint at 768px
    }
  }, [])

  useEffect(() => {
    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [updateWidth])

  // Optimize data item creation
  useEffect(() => {
    // Create initial batch of items immediately
    setDataItems(() => {
      const initialItems = [];
      // Reduce initial count - start with fewer items
      const initialCount = isMobile ? 1 : 2; 
      
      for (let i = 0; i < initialCount; i++) {
        const randomRepo = repositories[Math.floor(Math.random() * repositories.length)];
        const randomTitle = issueTitles[Math.floor(Math.random() * issueTitles.length)];
        
        initialItems.push({
          id: Date.now() - (i * 100), // Ensure unique IDs
          repository: randomRepo,
          title: randomTitle,
          processed: false,
          position: i * 2, // Space them out initially
        });
      }
      
      return initialItems;
    });
    
    // Add a delay before starting to spawn new items
    const spawnTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDataItems((prev) => {
          // Reduce max items count
          const maxItems = isMobile ? 2 : 4; 
          if (prev.length < maxItems) {
            const randomRepo = repositories[Math.floor(Math.random() * repositories.length)]
            const randomTitle = issueTitles[Math.floor(Math.random() * issueTitles.length)]
            
            return [
              ...prev,
              {
                id: Date.now(),
                repository: randomRepo,
                title: randomTitle,
                processed: false,
                position: 0,
              },
            ]
          }
          return prev
        })
      }, isMobile ? 3000 : 2000) // Increase interval time to slow down spawning
      
      return () => clearInterval(interval)
    }, 2000) // Wait 2 seconds before starting to spawn new items

    return () => clearTimeout(spawnTimeout)
  }, [repositories, issueTitles, isMobile])

  // More efficient frame animation with batch updates and frame skipping
  useAnimationFrame((time) => {
    if (!lastUpdateTimeRef.current) {
      lastUpdateTimeRef.current = time
      return
    }

    const deltaTime = time - lastUpdateTimeRef.current
    if (deltaTime < 16) return // Skip if less than 16ms (60fps)

    // Skip some frames to reduce CPU load (process every 2nd frame)
    frameSkipCountRef.current = (frameSkipCountRef.current + 1) % 2
    if (frameSkipCountRef.current !== 0) return
    
    lastUpdateTimeRef.current = time

    // Process removals in batch instead of multiple setState calls
    if (itemsToRemoveRef.current.size > 0) {
      setDataItems(current => current.filter(item => !itemsToRemoveRef.current.has(item.id)))
      itemsToRemoveRef.current.clear()
    }

    setDataItems(prev => {
      let needsUpdate = false
      const updated = prev.map(item => {
        // Optimize calculation: only update position for visible items
        if (item.position > 1.2) {
          if (!itemsToRemoveRef.current.has(item.id)) {
            itemsToRemoveRef.current.add(item.id)
            needsUpdate = true
          }
          return item
        }
        
        const newPosition = item.position + 0.0003 * deltaTime * speedFactor
        const itemPixelPosition = newPosition * containerWidth
        const processorPixelPosition = processorPosition * containerWidth
        const distance = Math.abs(processorPixelPosition - itemPixelPosition)

        let processed = item.processed

        // Handle processing state transition
        if (!processed && distance < processingDistance && newPosition > processingThreshold) {
          processed = true
          needsUpdate = true
          
          // Queue removal instead of using setTimeout
          setTimeout(() => {
            itemsToRemoveRef.current.add(item.id)
          }, 1200)
        }
        
        // Only mark for update if position actually changed significantly
        if (Math.abs(newPosition - item.position) > 0.001) {
          needsUpdate = true
        }

        return {
          ...item,
          position: newPosition,
          processed,
        }
      })

      // Only trigger re-render if something actually changed
      return needsUpdate ? updated : prev
    })
  })

  // Memoize icon selector function
  const getRepoIcon = useCallback((repo: string) => {
    // Simple mapping based on repository path
    if (repo.includes("mobile")) return <Smartphone className="w-5 h-5 text-white" />
    if (repo.includes("docs")) return <BookOpen className="w-5 h-5 text-white" />
    if (repo.includes("api")) return <Database className="w-5 h-5 text-white" />
    if (repo.includes("ui")) return <Layout className="w-5 h-5 text-white" />
    // Default for main/core and any others
    return <Zap className="w-5 h-5 text-white" />
  }, [])

  // Get background color based on repository
  const getRepoColor = useCallback((repo: string) => {
    // Simple mapping based on repository path
    if (repo.includes("mobile")) return "#f87171"; // red
    if (repo.includes("docs")) return "#34d399"; // green
    if (repo.includes("api")) return "#a78bfa"; // purple
    if (repo.includes("ui")) return "#60a5fa"; // blue
    if (repo.includes("utils")) return "#fbbf24"; // yellow/amber
    // Default for main/core and any others
    return "#94a3b8"; // slate
  }, [])

  // Memoize belt sections with responsive counts
  const beltSections = useMemo(() => Array.from({ length: isMobile ? 10 : 30 }), [isMobile])
  const beltTopDetails = useMemo(() => Array.from({ length: isMobile ? 10 : 20 }), [isMobile])
  const beltBottomDetails = useMemo(() => Array.from({ length: isMobile ? 10 : 20 }), [isMobile])
  const conveyorSupports = useMemo(() => Array.from({ length: isMobile ? 3 : 5 }), [isMobile])

  // Memoize animation configurations
  const beltAnimation = useMemo(() => ({
    x: ["-50%", "0%"],
    transition: {
      repeat: Number.POSITIVE_INFINITY,
      duration: 6,
      ease: "linear",
      repeatType: "loop" as const,
    }
  }), [])

  const rollerAnimation = useMemo(() => ({
    rotate: 360,
    transition: {
      repeat: Number.POSITIVE_INFINITY, 
      duration: 8,
      ease: "linear",
      repeatType: "loop" as const,
    }
  }), [])

  const processorAnimation = useMemo(() => ({
    scale: [1, 1.03, 1],
    boxShadow: [
      "0 0 0 rgba(59, 130, 246, 0.5)",
      "0 0 30px rgba(59, 130, 246, 0.8)",
      "0 0 0 rgba(59, 130, 246, 0.5)",
    ],
    transition: {
      repeat: Number.POSITIVE_INFINITY,
      duration: 3,
      ease: "easeInOut",
      repeatType: "reverse" as const,
    }
  }), [])

  const processorGlowAnimation = useMemo(() => ({
    background: [
      "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0) 70%)",
      "radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, rgba(59, 130, 246, 0) 70%)",
      "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0) 70%)",
    ],
    transition: {
      repeat: Number.POSITIVE_INFINITY,
      duration: 3,
      ease: "easeInOut",
      repeatType: "reverse" as const,
    }
  }), [])

  return (
    <div
      ref={containerRef}
      className="relative mb-12 w-full h-[300px] md:h-[400px] bg-[#0F172A] rounded-xl overflow-hidden border border-[#1E293B] shadow-2xl"
    >
      {/* Grid background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
          linear-gradient(to right, rgba(96, 165, 250, 0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(96, 165, 250, 0.05) 1px, transparent 1px)
        `,
          backgroundSize: isMobile ? "30px 30px" : "40px 40px",
        }}
      />

      {/* Conveyor belt base - Simplified animation with memoized animation */}
      <div className="absolute bottom-[60px] md:bottom-[80px] left-0 right-0 h-16 md:h-20 bg-[#1E293B] border-t-2 border-b-2 border-[#2D3B4F] z-0">
        <div className="relative h-full overflow-hidden">
          <div className="absolute inset-0">
            <motion.div
              className="h-full w-[200%] flex"
              animate={beltAnimation}
              style={{ willChange: "transform" }}
            >
              {beltSections.map((_, i) => (
                <div key={i} className="h-full border-r border-[#2D3B4F] flex-1 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#3B82F6] opacity-20"></div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Belt details */}
        <div className="absolute top-0 left-0 right-0 h-2 flex justify-between px-2">
          {beltTopDetails.map((_, i) => (
            <div key={`top-${i}`} className="w-1 h-1 rounded-full bg-[#3B82F6] opacity-30"></div>
          ))}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-2 flex justify-between px-2">
          {beltBottomDetails.map((_, i) => (
            <div key={`bottom-${i}`} className="w-1 h-1 rounded-full bg-[#3B82F6] opacity-30"></div>
          ))}
        </div>
      </div>

      {/* Conveyor belt rollers - Updated to use memoized animations */}
      <div className="absolute bottom-[45px] md:bottom-[60px] left-2 md:left-4 w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#1E293B] border-4 border-[#2D3B4F] z-50 flex items-center justify-center">
        <motion.div
          className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#2D3B4F] flex items-center justify-center"
          animate={rollerAnimation}
          style={{ willChange: "transform" }}
        >
          <div className="w-4 md:w-6 h-1 bg-[#3B82F6] opacity-30"></div>
        </motion.div>
      </div>

      <div className="absolute bottom-[45px] md:bottom-[60px] right-2 md:right-4 w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#1E293B] border-4 border-[#2D3B4F] z-50 flex items-center justify-center">
        <motion.div
          className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#2D3B4F] flex items-center justify-center"
          animate={rollerAnimation}
          style={{ willChange: "transform" }}
        >
          <div className="w-4 md:w-6 h-1 bg-[#3B82F6] opacity-30"></div>
        </motion.div>
      </div>

      {/* AI Processor - Using memoized animations */}
      <div className="absolute right-6 md:right-10 bottom-[90px] md:bottom-[120px] flex flex-col items-center">
        <div className="text-[#60A5FA] text-sm md:text-base font-semibold mb-2 z-10">AI Agent</div>
        
        <motion.div
          className="w-24 h-24 md:w-32 md:h-32 bg-[#1E293B] rounded-full flex items-center justify-center shadow-lg relative overflow-hidden z-10"
          initial={{ scale: 1 }}
          animate={processorAnimation}
          style={{ willChange: "transform" }}
        >
          <Bot className="w-12 h-12 md:w-16 md:h-16 text-[#60A5FA]" />
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={processorGlowAnimation}
          />
        </motion.div>
      </div>

      {/* GitHub issue items */}
      <AnimatePresence mode="popLayout">
        {dataItems.map((item) => {
          // Don't render items that are far offscreen - More aggressive on mobile
          if (item.position > (isMobile ? 1.1 : 1.3)) return null;
          
          const isProcessed = item.processed;
          const repoColor = getRepoColor(item.repository);
          
          return (
            <motion.div
              key={item.id}
              className="absolute bottom-[80px] md:bottom-[110px] z-10"
              style={{
                left: `${item.position * 100}%`,
                x: "-50%",
                willChange: "transform" // Performance hint for browsers
              }}
              layout
              layoutId={`item-${item.id}`}
              animate={
                isProcessed
                  ? {
                      y: [-10, -50],
                      opacity: [1, 0],
                      scale: [1, 0.5],
                      rotate: [0, 45],
                    }
                  : isMobile 
                    ? {} // No animation at all on mobile when not processed
                    : {
                        y: [0, -2, 0],
                        transition: {
                          y: {
                            repeat: Number.POSITIVE_INFINITY,
                            duration: 1.5,
                            ease: "easeInOut",
                          },
                        },
                      }
              }
              exit={{
                opacity: 0,
                scale: 0,
                transition: { duration: 0.3, ease: "easeOut" },
              }}
              transition={{
                duration: isProcessed ? 1 : 0.2,
                ease: "easeInOut",
                layout: { duration: 0.1, ease: "linear" },
              }}
            >
              <div className="relative flex flex-col items-center">
                <motion.div
                  className={`w-32 md:w-48 flex flex-col rounded-md ${
                    isProcessed ? "bg-[#1E293B]/80" : "bg-[#1E293B]/90"
                  } backdrop-blur-sm p-2 shadow-lg`}
                  style={{ 
                    willChange: isProcessed ? "transform, opacity, background-color" : "transform"
                  }}
                  animate={
                    isProcessed
                      ? {
                          boxShadow: ["0 0 0 rgba(59, 130, 246, 0)", "0 0 20px rgba(59, 130, 246, 0.8)"],
                        }
                      : isMobile 
                        ? {} // No animation on mobile when not processed
                        : {
                            boxShadow: [
                              "0 0 0 rgba(59, 130, 246, 0.2)",
                              "0 0 8px rgba(59, 130, 246, 0.6)",
                              "0 0 0 rgba(59, 130, 246, 0.2)",
                            ],
                          }
                  }
                  transition={{
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div 
                      className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center" 
                      style={{ backgroundColor: repoColor }}
                    >
                      {getRepoIcon(item.repository)}
                    </div>
                    <span className="text-xs font-medium text-white truncate flex-1">{item.title}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-gray-400">
                    <span className="truncate">{item.repository}</span>
                  </div>
                  
                  {isProcessed && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center bg-[#3B82F6]/40 rounded-md"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      style={{ willChange: "opacity" }}
                    >
                      <Zap className="w-8 h-8 text-white" />
                    </motion.div>
                  )}
                </motion.div>
                {isProcessed && !isMobile && ( // Skip extra glow effect on mobile
                  <motion.div
                    className="absolute -inset-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.8, 0] }}
                    transition={{ duration: 0.8 }}
                    style={{ willChange: "opacity" }}
                  >
                    <div className="w-full h-full bg-[#3B82F6] rounded-full filter blur-md" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>

      {/* Conveyor supports - Updated for responsive */}
      <div className="absolute bottom-[30px] md:bottom-[40px] z-10 left-0 right-0 h-[30px] md:h-[40px] flex justify-around">
        {conveyorSupports.map((_, i) => (
          <div key={i} className="w-6 md:w-8 h-full bg-[#1E293B] rounded-t-md" />
        ))}
      </div>

      {/* Glow effects - Updated for responsive */}
      <div className="absolute right-6 md:right-10 bottom-[90px] md:bottom-[120px] w-24 h-24 md:w-32 md:h-32 rounded-full bg-[#3B82F6]/20 filter blur-xl" />
    </div>
  )
}