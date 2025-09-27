import { useEffect } from 'react';

export function TestComponent() {
  // Test useEffect
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('test');
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>Test</div>
  );
}