import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti'; 
import styles from './FortuneBasket.module.css'; 

const cookieShakeKeyframes = `
  @keyframes cookieShake {
    0% { transform: rotate(0deg) scale(1); }
    15% { transform: rotate(-1deg) scale(0.98); }
    30% { transform: rotate(1.5deg) scale(1.01); }
    45% { transform: rotate(-1.2deg) scale(0.97); }
    60% { transform: rotate(1deg) scale(1.015); }
    75% { transform: rotate(-0.8deg) scale(0.98); }
    85% { transform: rotate(0.6deg) scale(1.01); }
    100% { transform: rotate(0deg) scale(1); }
  }
`;

export default function FortuneBasket({ 
  handleDismiss, 
  position, 
  style, 
  handleMouseDown,
  handleWindowClick,
  isDragging,
  isActive
}) {
  const [showCookies, setShowCookies] = useState(false);
  const [selectedCookie, setSelectedCookie] = useState(null);
  const [fortuneMessage, setFortuneMessage] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [showNewImages, setShowNewImages] = useState(false); 
  const [fadeInMessage, setFadeInMessage] = useState(false);

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
    
    setTimeout(() => {
      setFadeInMessage(true);
    }, 1000);
  };

  return (
    <>
      <style>{cookieShakeKeyframes}</style>
      <div 
        onClick={(e) => {
          console.log('Fortune basket clicked');
          handleWindowClick('fortuneBasket')(e);
        }}
        style={{
          display: "flex", 
          position: "absolute", 
          width: 300,
          height: 220,
          backgroundColor: "#fff", 
          border: "1px solid #000", 
          borderRadius: 4,
          flexDirection: "column",
          padding: 0,
          color: 'black',
          justifyContent: "flex-start",
          alignItems: "center",
          transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
          top: "50%",
          left: "50%",
          userSelect: "none"
        }}>
        <div 
          onMouseDown={(e) => {
            console.log('Fortune basket title bar mouse down');
            handleMouseDown('fortuneBasket')(e);
          }}
          style={{
            display: "flex", 
            borderBottom: "1px solid #000", 
            padding: 8, 
            width: "100%",
            flexDirection: "row", 
            justifyContent: "space-between", 
            alignItems: "center",
            cursor: isDragging ? 'grabbing' : 'grab'
          }}>
          <div style={{display: "flex", flexDirection: "row", gap: 8}}>
            <button onClick={(e) => { 
              console.log('Fortune basket dismiss clicked');
              e.stopPropagation(); 
              handleDismiss('fortuneBasket'); 
            }}>x</button>
          </div>
          <p style={{ margin: 0 }}>FORTUNE BASKET</p>
          <div></div>
        </div>
        <div style={{ 
          padding: '16px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          width: '100%',
          textAlign: 'center'
        }}>
          <p style={{ margin: '0 0 16px 0' }}>Choose your fortune cookie!</p>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            gap: '24px',
            width: '100%'
          }}>
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
                <p style={{ 
                  margin: '0',
                  display: 'flex',
                  alignItems: 'center',
                  maxWidth: '120px'
                }}>
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
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    animation: 'cookieShake 1.2s linear infinite',
                    transformOrigin: '50% 50%'
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
    </>
  );
}
