import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti'; 
import styles from './FortuneBasket.module.css'; 

export default function FortuneBasket({ handleDismiss, initialPosition }) {
  const [position, setPosition] = useState(initialPosition || { x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showCookies, setShowCookies] = useState(false);
  const [selectedCookie, setSelectedCookie] = useState(null);
  const [fortuneMessage, setFortuneMessage] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [showNewImages, setShowNewImages] = useState(false); 
  const [fadeInMessage, setFadeInMessage] = useState(false);

  const handleMouseDown = (e) => {
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCookies(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleCookieClick = (index) => {
    setSelectedCookie(index);
    setShowConfetti(true); 
    setShowNewImages(true); 
    generateFortuneMessage(); 
  };

  const generateFortuneMessage = () => {
    const fortunes = [
      "Achievement unlocked: Turning dreams into reality.",
      "A bug today is the feature of tomorrow's success.",
      "Warning: Excessive game development may lead to dreams in 8-bit.",
      "You will soon discover that 'just one more level' applies to coding too.",
      "Your high score in life is about to get a new personal best.",
      "Your next big idea is loading... please wait."
    ];
    const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    setFortuneMessage(randomFortune);
    console.log("Generated fortune message:", randomFortune);
    
    setTimeout(() => {
      setFadeInMessage(true);
    }, 1000);
  };

  return (
    <div 
      style={{
        position: 'absolute',
        top: position.y,
        left: position.x,
        border: '1px solid black',
        backgroundColor: 'white',
        width: '300px',
        height: '220px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        cursor: 'move',
      }}
      onMouseDown={handleMouseDown}
    >
      <div style={{ display: 'flex', alignItems: 'center', padding: '8px', backgroundColor: '#f0f0f0' }}>
        <button onClick={handleDismiss} style={{ cursor: 'pointer', marginRight: '8px' }}>X</button>
        <span style={{ fontWeight: 'bold' }}>Fortune Basket</span>
      </div>
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <p>Choose your fortune cookie!</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
          {showNewImages ? (
            <>
              <img 
                src="./fortunecookieleft.png" 
                alt="Fortune Cookie Left" 
                style={{ 
                  width: '60px', 
                  height: '60px', 
                  animation: `${styles.moveLeft} 1s forwards`, 
                  imageRendering: 'pixelated'
                }} 
              />
              <p style={{ margin: '0 20px 10px 20px', textAlign: 'center' }}>
                {fortuneMessage}
              </p>
              <img 
                src="./fortunecookieright.png" 
                alt="Fortune Cookie Right" 
                style={{ 
                  width: '60px', 
                  height: '60px', 
                  animation: `${styles.moveRight} 1s forwards`, 
                  imageRendering: 'pixelated'
                }} 
              />
            </>
          ) : (
            [0, 1, 2].map((index) => (
              <div 
                key={index} 
                style={{ 
                  cursor: 'pointer'
                }} 
                onClick={() => handleCookieClick(index)}
              >
                <img 
                  src="./fortunecookieicon.png" 
                  alt="Fortune Cookie" 
                  style={{ 
                    width: '60px', 
                    height: '60px', 
                    imageRendering: 'pixelated' 
                  }} 
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Confetti effect */}
      {showConfetti && <Confetti width={300} height={200} recycle={false} numberOfPieces={200} colors={['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3']} />}
    </div>
  );
}
