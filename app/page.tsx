"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
// import ConveyorBeltAnimation from "@/components/ConveyorBeltAnimation"

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [displayHeading, setDisplayHeading] = useState("")
  const [displayDescription, setDisplayDescription] = useState("")
  const [showHeadingCursor, setShowHeadingCursor] = useState(true)
  const [showDescriptionCursor, setShowDescriptionCursor] = useState(false)
  
  const fullHeading = "executable code datasets for AI"
  const fullDescription = "building large-scale code datasets to train and evaluate code agents"
  
  useEffect(() => {
    // Type the heading
    let headingIndex = 0
    const headingInterval = setInterval(() => {
      if (headingIndex <= fullHeading.length) {
        setDisplayHeading(fullHeading.slice(0, headingIndex))
        headingIndex++
      } else {
        clearInterval(headingInterval)
        // Hide heading cursor and start typing description
        setTimeout(() => {
          setShowHeadingCursor(false)
          setShowDescriptionCursor(true)
          
          // Type the description
          let descriptionIndex = 0
          const descriptionInterval = setInterval(() => {
            if (descriptionIndex <= fullDescription.length) {
              setDisplayDescription(fullDescription.slice(0, descriptionIndex))
              descriptionIndex++
            } else {
              clearInterval(descriptionInterval)
              // Hide description cursor when done
              setTimeout(() => {
                setShowDescriptionCursor(false)
              }, 500)
            }
          }, 30) // Faster typing for description
        }, 500)
      }
    }, 50)
    
    return () => clearInterval(headingInterval)
  }, [])

  return (
    <div className="min-h-screen relative flex flex-col overflow-hidden font-ibm-mono">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/background.webp"
          alt="Background"
          fill
          priority
          className="object-cover object-top"
          sizes="100vw"
        />
        <div className="fixed bottom-0 left-0 right-0 z-0 flex justify-center pointer-events-none">
          <Image
            src="/bottom.webp"
            alt="Bottom Background"
            width={1500}
            height={800}
            priority
            className="object-cover object-bottom w-auto h-[60vh] 2xl:h-[65vh]"
          />
        </div>
      </div>

      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-20 px-4 py-6 backdrop-blur-sm">
        <nav className="flex items-center justify-between md:justify-center md:gap-8">
          <Link href="#" onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}>
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Company%20Logo-JsOfHZ9d6BDOHKAfZ1zx71BLYUE7dw.svg"
              alt="Codeset"
              width={120}
              height={24}
              className="text-white"
            />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#services" onClick={(e) => {
              e.preventDefault();
              document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
            }} className="text-sm text-white opacity-80 hover:opacity-100 transition-opacity">
              services
            </Link>
            <Link href="#team" onClick={(e) => {
              e.preventDefault();
              document.getElementById('team')?.scrollIntoView({ behavior: 'smooth' });
            }} className="text-sm text-white opacity-80 hover:opacity-100 transition-opacity">
              team
            </Link>
            <Link href="#contacts" onClick={(e) => {
              e.preventDefault();
              document.getElementById('contacts')?.scrollIntoView({ behavior: 'smooth' });
            }} className="text-sm text-white opacity-80 hover:opacity-100 transition-opacity">
              contacts
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white z-50 relative"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </nav>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-md z-40 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-8 p-8 w-full max-w-sm">
              <Link 
                href="#services" 
                className="text-xl text-white font-medium opacity-90 hover:opacity-100 transition-all hover:scale-105"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                services
              </Link>
              <Link 
                href="#team" 
                className="text-xl text-white font-medium opacity-90 hover:opacity-100 transition-all hover:scale-105"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  document.getElementById('team')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                team
              </Link>
              <Link 
                href="#contacts" 
                className="text-xl text-white font-medium opacity-90 hover:opacity-100 transition-all hover:scale-105"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  document.getElementById('contacts')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                contacts
              </Link>
              <div className="pt-8 border-t border-white/20 w-24 mt-4"></div>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="relative z-[5] flex flex-col pt-24">
        {/* Hero Section */}
        <div className="min-h-screen px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-5xl md:text-6xl mb-4 tracking-tight text-white whitespace-pre-line">
              {displayHeading}
              {showHeadingCursor && (
                <span className="inline-block w-[0.1em] h-[1em] bg-white animate-blink ml-1 align-middle"></span>
              )}
            </h1>
            <p className="text-base sm:text-lg text-white opacity-80 max-w-2xl mx-auto">
              {displayDescription}
              {showDescriptionCursor && (
                <span className="inline-block w-[0.1em] h-[1em] bg-white animate-blink ml-1 align-middle"></span>
              )}
            </p>
          </div>
        </div>
        
        {/* Additional Sections - Combined with continuous gradient */}
        <section className="bg-gradient-to-b from-transparent via-black/70 to-black/90 backdrop-blur-md relative z-10">
          {/* Services Section */}
          <div id="services" className="min-h-screen py-24">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-3xl md:text-4xl text-white mb-12 text-center">Our Services</h2>
              {/* <ConveyorBeltAnimation className="mb-12" /> */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Service Cards */}
                <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10 hover:border-white/20 transition-all">
                  <h3 className="text-xl text-white mb-3">🚀 Train Smarter</h3>
                  <p className="text-white/70">Use Codeset's high-quality datasets crafted for real-world LLM training.</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10 hover:border-white/20 transition-all">
                  <h3 className="text-xl text-white mb-3">🔍 Reliable Benchmarks</h3>
                  <p className="text-white/70">Evaluate LLM capabilities with Codeset's reliable, software-engineering-focused benchmarks.</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10 hover:border-white/20 transition-all">
                  <h3 className="text-xl text-white mb-3">🏢 Tailor-Made Datasets</h3>
                  <p className="text-white/70">Create custom datasets from your internal codebase, ensuring AI models align with your unique needs.</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10 hover:border-white/20 transition-all">
                  <h3 className="text-xl text-white mb-3">🌐 Seamless Access</h3>
                  <p className="text-white/70">Leverage our web-based platform and API to integrate directly into your workflow.</p>
                </div>
              </div>
              
              {/* Diagram */}
              <div className="mt-16 flex justify-center hidden md:flex">
                <div className="relative w-full max-w-7xl">
                  <Image
                    src="/diagram.png"
                    alt="Process Diagram"
                    width={1200}
                    height={400}
                    className="mx-auto"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Team Section */}
          <div id="team" className="min-h-screen py-24">
            <div className="max-w-6xl mx-auto px-4">
              <h2 className="text-3xl md:text-4xl text-white mb-12 text-center">Our Team</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                {/* Team Member Cards */}
                <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10 hover:border-white/20 transition-all text-center">
                  <div className="relative w-48 h-48 rounded-full overflow-hidden mx-auto mb-4">
                    <Image
                      src="/andre.jpeg"
                      alt="André Silva"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-xl text-white mb-1">André Silva</h3>
                  <p className="text-white/70 mb-3">Co-Founder</p>
                  <p className="text-white/60 text-sm mb-4">Expert in machine learning on code, creator of RepairBench. Interned at Microsoft.</p>
                  <div className="flex justify-center space-x-4">
                    <a href="https://www.linkedin.com/in/andre15silva" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
                      </svg>
                    </a>
                    <a href="https://x.com/andre15silva_" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
                      </svg>
                    </a>
                    <a href="https://github.com/andre15silva" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                    <a href="https://scholar.google.com/citations?hl=en&user=PZoplKIAAAAJ" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"/>
                        <path d="M12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm-1 3h2v6h-2v-6zm0-2h2v2h-2v-2z"/>
                      </svg>
                    </a>
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10 hover:border-white/20 transition-all text-center">
                  <div className="relative w-48 h-48 rounded-full overflow-hidden mx-auto mb-4">
                    <Image
                      src="/nuno.png"
                      alt="Nuno Saavedra"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-xl text-white mb-1">Nuno Saavedra</h3>
                  <p className="text-white/70 mb-3">Co-Founder</p>
                  <p className="text-white/60 text-sm text-left mb-4">Expert in software reliability, data mining, and IaC. Published at all top 3 SWE conferences (<a href="https://conf.researchr.org/series/icse" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/80">ICSE</a>, <a href="https://conf.researchr.org/series/fse" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/80">FSE</a>, <a href="https://conf.researchr.org/series/ase" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/80">ASE</a>).</p>
                  <div className="flex justify-center space-x-4">
                    <a href="https://www.linkedin.com/in/nuno-saavedra" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
                      </svg>
                    </a>
                    <a href="https://x.com/nunofsaavedra" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
                      </svg>
                    </a>
                    <a href="https://github.com/nfsaavedra" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                    <a href="https://scholar.google.com/citations?hl=en&user=iYiwTYUAAAAJ" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"/>
                        <path d="M12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm-1 3h2v6h-2v-6zm0-2h2v2h-2v-2z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Added collaborative project information */}
              <div className="mt-12 bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10 hover:border-white/20 transition-all text-center max-w-2xl mx-auto">
                <p className="text-white/80 text-md font-bold">Co-creators of <a href="https://github.com/gitbugactions/gitbugactions" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/80">GitBug-Actions</a>, a tool for generating executable and reproducible datasets to advance AI-driven program repair and fault localization.</p>
              </div>
            </div>
          </div>
          
          {/* Contacts Section */}
          <div id="contacts" className="min-h-screen py-24">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-4xl text-white mb-8">Get in Touch</h2>
              <p className="text-white/70 mb-12 max-w-2xl mx-auto">Ready to elevate your AI models with high-quality code datasets? Let's collaborate on your next breakthrough.</p>
              
              <div className="flex flex-col items-center justify-center">
                <a 
                  href="mailto:andre@codeset.ai,nuno@codeset.ai" 
                  className="flex items-center gap-3 px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail">
                    <rect width="20" height="16" x="2" y="4" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  <span>Email Us</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Code comments */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-[1]">
        <div className="absolute top-[43%] left-[35%] max-2xl:left-[30%] text-white opacity-40 text-sm hidden lg:block">// datasets</div>
        <div className="absolute top-[47%] left-[60%] max-2xl:left-[67%] text-white opacity-40 text-sm hidden lg:block">// agents</div>
        <div className="absolute bottom-[30%] left-[28%] max-2xl:left-[23%] text-white opacity-40 text-sm hidden lg:block">// reliable</div>
        <div className="absolute bottom-[25%] right-[30%] max-2xl:right-[23%] text-white opacity-40 text-sm hidden lg:block">// software engineering</div>
      </div>
    </div>
  )
}