import { useState, useEffect, useRef } from 'react';

export function useIntersection(options = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (options.once !== false) observer.disconnect();
        } else if (options.once === false) {
          setIsVisible(false);
        }
      },
      { threshold: options.threshold || 0.15, ...options }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}
