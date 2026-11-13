import { useEffect, useRef } from 'react';
import { useMousePosition } from '../../hooks/useMousePosition';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const { position } = useMousePosition();
  const posRef = useRef({ x: 0, y: 0 });
  const isHoverRef = useRef(false);

  useEffect(() => {
    let animId;
    const lerp = (a, b, t) => a + (b - a) * t;

    const animate = () => {
      posRef.current.x = lerp(posRef.current.x, position.x, 0.1);
      posRef.current.y = lerp(posRef.current.y, position.y, 0.1);

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${posRef.current.x - 16}px, ${posRef.current.y - 16}px) scale(${isHoverRef.current ? 1.6 : 1})`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${position.x - 3}px, ${position.y - 3}px)`;
      }
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [position]);

  useEffect(() => {
    const onEnter = () => { isHoverRef.current = true; };
    const onLeave = () => { isHoverRef.current = false; };

    const addListeners = () => {
      document.querySelectorAll('a, button, [data-cursor="pointer"], canvas').forEach(el => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };

    addListeners();
    const interval = setInterval(addListeners, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] rounded-full"
        style={{
          border: '1px solid rgba(14, 165, 233, 0.5)',
          transition: 'transform 0.15s cubic-bezier(0.23, 1, 0.32, 1)',
          mixBlendMode: 'screen',
        }}
      />
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 pointer-events-none z-[9999] rounded-full"
        style={{
          background: '#38bdf8',
          boxShadow: '0 0 6px #38bdf8',
        }}
      />
    </>
  );
}
