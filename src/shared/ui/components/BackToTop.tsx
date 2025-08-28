import { useState, useEffect } from 'react';
import { cn } from 'shared/lib';

interface BackToTopProps {
  targetRef: React.RefObject<HTMLDivElement | null>;
  className?: string;
}

export const BackToTop = ({ targetRef, className }: BackToTopProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (targetRef.current) {
        const { scrollTop } = targetRef.current;
        setIsVisible(scrollTop > 300);
      }
    };

    const scrollElement = targetRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, [targetRef]);

  const scrollToTop = () => {
    if (targetRef.current) {
      targetRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        'fixed bottom-8 right-8 z-50 p-3 rounded-full bg-[#ffffff20] backdrop-blur-md',
        'text-white hover:bg-[#ffffff30] transition-all duration-300 shadow-lg',
        'hover:scale-110 hover:shadow-2xl border border-white/20',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0',
        'pointer-events-auto',
        className
      )}
      aria-label="Back to top"
    >
      <svg 
        className="w-5 h-5" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M5 10l7-7m0 0l7 7m-7-7v18" 
        />
      </svg>
    </button>
  );
};
