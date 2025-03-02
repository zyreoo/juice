import { useEffect, useState, useRef } from 'react';

export default function RabbitMessage({ isVisible, onClaimLuck }) {
  // Add fortune messages array and date calculation logic at the top
  const FORTUNE_MESSAGES = [
    "Today you shine brighter than ever. Move forward boldly!",
    "A fresh start awaits you. Trust your intuition and go for it",
    "Your passion will light up the path ahead",
    "Today's challenges are tomorrow's stepping stones",
    "You're stronger than you realize. Don't sell yourself short",
    "Be your own hero, starting today",
    "Dream big, but act bigger",
    "Plant the seeds of success for your future self today",
    "Every step counts, every moment matters",
    "Your heart knows the way - follow it",
    "Your creativity is on fire today - try something new",
    "Today's efforts will bring double rewards tomorrow",
    "The world needs your unique perspective",
    "Courage isn't absence of fear, but conquering it",
    "A smile changes a day, a decision changes a life",
    "Perfect day to step outside your comfort zone",
    "Your energy is contagious - use it wisely",
    "Pause, breathe, appreciate the moment, then push forward",
    "Break your routine and take a risk today",
    "Your dreams are closer to reality than you think",
    "Today's journey will lead you to unexpected places",
    "One conversation could change everything today - speak up",
    "Today's choices are shaping your tomorrow",
    "Your creativity is ready to explode - let it out",
    "Keep an open mind - today holds unexpected surprises",
    "The greatest adventure? Being authentically yourself",
    "Today's obstacles are making you stronger",
    "Trust your gut feeling - it knows where to go",
    "Stronger than yesterday, even stronger tomorrow",
    "Victory is within sight - hold on a little longer",
    "Today your full potential will be unleashed",
    "Standing at the edge of transformation - ready?",
    "Destiny unfolds before you - seize this moment",
    "All preparation has led to tomorrow",
    "The time has come. Seize your reward." // Final message
  ];

  const getCurrentFortuneMessage = () => {
    const targetDate = new Date('2024-04-04T00:00:00Z');
    const currentDate = new Date();
    const daysUntilTarget = Math.ceil((targetDate - currentDate) / (1000 * 60 * 60 * 24));
    
    // If we're past April 4th or more than 35 days away, show the first message
    if (daysUntilTarget < 0 || daysUntilTarget >= FORTUNE_MESSAGES.length) {
      return FORTUNE_MESSAGES[0];
    }
    
    // Show the appropriate message based on days remaining
    return FORTUNE_MESSAGES[FORTUNE_MESSAGES.length - 1 - daysUntilTarget];
  };

  if (!isVisible) return null;

  const audioRef = useRef(null);

  const [isRabbitMode, setRabbitMode] = useState(false);

  useEffect(() => {
    // Add a 3 second delay before playing audio
    const timer = setTimeout(() => {
      audioRef.current.play();
    }, 1700);

    // Cleanup timer if component unmounts
    return () => clearTimeout(timer);
  }, []);

  // Add this handler to prevent clicks from reaching the background
  const handleMessageClick = (e) => {
    e.stopPropagation();
  };

  // Handle claiming luck (zooming out)
  const handleClaimLuck = (e) => {
    e.stopPropagation(); // Prevent the click from bubbling up
    if (onClaimLuck && typeof onClaimLuck === 'function') {
      onClaimLuck();
    }
  };

  return (
    <>
      <audio ref={audioRef} style={{ display: 'none' }}>
        <source src="./rabbit-ok.mp3" type="audio/mpeg" />
      </audio>
      <img 
        onClick={handleMessageClick}
        style={{
          width: 250,
          left: -110,
          top: 42,
          height: 100,
          zIndex: 2,
          opacity: 0.4,
          position: "absolute",
          mixBlendMode: "multiply",
          pointerEvents: "none",
          animation: "rabbitMessagePaperSlide 0.3s ease-out"
        }} 
        src="./paper.jpg"
        data-rabbit-component="true"
      />
      
      <div 
        onClick={handleMessageClick}
        style={{ 
          position: "absolute", 
          justifyContent: "space-between", 
          display: "flex", 
          flexDirection: "row", 
          width: 250, 
          left: -110, 
          top: 42, 
          height: 100,
          overflow: "hidden",
          backgroundColor: "#fff", 
          paddingLeft: 2, 
          paddingRight: 2, 
          borderRadius: 0,
          animation: "rabbitMessageOpen 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
          transformOrigin: "top center"
        }}
        data-rabbit-component="true"
      >
        <div style={{ height: "100px", overflow: "hidden", position: "relative" }}>
          <div style={{
            display: "flex",
            flexDirection: "column",
            animation: "scrollSeamless 15s ease-in infinite"
          }}>
            <img style={{ 
              height: "150px",
              objectFit: "contain" 
            }} src="/leftrabbit.png" />
            <img style={{ 
              height: "150px",
              objectFit: "contain",
              marginTop: "-1px"
            }} src="/leftrabbit.png" />
          </div>
        </div>
        {!isRabbitMode && 
        <div style={{ 
          height: "100px", 
          display: "flex", 
          justifyContent: "center", 
          flexDirection: "column", 
          alignItems: "center" 
        }}>
          <div style={{
            height: "100%", 
            overflow: "hidden", 
            display: "flex", 
            borderBottom: "0px solid #E1001D", 
            alignItems: "start", 
            width: "100%", 
            justifyContent: "start", 
            flexDirection: "row", 
            gap: 4,
            animation: "drawBorders 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards"
          }}>
            <div style={{height: 0, width: 2, backgroundColor: "#E1001D", animation: "drawLineDown 5s linear forwards"}}></div>
            <div style={{height: 0, width: 2, backgroundColor: "#E1001D", animation: "drawLineDown 5s linear 0.5s forwards"}}></div>
            <div style={{height: 0, width: 2, backgroundColor: "#E1001D", animation: "drawLineDown 5s linear 1s forwards"}}></div>
            <div style={{height: 0, width: 2, backgroundColor: "#E1001D", animation: "drawLineDown 5s linear 1.5s forwards"}}></div>
          
            <img style={{width: 150}} src="./JuiceMagic.png"/>
          </div>
          <p style={{ 
            fontSize: 13, 
            borderLeft: "0px solid #E1001D", 
            borderRight: "0px solid #E1001D", 
            paddingLeft: 2, 
            width: 148,
            animation: "drawBorders 1.5s cubic-bezier(0.4, 0, 0.2, 1) 1s forwards"
          }}>
            {getCurrentFortuneMessage().split('').map((char, i) => (
              <span 
                key={i} 
                style={{
                  color: "#fff",
                  fontSize: 13,
                  animation: `textReveal 0.1s cubic-bezier(0.4, 0, 0.2, 1) ${2 + (i * 0.05)}s forwards`
                }}
              >
                {char}
              </span>
            ))}
          </p>
          <div style={{
            height: "100%", 
            display: "flex", 
            alignItems: "end", 
            width: "100%", 
            justifyContent: "end", 
            borderTop: "0px solid #E1001D", 
            flexDirection: "row", 
            gap: 4,
            animation: "drawBorders 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards"
          }}>
            <p 
              onClick={handleClaimLuck}
              style={{
                width: "100%", 
                fontSize: 13, 
                color: "#000", 
                height: "100%", 
                cursor: "pointer",
                alignItems: "center", 
                display: "flex",
                opacity: 0,
                animation: "fadeIn 0.5s ease-in-out 6s forwards"
              }}>
              <span 
                style={{
                  animation: "blink 1.5s ease-in-out infinite 6s",
                  marginRight: 6,
                }}>{'>'}</span> 
              Enjoy Today's Luck
            </p>

            <div style={{height: 0, width: 2, backgroundColor: "#E1001D", animation: "drawLineUp 5s linear forwards"}}></div>
            <div style={{height: 0, width: 2, backgroundColor: "#E1001D", animation: "drawLineUp 5s linear 0.5s forwards"}}></div>
            <div style={{height: 0, width: 2, backgroundColor: "#E1001D", animation: "drawLineUp 5s linear 1s forwards"}}></div>
            <div style={{height: 0, width: 2, backgroundColor: "#E1001D", animation: "drawLineUp 5s linear 1.5s forwards"}}></div>
          </div>
          
          
        </div>}
        <div style={{ height: "100px", overflow: "hidden", position: "relative" }}>
          <div style={{
            display: "flex",
            flexDirection: "column",
            animation: "scrollSeamless 25s linear infinite"
          }}>
            <img style={{ 
              height: "150px",
              objectFit: "contain",
              transform: "scaleX(-1)" 
            }} src="/leftrabbit.png" />
            <img style={{ 
              height: "150px",
              objectFit: "contain",
              marginTop: "-1px",
              transform: "scaleX(-1)"
            }} src="/leftrabbit.png" />
          </div>
        </div>
      </div>
    </>
  );
} 