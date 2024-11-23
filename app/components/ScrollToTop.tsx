'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations } from '../hooks/useTranslations';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { isRTL } = useTranslations();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <Button
      className="fixed bottom-8 bg-[#c69b5f] hover:bg-[#5e4522] transition-all duration-300 shadow-lg"
      style={{ [isRTL ? 'left' : 'right']: '2rem' }}
      size="icon"
      onClick={scrollToTop}
      aria-label="Retour en haut"
    >
      <ArrowUp className="h-4 w-4" />
    </Button>
  );
}