// Pallette rotation hook
import { useState, useEffect } from 'react';

export const useRainbow = (saturation = 30, lightness = 30, offset = 0) => {
  const refreshRate = 100; // ms between increments
  const divisor = 1500; // Controls the rate of rotation
  const getColor = () => `hsl(${Math.trunc(Date.now() / divisor + offset) % 360},${saturation}%,${lightness}%)`;
  const [color, setColor] = useState(getColor());

  useEffect(() => {
    const timer = setInterval(() => setColor(getColor()), refreshRate);
    return () => clearInterval(timer);
  }, []);

  return color;
};
