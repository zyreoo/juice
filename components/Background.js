import React from 'react';

export default function Background() {
  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: -1,
      backgroundImage: 'url(/background.gif)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      imageRendering: 'pixelated',
      WebkitImageRendering: 'pixelated',
      MozImageRendering: 'crisp-edges',
      msImageRendering: 'pixelated'
    }} />
  );
} 