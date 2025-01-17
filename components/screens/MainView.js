import React, { Suspense } from 'react';
import FileIcon from '../FileIcon';
import WelcomeWindow from './WelcomeWindow';
import AchievementsWindow from './AchievementsWindow';
import WutIsThisWindow from './WutIsThisWindow';
import RegisterWindow from './RegisterWindow';
import VideoWindow from './VideoWindow';
import Background from '../Background';

export default function MainView() {
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

  // Constants
  const TOP_BAR_HEIGHT = 36;
  const WINDOW_HEIGHTS = {
    welcomeWindow: 160,
    achievements: 320,
    wutIsThis: 470,
    register: 200,
    video: 397
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

  return (
    <div>
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
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            boxShadow: '0 1px 20px rgba(0, 0, 0, 0.1)'
        }}>
            <p onClick={handleJuiceClick} style={{
                cursor: "pointer",
                color: "rgba(0, 0, 0, 0.8)",
                fontWeight: 500
            }}>Juice</p>
            <p style={{
                color: "rgba(0, 0, 0, 0.8)",
                fontWeight: 500
            }}>{formattedTime}</p>
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

        <div style={{position: "absolute", top: TOP_BAR_HEIGHT, left: 0}}>
            <div style={{height: `calc(100vh - ${TOP_BAR_HEIGHT}px)`, display: "flex", gap: 8, flexDirection: "row", padding: 8}}>
                <div>
                    <FileIcon 
                        text="wutIsThis.txt" 
                        icon="./texticon.png"
                        isSelected={selectedFile === "file1"}
                        onClick={handleFileClick("file1")}
                    />
                    <FileIcon 
                        text="Achievements" 
                        icon="achievmentsicon.png"
                        isSelected={selectedFile === "Achievements"}
                        onClick={handleFileClick("Achievements")}
                    />
                </div>
                <div>
                    <FileIcon 
                        text="Register" 
                        icon="registericon.png" 
                        isSelected={selectedFile === "Register"}
                        onClick={handleFileClick("Register")}
                    />
                    <FileIcon 
                        text="video.mp4" 
                        icon="./thumbnail.png" 
                        isSelected={selectedFile === "video.mp4"}
                        onClick={handleFileClick("video.mp4")}
                    />
                </div>
            </div>
        </div>

        <div style={{position: "absolute", top: TOP_BAR_HEIGHT + 8, right: 8}}>
            <div style={{width: 332, backgroundColor: "#fff", border: "1px solid #000", borderRadius: 4, padding: 12}}>
                <p>{timeRemaining}</p>
                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                    <p>Kickoff Call (2/1/25)</p>
                    <p>7:30 PM EST SAT</p>
                </div>
                <button>RSVP</button>
            </div>
            <div style={{width: 332, marginTop: 8, backgroundColor: "#fff", border: "1px solid #000", borderRadius: 4, padding: 12}}>
            <p>Hackers currently online...</p>
            <p><i>(coming soon)</i></p>
            </div>
        </div>

        {/* background goes here */}
        <div 
            onClick={() => setSelectedFile(null)}
            style={{width: "100vw", height: "100vh", display: "flex", margin: 0, cursor: "default"}}>
            <Background />
        </div>
    </div>
  );
} 