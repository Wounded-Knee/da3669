import { useState, useEffect } from 'react';

export const useRainbow = (saturation = 30, lightness = 30) => {
  const getColor = () => `hsl(${Math.trunc(Date.now() / 1500) % 360},${saturation}%,${lightness}%)`;
  const [color, setColor] = useState(getColor());
  const delay = 1000;

  useEffect(() => {
    const timer = setInterval(() => setColor(getColor()), delay);
    return () => clearInterval(timer);
  }, []);

  return color;
};
