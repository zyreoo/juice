import React, { Suspense } from 'react';
import FileIcon from '../FileIcon';
import WelcomeWindow from './WelcomeWindow';
import AchievementsWindow from './AchievementsWindow';
import WutIsThisWindow from './WutIsThisWindow';
import RegisterWindow from './RegisterWindow';
import VideoWindow from './VideoWindow';
import FactionWindow from './FactionWindow';
import FirstChallengeWindow from './FirstChallengeWindow';
import Background from '../Background';
import ShareSuccessPanel from './ShareSuccessPanel';

export default function MainView({ isLoggedIn, setIsLoggedIn, userData }) {
  const [time, setTime] = React.useState(new Date());
  const [timeRemaining, setTimeRemaining] = React.useState('');
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [activeWindow, setActiveWindow] = React.useState(null);
  const [welcomePosition, setWelcomePosition] = React.useState({ x: 0, y: 0 });
  const [achievementsPosition, setAchievementsPosition] = React.useState({ x: 50, y: 50 });
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  const [openWindows, setOpenWindows] = React.useState(['welcomeWindow']);
  const [windowOrder, setWindowOrder] = React.useState(['welcomeWindow']);
  const [selectedRank, setSelectedRank] = React.useState(1);
  const [wutIsThisPosition, setWutIsThisPosition] = React.useState({ x: 100, y: 100 });
  const [registerPosition, setRegisterPosition] = React.useState({ x: 150, y: 150 });
  const [videoPosition, setVideoPosition] = React.useState({ x: 200, y: 200 });
  const [factionPosition, setFactionPosition] = React.useState({ x: 250, y: 250 });
  const [firstChallengePosition, setFirstChallengePosition] = React.useState({ x: 300, y: 300 });
  const [isShaking, setIsShaking] = React.useState(false);
  const collectSoundRef = React.useRef(null);
  const [tickets, setTickets] = React.useState([
    { id: 'apple', used: false },
    { id: 'carrot', used: false },
    { id: 'berry', used: false }
  ]);

  // Constants
  const TOP_BAR_HEIGHT = 36;
  const WINDOW_HEIGHTS = {
    welcomeWindow: 160,
    achievements: 320,
    wutIsThis: 470,
    register: 200,
    video: 397,
    faction: 200
  };
  const BASE_Z_INDEX = 1;

  React.useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);
      
      const kickoffDate = new Date('2025-02-01T19:30:00-05:00'); // EST time
      const diff = kickoffDate - now;
      
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setTimeRemaining(`${days} Days, ${hours} Hours, ${minutes} Minutes, ${seconds} Seconds`);
      } else {
        setTimeRemaining('Event has started!');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const handleFileClick = (fileId) => (e) => {
    e.stopPropagation();
    if (selectedFile === fileId) {
      if (fileId === "Achievements") {
        if (!openWindows.includes('achievements')) {
          setOpenWindows(prev => [...prev, 'achievements']);
          setWindowOrder(prev => [...prev.filter(w => w !== 'achievements'), 'achievements']);
        } else {
          setWindowOrder(prev => [...prev.filter(w => w !== 'achievements'), 'achievements']);
        }
      } else if (fileId === "file1") {
        if (!openWindows.includes('wutIsThis')) {
          setOpenWindows(prev => [...prev, 'wutIsThis']);
          setWindowOrder(prev => [...prev.filter(w => w !== 'wutIsThis'), 'wutIsThis']);
        } else {
          setWindowOrder(prev => [...prev.filter(w => w !== 'wutIsThis'), 'wutIsThis']);
        }
      } else if (fileId === "Register") {
        if (!openWindows.includes('register')) {
          setOpenWindows(prev => [...prev, 'register']);
          setWindowOrder(prev => [...prev.filter(w => w !== 'register'), 'register']);
        } else {
          setWindowOrder(prev => [...prev.filter(w => w !== 'register'), 'register']);
        }
      } else if (fileId === "video.mp4") {
        if (!openWindows.includes('video')) {
          setOpenWindows(prev => [...prev, 'video']);
          setWindowOrder(prev => [...prev.filter(w => w !== 'video'), 'video']);
        } else {
          setWindowOrder(prev => [...prev.filter(w => w !== 'video'), 'video']);
        }
      }
    } else {
      setSelectedFile(fileId);
    }
  };

  const handleMouseDown = (windowName) => (e) => {
    e.stopPropagation();
    setIsDragging(true);
    setActiveWindow(windowName);
    setWindowOrder(prev => [...prev.filter(w => w !== windowName), windowName]);
    
    let position;
    switch(windowName) {
      case 'welcomeWindow':
        position = welcomePosition;
        break;
      case 'achievements':
        position = achievementsPosition;
        break;
      case 'wutIsThis':
        position = wutIsThisPosition;
        break;
      case 'register':
        position = registerPosition;
        break;
      case 'video':
        position = videoPosition;
        break;
      case 'faction':
        position = factionPosition;
        break;
      case 'firstChallenge':
        position = firstChallengePosition;
        break;
      default:
        position = { x: 0, y: 0 };
    }

    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newY = e.clientY - dragStart.y;
      const actualTopPosition = (window.innerHeight / 2) + newY;
      
      const windowHeight = WINDOW_HEIGHTS[activeWindow] || WINDOW_HEIGHTS.welcomeWindow;
      const boundedY = actualTopPosition < (TOP_BAR_HEIGHT + windowHeight/2) 
        ? (TOP_BAR_HEIGHT + windowHeight/2) - (window.innerHeight / 2)
        : newY;

      const newPosition = {
        x: e.clientX - dragStart.x,
        y: boundedY
      };

      if (activeWindow === 'welcomeWindow') {
        setWelcomePosition(newPosition);
      } else if (activeWindow === 'achievements') {
        setAchievementsPosition(newPosition);
      } else if (activeWindow === 'wutIsThis') {
        setWutIsThisPosition(newPosition);
      } else if (activeWindow === 'register') {
        setRegisterPosition(newPosition);
      } else if (activeWindow === 'video') {
        setVideoPosition(newPosition);
      } else if (activeWindow === 'faction') {
        setFactionPosition(newPosition);
      } else if (activeWindow === 'firstChallenge') {
        setFirstChallengePosition(newPosition);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setActiveWindow(null);
  };

  const handleDismiss = (windowName) => {
    setOpenWindows(openWindows.filter(window => window !== windowName));
    setWindowOrder(prev => prev.filter(w => w !== windowName));
  };

  const handleJuiceClick = () => {
    if (!openWindows.includes('welcomeWindow')) {
      setOpenWindows(prev => [...prev, 'welcomeWindow']);
      setWelcomePosition({ x: 0, y: 0 });
      setWindowOrder(prev => [...prev.filter(w => w !== 'welcomeWindow'), 'welcomeWindow']);
    } else {
      setWindowOrder(prev => [...prev.filter(w => w !== 'welcomeWindow'), 'welcomeWindow']);
    }
  };

  const handleWindowClick = (windowName) => (e) => {
    e.stopPropagation();
    setWindowOrder(prev => [...prev.filter(w => w !== windowName), windowName]);
  };

  const handleRegisterOpen = () => {
    if (!openWindows.includes('register')) {
      setOpenWindows(prev => [...prev, 'register']);
      setWindowOrder(prev => [...prev.filter(w => w !== 'register'), 'register']);
    } else {
      setWindowOrder(prev => [...prev.filter(w => w !== 'register'), 'register']);
    }
  };

  const handleFactionOpen = () => {
    if (!openWindows.includes('faction')) {
      setOpenWindows(prev => [...prev, 'faction']);
      setWindowOrder(prev => [...prev.filter(w => w !== 'faction'), 'faction']);
    } else {
      setWindowOrder(prev => [...prev.filter(w => w !== 'faction'), 'faction']);
    }
  };

  const handleFirstChallengeOpen = () => {
    if (!openWindows.includes('firstChallenge')) {
      setOpenWindows(prev => [...prev, 'firstChallenge']);
      setWindowOrder(prev => [...prev.filter(w => w !== 'firstChallenge'), 'firstChallenge']);
    } else {
      setWindowOrder(prev => [...prev.filter(w => w !== 'firstChallenge'), 'firstChallenge']);
    }
  };

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  const getWindowZIndex = (windowName) => {
    const index = windowOrder.indexOf(windowName);
    return BASE_Z_INDEX + index;
  };

  React.useEffect(() => {
    if (isShaking) {
      const timer = setTimeout(() => {
        setIsShaking(false);
      }, 600); // Duration increased to 0.6s
      return () => clearTimeout(timer);
    }
  }, [isShaking]);

  React.useEffect(() => {
    collectSoundRef.current = new Audio('./collect.mp3');
    collectSoundRef.current.volume = 0.5;
  }, []);

  return (
    <div 
      data-shake-container="true"
      style={{
        animation: isShaking ? 'shake 0.6s cubic-bezier(.36,.07,.19,.97) both' : 'none',
        transform: 'translate3d(0, 0, 0)',
        backfaceVisibility: 'hidden',
        perspective: 1000,
        overflow: "hidden",
        position: 'relative'
    }}>
      <style jsx global>{`
        @keyframes shake {
          10%, 90% {
            transform: translate3d(-1px, 0, 0) scale(1.01);
          }
          20%, 80% {
            transform: translate3d(2px, 0, 0) scale(1.01);
          }
          30%, 50%, 70% {
            transform: translate3d(-4px, 0, 0) scale(1.01);
          }
          40%, 60% {
            transform: translate3d(4px, 0, 0) scale(1.01);
          }
        }
        @keyframes saturate {
          0% {
            backdrop-filter: saturate(100%);
          }
          50% {
            backdrop-filter: saturate(300%);
          }
          100% {
            backdrop-filter: saturate(100%);
          }
        }
      `}</style>
      <div 
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: 9999,
          animation: isShaking ? 'saturate 0.6s cubic-bezier(.36,.07,.19,.97) both' : 'none',
          mixBlendMode: "saturation"
        }}
      />
      <div style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden"
      }}>
        {/* top bar */}
        <div style={{
            position: "absolute", 
            zIndex: 3, 
            height: TOP_BAR_HEIGHT, 
            borderBottom: "1px solid rgba(255, 255, 255, 0.2)", 
            justifyContent: "space-between", 
            padding: "8px 16px", 
            top: 0, 
            left: 0, 
            display: "flex", 
            width: "100vw", 
            margin: 0,
            backgroundColor: 'rgba(255, 220, 180, 0.8)',
            backdropFilter: 'blur(8px) saturate(200%) sepia(50%) hue-rotate(-15deg) brightness(1.1)',
            WebkitBackdropFilter: 'blur(8px) saturate(200%) sepia(50%) hue-rotate(-15deg) brightness(1.1)',
            boxShadow: '0 1px 25px rgba(255, 160, 60, 0.3)'
        }}>
            <p onClick={handleJuiceClick} style={{
                cursor: "pointer",
                color: "rgba(0, 0, 0, 0.8)",
                fontWeight: 500
            }}>Juice</p>
            <div style={{display: "flex", flexDirection: "row", gap: 16}}>
            <div style={{display: "flex", border: "1px solid #000", alignItems: "center", justifyContent: "space-around", borderRadius: 4, width: 32}}>  
                <img style={{width: 14, height: 14}} src={"./kudos.svg"}/>
                <p style={{fontSize: 16}}>0</p>
            </div>
            <p style={{
                color: "rgba(0, 0, 0, 0.8)",
                fontWeight: 500
            }}>{formattedTime}</p>
            </div>
        </div>

        {openWindows.includes('welcomeWindow') && (
          <WelcomeWindow 
            position={welcomePosition}
            isDragging={isDragging}
            isActive={windowOrder[windowOrder.length - 1] === 'welcomeWindow'}
            handleMouseDown={handleMouseDown}
            handleDismiss={handleDismiss}
            handleWindowClick={handleWindowClick}
            BASE_Z_INDEX={getWindowZIndex('welcomeWindow')}
            ACTIVE_Z_INDEX={getWindowZIndex('welcomeWindow')}
            setOpenWindows={setOpenWindows}
            setWindowOrder={setWindowOrder}
            openWindows={openWindows}
          />
        )}

        {openWindows.includes('achievements') && (
          <AchievementsWindow 
            position={achievementsPosition}
            isDragging={isDragging}
            isActive={windowOrder[windowOrder.length - 1] === 'achievements'}
            handleMouseDown={handleMouseDown}
            handleDismiss={handleDismiss}
            handleWindowClick={handleWindowClick}
            selectedRank={selectedRank}
            setSelectedRank={setSelectedRank}
            BASE_Z_INDEX={getWindowZIndex('achievements')}
            ACTIVE_Z_INDEX={getWindowZIndex('achievements')}
          />
        )}

        {openWindows.includes('wutIsThis') && (
          <WutIsThisWindow 
            position={wutIsThisPosition}
            isDragging={isDragging}
            isActive={windowOrder[windowOrder.length - 1] === 'wutIsThis'}
            handleMouseDown={handleMouseDown}
            handleDismiss={handleDismiss}
            handleWindowClick={handleWindowClick}
            BASE_Z_INDEX={getWindowZIndex('wutIsThis')}
            ACTIVE_Z_INDEX={getWindowZIndex('wutIsThis')}
          />
        )}

        {openWindows.includes('register') && (
          <RegisterWindow 
            position={registerPosition}
            isDragging={isDragging}
            isActive={windowOrder[windowOrder.length - 1] === 'register'}
            handleMouseDown={handleMouseDown}
            handleDismiss={handleDismiss}
            handleWindowClick={handleWindowClick}
            BASE_Z_INDEX={getWindowZIndex('register')}
            ACTIVE_Z_INDEX={getWindowZIndex('register')}
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
          />
        )}

        {openWindows.includes('video') && (
          <VideoWindow 
            position={videoPosition}
            isDragging={isDragging}
            isActive={windowOrder[windowOrder.length - 1] === 'video'}
            handleMouseDown={handleMouseDown}
            handleDismiss={handleDismiss}
            handleWindowClick={handleWindowClick}
            BASE_Z_INDEX={getWindowZIndex('video')}
            ACTIVE_Z_INDEX={getWindowZIndex('video')}
          />
        )}

        {openWindows.includes('faction') && (
          <FactionWindow 
            position={factionPosition}
            isDragging={isDragging}
            isActive={windowOrder[windowOrder.length - 1] === 'faction'}
            handleMouseDown={handleMouseDown}
            handleDismiss={handleDismiss}
            handleWindowClick={handleWindowClick}
            BASE_Z_INDEX={getWindowZIndex('faction')}
            ACTIVE_Z_INDEX={getWindowZIndex('faction')}
            tickets={tickets}
            setTickets={setTickets}
          />
        )}

        {openWindows.includes('firstChallenge') && (
          <FirstChallengeWindow 
            position={firstChallengePosition}
            isDragging={isDragging}
            isActive={windowOrder[windowOrder.length - 1] === 'firstChallenge'}
            handleMouseDown={handleMouseDown}
            handleDismiss={handleDismiss}
            handleWindowClick={handleWindowClick}
            BASE_Z_INDEX={getWindowZIndex('firstChallenge')}
            ACTIVE_Z_INDEX={getWindowZIndex('firstChallenge')}
          />
        )}

        <div style={{
            position: "absolute", 
            top: TOP_BAR_HEIGHT, 
            left: 0,
            // backgroundImage: 'url(background.GIF)',
            backgroundSize: 'cover', 
            imageRendering: 'pixelated',
            width: "100vw", 
            overflow: "hidden"
            // height: "100vh"
        }}>
            <div style={{display: "flex", gap: 8, flexDirection: "row", padding: 8}}>
                <div>
                    <FileIcon 
                        text="wutIsThis.txt" 
                        icon="./texticon.png"
                        isSelected={selectedFile === "file1"}
                        onClick={handleFileClick("file1")}
                        delay={0}
                        data-file-id="file1"
                    />
                    <FileIcon 
                        text="Achievements" 
                        icon="achievmentsicon.png"
                        isSelected={selectedFile === "Achievements"}
                        onClick={handleFileClick("Achievements")}
                        delay={0.1}
                        data-file-id="Achievements"
                    />
                </div>
                <div>
                    <FileIcon 
                        text="Register" 
                        icon="registericon.png" 
                        isSelected={selectedFile === "Register"}
                        onClick={handleFileClick("Register")}
                        delay={0.2}
                        data-file-id="Register"
                    />
                    <FileIcon 
                        text="video.mp4" 
                        icon="./thumbnail.png" 
                        isSelected={selectedFile === "video.mp4"}
                        onClick={handleFileClick("video.mp4")}
                        delay={0.3}
                        data-file-id="video.mp4"
                    />
                </div>
            </div>
        </div>

        <div style={{position: "absolute", top: TOP_BAR_HEIGHT + 8, right: 8}}>
            <div style={{
                width: 332, 
                backgroundColor: 'rgba(255, 220, 180, 0.8)',
                backdropFilter: 'blur(8px) saturate(200%) sepia(50%) hue-rotate(-15deg) brightness(1.1)',
                WebkitBackdropFilter: 'blur(8px) saturate(200%) sepia(50%) hue-rotate(-15deg) brightness(1.1)',
                border: "1px solid rgba(255, 220, 180, 0.4)",
                borderRadius: 8,
                padding: 12,
                boxShadow: '0 1px 25px rgba(255, 160, 60, 0.3)'
            }}>
                <p style={{ color: "rgba(0, 0, 0, 0.8)", margin: "0 0 8px 0" }}>{timeRemaining}</p>
                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                    <p style={{ color: "rgba(0, 0, 0, 0.8)", margin: 0 }}>World Start Call (2/1/25)</p>
                    <p style={{ color: "rgba(0, 0, 0, 0.8)", margin: 0 }}>7:30 PM EST SAT</p>
                </div>
                <button 
                    data-register-button="true"
                    onClick={handleRegisterOpen}
                    style={{
                        marginTop: 8,
                        padding: "4px 12px",
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        color: "#fff",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer"
                    }}>RSVP for Call</button>
            </div>
            {isLoggedIn && <div style={{
                width: 332,
                marginTop: 8,
                backgroundColor: 'rgba(255, 220, 180, 0.8)',
                backdropFilter: 'blur(8px) saturate(200%) sepia(50%) hue-rotate(-15deg) brightness(1.1)',
                WebkitBackdropFilter: 'blur(8px) saturate(200%) sepia(50%) hue-rotate(-15deg) brightness(1.1)',
                border: "1px solid rgba(255, 220, 180, 0.4)",
                borderRadius: 8,
                padding: 12,
                boxShadow: '0 1px 25px rgba(255, 160, 60, 0.3)'
            }}>
                <p style={{ color: "rgba(0, 0, 0, 0.8)", margin: "0 0 8px 0" }}>First Challenge Reveals Itself...</p>
                <button 
                    onClick={handleFirstChallengeOpen}
                    style={{
                        padding: "4px 12px",
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        color: "#fff",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer"
                    }}>Discover Challenge</button>
            </div>}
            {isLoggedIn && <div style={{
                width: 332,
                marginTop: 8,
                backgroundColor: 'rgba(255, 220, 180, 0.8)',
                backdropFilter: 'blur(8px) saturate(200%) sepia(50%) hue-rotate(-15deg) brightness(1.1)',
                WebkitBackdropFilter: 'blur(8px) saturate(200%) sepia(50%) hue-rotate(-15deg) brightness(1.1)',
                border: "1px solid rgba(255, 220, 180, 0.4)",
                borderRadius: 8,
                padding: 12,
                boxShadow: '0 1px 25px rgba(255, 160, 60, 0.3)'
            }}>
                <p style={{ color: "rgba(0, 0, 0, 0.8)", margin: "0 0 8px 0" }}>
                    You found {tickets.filter(t => !t.used).length} special ticket{tickets.filter(t => !t.used).length !== 1 ? 's' : ''}...
                </p>
                <button 
                    onClick={handleFactionOpen}
                    style={{
                        padding: "4px 12px",
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        color: "#fff",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer"
                    }}>Grab Your Tickets</button>
            </div>}
            {isLoggedIn && (
              <>
              {userData?.achievements?.length > 1 &&
                <ShareSuccessPanel />}
                {/* <div style={{
                    width: 332,
                    marginTop: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: 8,
                    padding: 12,
                    boxShadow: '0 1px 20px rgba(0, 0, 0, 0.1)'
                }}>
                    <p style={{ color: "rgba(0, 0, 0, 0.8)", margin: "0 0 4px 0" }}>Hackers currently online...</p>
                    <p style={{ color: "rgba(0, 0, 0, 0.6)", margin: 0, fontStyle: "italic" }}>(coming soon)</p>
                </div> */}
              </>
            )}
        </div>

        {/* background goes here */}
        <div 
            onClick={() => setSelectedFile(null)}
            style={{width: "100vw", height: "100vh", overflow: "hidden", display: "flex", margin: 0, cursor: "default"}}>
            <Background />
        </div>
      </div>
    </div>
  );
} 