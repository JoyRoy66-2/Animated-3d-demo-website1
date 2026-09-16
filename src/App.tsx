import { useState, useEffect, useRef } from 'react';

function useTypewriter(text: string, speed = 38, startDelay = 600) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    let interval: ReturnType<typeof setInterval>;

    timeout = setTimeout(() => {
      let i = 0;
      interval = setInterval(() => {
        setDisplayed(text.substring(0, i + 1));
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
}

function useVideoScrubber() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetTimeRef = useRef(0);
  const isSeekingRef = useRef(false);
  const prevXRef = useRef<number | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      targetTimeRef.current = video.currentTime;
    };
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    const handleMouseMove = (e: MouseEvent) => {
      if (prevXRef.current === null) {
        prevXRef.current = e.clientX;
        return;
      }

      const duration = video.duration;
      if (Number.isNaN(duration) || duration === 0) return;

      const currentX = e.clientX;
      const delta = currentX - prevXRef.current;
      prevXRef.current = currentX;

      const SENSITIVITY = 0.8;
      const timeOffset = (delta / window.innerWidth) * SENSITIVITY * duration;
      
      let newTarget = targetTimeRef.current + timeOffset;
      newTarget = Math.max(0, Math.min(newTarget, duration));
      
      targetTimeRef.current = newTarget;

      queueSeek();
    };

    const queueSeek = () => {
      if (!video) return;
      if (isSeekingRef.current) return;
      
      const diff = Math.abs(video.currentTime - targetTimeRef.current);
      if (diff > 0.05) {
        isSeekingRef.current = true;
        video.currentTime = targetTimeRef.current;
      }
    };

    const handleSeeked = () => {
      isSeekingRef.current = false;
      queueSeek();
    };

    window.addEventListener('mousemove', handleMouseMove);
    video.addEventListener('seeked', handleSeeked);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      window.removeEventListener('mousemove', handleMouseMove);
      video.removeEventListener('seeked', handleSeeked);
    };
  }, []);

  return videoRef;
}

const Pill = ({ children }: { children: React.ReactNode }) => (
  <button className="inline-flex items-center justify-center bg-white text-black border border-black/10 rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap hover:bg-black hover:text-white transition-colors duration-200">
    {children}
  </button>
);

const OutlinePill = () => (
  <button 
    onClick={() => navigator.clipboard.writeText('joyjeetr020@gmail.com')}
    className="inline-flex items-center justify-center text-white bg-transparent border border-white rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap hover:bg-white hover:text-black transition-colors duration-200 gap-2 sm:gap-3"
  >
    <span>Reach us: <span className="underline underline-offset-1">joyjeetr020@gmail.com</span></span>
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
  </button>
);

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  
  const { displayed, done } = useTypewriter(
    "Glad you stopped in. Good taste tends to find us. Now, what are we building?"
  );
  
  const videoRef = useVideoScrubber();

  useEffect(() => {
    const timer = setTimeout(() => setShowButtons(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-black">
      {/* Background Video */}
      <video
        ref={videoRef}
        src="/background.mp4"
        className="fixed inset-0 z-0 w-full h-full object-cover object-center md:object-[70%_center] scale-[1.1] translate-x-[5%]"
        muted
        playsInline
        preload="auto"
      />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-10 px-5 sm:px-8 py-4 sm:py-5 flex justify-between items-center">
        <div className="flex flex-row gap-3 items-center relative z-20">
          <a 
            href="https://www.linkedin.com/in/joyjeet-roy-6a66a3405" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[21px] sm:text-[26px] tracking-tight text-white font-heading hover:opacity-80 transition-opacity"
          >
            Joyjeet Roy
          </a>
          <span className="text-[25px] sm:text-[30px] text-white select-none tracking-[-0.02em]">
            ✳︎
          </span>
        </div>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex flex-row text-[23px] text-white">
          {['✦', '✧', '✺', '✶'].map((link, i) => (
            <span key={link}>
              <a href="#" className="hover:opacity-60 transition-opacity">{link}</a>
              {i < 3 && <span>, &nbsp;</span>}
            </span>
          ))}
        </div>

        <div className="hidden md:block text-[23px] text-white hover:opacity-60 transition-opacity underline underline-offset-2 relative z-20">
          <a href="https://www.linkedin.com/in/joyjeet-roy-6a66a3405" target="_blank" rel="noopener noreferrer">Get in touch</a>
        </div>

        {/* Mobile Hamburger */}
        <button 
          className="md:hidden flex flex-col gap-[5px] relative z-20" 
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className={`w-6 h-[2px] bg-white transition-transform duration-300 ${menuOpen ? 'rotate-[45deg] translate-y-[7px]' : ''}`} />
          <div className={`w-6 h-[2px] bg-white transition-opacity duration-300 ${menuOpen ? 'opacity-0' : 'opacity-100'}`} />
          <div className={`w-6 h-[2px] bg-white transition-transform duration-300 ${menuOpen ? '-rotate-[45deg] -translate-y-[7px]' : ''}`} />
        </button>

        {/* Mobile Overlay */}
        <div className={`md:hidden fixed inset-0 bg-black/90 backdrop-blur-md flex flex-col justify-center px-8 gap-8 transition-opacity duration-300 z-[9] ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          {['✦', '✧', '✺', '✶'].map((link) => (
            <a key={link} href="#" className="text-[32px] font-medium text-white">{link}</a>
          ))}
          <a href="https://www.linkedin.com/in/joyjeet-roy-6a66a3405" target="_blank" rel="noopener noreferrer" className="text-[32px] font-medium text-white underline">Get in touch</a>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-[1] w-full h-screen flex flex-col justify-end pb-12 md:justify-center md:pb-0 px-5 sm:px-8 md:px-10 overflow-hidden">
        <div className="max-w-xl w-full relative z-10">
          <div className="pointer-events-none select-none mb-5 sm:mb-6 text-[clamp(18px,4vw,26px)] leading-[1.3] font-normal text-white blur-[4px]">
            Hey there, meet A.R.I.A,<br />
            Mainframe's Adaptive Response Interface Agent
          </div>

          <p className="text-white mb-5 sm:mb-6 text-[clamp(18px,4vw,26px)] leading-[1.35] font-normal min-h-[54px]">
            {displayed}
            {!done && <span className="inline-block w-[2px] h-[1.1em] bg-white align-middle ml-[2px] animate-blink" />}
          </p>

          <div className={`flex flex-wrap gap-y-1 transition-all duration-[400ms] ease-out ${showButtons ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            <Pill>Pitch us an idea</Pill>
            <Pill>Come work here</Pill>
            <Pill>Send a brief hello</Pill>
            <Pill>See how we operate</Pill>
            <OutlinePill />
          </div>
        </div>
      </div>
    </div>
  );
}
