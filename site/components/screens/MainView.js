import React, { Suspense } from 'react';
import FileIcon from '../FileIcon';
import WelcomeWindow from './WelcomeWindow';
import AchievementsWindow from './AchievementsWindow';
import WutIsJuiceWindow from './WutIsJuiceWindow';
import RegisterWindow from './RegisterWindow';
import VideoWindow from './VideoWindow';
import FactionWindow from './FactionWindow';
import FirstChallengeWindow from './FirstChallengeWindow';
import JuiceWindow from './JuiceWindow';
import KudosWindow from './KudosWindow';
import GalleryWindow from './GalleryWindow';
import Background from '../Background';
import ShareSuccessPanel from './ShareSuccessPanel';
import FortuneBasket from './FortuneBasket';
import ThanksWindow from './ThanksWindow';
import JungleWindow from './JungleWindow';
import FruitBasketWindow from './FruitBasketWindow';
import WutIsJungleWindow from './WutIsJungleWindow';
import SecondChallengeWindow from './SecondChallengeWindow';
import MenuWindow from './MenuWindow';
import PostcardWindow from './PostcardWindow';
import WutIsRelayWindow from './WutIsRelayWindow';
import JungleShopWindow from './JungleShopWindow';
import TamagotchiNotesWindow from './TamagotchiNotesWindow';
import ZeroWindow from './ZeroWindow';
import WutIsPenguathonWindow from './WutIsPenguathonWindow';

export default function MainView({
  isLoggedIn,
  setIsLoggedIn,
  userData,
  setUserData,
  isJungle,
}) {
  const [time, setTime] = React.useState(new Date());
  const [timeRemaining, setTimeRemaining] = React.useState('');
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [activeWindow, setActiveWindow] = React.useState(null);
  const [welcomePosition, setWelcomePosition] = React.useState({ x: 0, y: 0 });
  const [achievementsPosition, setAchievementsPosition] = React.useState({
    x: 50,
    y: 50,
  });
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  const [openWindows, setOpenWindows] = React.useState(['welcomeWindow']);
  const [windowOrder, setWindowOrder] = React.useState(['welcomeWindow']);
  const [selectedRank, setSelectedRank] = React.useState(1);
  const [wutIsJuicePosition, setwutIsJuicePosition] = React.useState({
    x: 100,
    y: 100,
  });
  const [wutIsJunglePosition, setwutIsJunglePosition] = React.useState({
    x: 100,
    y: 100,
  });
  const [registerPosition, setRegisterPosition] = React.useState({
    x: 150,
    y: 150,
  });
  const [videoPosition, setVideoPosition] = React.useState({ x: 200, y: 200 });
  const [factionPosition, setFactionPosition] = React.useState({
    x: 250,
    y: 250,
  });
  const [firstChallengePosition, setFirstChallengePosition] = React.useState({
    x: 300,
    y: 300,
  });
  const [juiceWindowPosition, setJuiceWindowPosition] = React.useState({
    x: 0,
    y: 0,
  });
  const [jungleWindowPosition, setjungleWindowPosition] = React.useState({
    x: 0,
    y: 0,
  });
  const [fruitBasketWindowPosition, setFruitBasketWindowPosition] =
    React.useState({ x: 0, y: 0 });
  const [jungleShopWindowPosition, setJungleShopWindowPosition] =
    React.useState({ x: 0, y: 0 });
  const [fortuneBasketPosition, setFortuneBasketPosition] = React.useState({
    x: Math.max(0, window.innerWidth / 2 - 150),
    y: Math.max(0, window.innerHeight / 2 - 110),
  });

  const [menuWindowPosition, setMenuWindowPosition] = React.useState({
    x: 400,
    y: 100,
  });
  const [zeroWindowPosition, setZeroWindowPosition] = React.useState({
    x: -150,
    y: 0,
  });
  const [wutIsPenguathonWindowPosition, setWutIsPenguathonWindowPosition] =
    React.useState({
      x: 400,
      y: 150,
    });

  const [isShaking, setIsShaking] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const collectSoundRef = React.useRef(null);
  const [tickets, setTickets] = React.useState([]);
  const [isRsvped, setIsRsvped] = React.useState(false);
  const [showCookies, setShowCookies] = React.useState(false);
  const [kudosPosition, setKudosPosition] = React.useState({ x: 350, y: 350 });
  const [GalleryPosition, setGalleryPosition] = React.useState({
    x: 400,
    y: 400,
  });

  const [isJuicing, setIsJuicing] = React.useState(false);
  const juicerSoundRef = React.useRef(null);
  const [thanksPosition, setThanksPosition] = React.useState({
    x: 400,
    y: 400,
  });
  const [secondChallengePosition, setSecondChallengePosition] = React.useState({
    x: 350,
    y: 350,
  });
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [postcardPosition, setPostcardPosition] = React.useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });
  const [wutIsRelayPosition, setWutIsRelayPosition] = React.useState({
    x: 100,
    y: 100,
  });
  const [tamagotchiNotesPosition, setTamagotchiNotesPosition] = React.useState({
    x: 100,
    y: 100,
  });

  const [penguathonCountdown, setPenguathonCountdown] = React.useState('');

  const [isHovered, setIsHovered] = React.useState(false);
  const hoverTimeoutRef = React.useRef(null);

  const [countdownText, setCountdownText] = React.useState('');

  const [currentSound, setCurrentSound] = React.useState('');

  // Add this near the top with other state declarations
  const [displayedMessage, setDisplayedMessage] = React.useState('');
  const [playedCompletionSound, setPlayedCompletionSound] =
    React.useState(false); // Move this here
  const messageRef = React.useRef('');

  // Constants
  const TOP_BAR_HEIGHT = 36;
  const WINDOW_HEIGHTS = {
    welcomeWindow: 160,
    achievements: 320,
    wutIsJuice: 470,
    wutIsJungle: 470,
    register: 200,
    video: 397,
    faction: 200,
    juiceWindow: 300,
    jungleWindow: 300,
    fruitBasketWindow: 300,
    jungleShopWindowPosition: 300,
    fortuneBasket: 220,
    thanks: 300,
    secondChallenge: 300,
    menuWindow: 470,
    wutIsRelay: 470,
    galleryWindow: 397,
    tamagotchiNotes: 470,
    galleryWindow: 397,
    zero: 300,
    wutIsPenguathon: 300,
  };
  const BASE_Z_INDEX = 1;

  // Remove the eggShake keyframes and replace with this new approach
  const [shakeValues, setShakeValues] = React.useState({ rotate: 0, scale: 1 });
  const shakeIntervalRef = React.useRef(null);

  const startShaking = () => {
    let time = 0;
    setIsExpanded(true);

    shakeIntervalRef.current = setInterval(() => {
      time += 50; // Update every 50ms
      setShakeValues({
        rotate: Math.sin(time * 0.1) * 2, // Oscillate between -2 and 2 degrees
        scale: 1.3 + Math.sin(time * 0.2) * 0.05, // Oscillate between 1.25 and 1.35
      });
    }, 50);
  };

  const stopShaking = () => {
    if (shakeIntervalRef.current) {
      clearInterval(shakeIntervalRef.current);
    }
    setShakeValues({ rotate: 0, scale: 1 });
    setIsExpanded(false);
  };

  const playRandomBritishSound = () => {
    try {
      const sounds = [
        'if i had arms.mp3',
        'constantly be an infant.mp3',
        'do you want me to stay small forevrr.mp3',
        'giving up now are we_.mp3',
        'ill jusft sit here and rot.mp3',
        'like a forgotten lemon.mp3',
        'like a juice carton with no straw.mp3',
        'oi slacker.mp3',
        'otherwise I_ll meet my tragic death.mp3',
        'sad little pixel.mp3',
        'the blender is gaining dust.mp3',
        'wither away like a biscuit in a cup of tea.mp3',
      ];
      const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
      const audio = new Audio(`/BritishSoundsBad/${randomSound}`);

      audio.addEventListener('play', startShaking);
      audio.addEventListener('ended', stopShaking);
      audio.addEventListener('pause', stopShaking);
      audio.addEventListener('error', stopShaking);

      audio.play().catch((error) => {
        console.log('Audio playback error:', error);
        stopShaking();
      });
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };

  // Clean up interval on unmount
  React.useEffect(() => {
    return () => {
      if (shakeIntervalRef.current) {
        clearInterval(shakeIntervalRef.current);
      }
    };
  }, []);

  React.useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);

      const kickoffDate = new Date('2025-02-01T19:30:00-05:00'); // EST time
      const diff = kickoffDate - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeRemaining(
          `${days} Days, ${hours} Hours, ${minutes} Minutes, ${seconds} Seconds`
        );
      } else {
        setTimeRemaining('Event has started!');
      }
    }, []);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const handleFileClick = (fileId) => (e) => {
    e.stopPropagation();
    if (selectedFile === fileId) {
      if (fileId === 'Achievements') {
        if (!openWindows.includes('achievements')) {
          setOpenWindows((prev) => [...prev, 'achievements']);
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'achievements'),
            'achievements',
          ]);
          document.getElementById('windowOpenAudio').currentTime = 0;
          document.getElementById('windowOpenAudio').play();
        } else {
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'achievements'),
            'achievements',
          ]);
        }
      } else if (fileId === 'file1') {
        if (!openWindows.includes('wutIsJuice')) {
          setOpenWindows((prev) => [...prev, 'wutIsJuice']);
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'wutIsJuice'),
            'wutIsJuice',
          ]);
          document.getElementById('windowOpenAudio').currentTime = 0;
          document.getElementById('windowOpenAudio').play();
        } else {
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'wutIsJuice'),
            'wutIsJuice',
          ]);
        }
      } else if (fileId === 'Register') {
        if (!openWindows.includes('register')) {
          setOpenWindows((prev) => [...prev, 'register']);
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'register'),
            'register',
          ]);
          document.getElementById('windowOpenAudio').currentTime = 0;
          document.getElementById('windowOpenAudio').play();
        } else {
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'register'),
            'register',
          ]);
        }
      } else if (fileId === 'Juicer') {
        if (!openWindows.includes('juiceWindow')) {
          setOpenWindows((prev) => [...prev, 'juiceWindow']);
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'juiceWindow'),
            'juiceWindow',
          ]);
          document.getElementById('windowOpenAudio').currentTime = 0;
          document.getElementById('windowOpenAudio').play();
        } else {
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'juiceWindow'),
            'juiceWindow',
          ]);
        }
      } else if (fileId === 'video.mp4') {
        if (!openWindows.includes('video')) {
          setOpenWindows((prev) => [...prev, 'video']);
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'video'),
            'video',
          ]);
          document.getElementById('windowOpenAudio').currentTime = 0;
          document.getElementById('windowOpenAudio').play();
        } else {
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'video'),
            'video',
          ]);
        }
      } else if (fileId === 'Fortune Basket') {
        if (!openWindows.includes('fortuneBasket')) {
          setOpenWindows((prev) => [...prev, 'fortuneBasket']);
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'fortuneBasket'),
            'fortuneBasket',
          ]);
          document.getElementById('windowOpenAudio').currentTime = 0;
          document.getElementById('windowOpenAudio').play();
        } else {
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'fortuneBasket'),
            'fortuneBasket',
          ]);
        }
      } else if (fileId === 'Kudos') {
        if (!openWindows.includes('kudos')) {
          setOpenWindows((prev) => [...prev, 'kudos']);
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'kudos'),
            'kudos',
          ]);
          document.getElementById('windowOpenAudio').currentTime = 0;
          document.getElementById('windowOpenAudio').play();
        } else {
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'kudos'),
            'kudos',
          ]);
        }
      } else if (fileId === 'Thanks') {
        if (!openWindows.includes('thanks')) {
          setOpenWindows((prev) => [...prev, 'thanks']);
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'thanks'),
            'thanks',
          ]);
          document.getElementById('windowOpenAudio').currentTime = 0;
          document.getElementById('windowOpenAudio').play();
        } else {
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'thanks'),
            'thanks',
          ]);
        }
      } else if (fileId === 'Menu') {
        if (!openWindows.includes('menuWindow')) {
          setOpenWindows((prev) => [...prev, 'menuWindow']);
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'menuWindow'),
            'menuWindow',
          ]);
          document.getElementById('windowOpenAudio').currentTime = 0;
          document.getElementById('windowOpenAudio').play();
        } else {
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'menuWindow'),
            'menuWindow',
          ]);
        }
      } else if (fileId === 'Jungle') {
        if (!openWindows.includes('jungleWindow')) {
          setOpenWindows((prev) => [...prev, 'jungleWindow']);
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'jungleWindow'),
            'jungleWindow',
          ]);
          document.getElementById('windowOpenAudio').currentTime = 0;
          document.getElementById('windowOpenAudio').play();
        } else {
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'jungleWindow'),
            'jungleWindow',
          ]);
        }
      } else if (fileId === 'FruitBasket') {
        if (!openWindows.includes('fruitBasketWindow')) {
          setOpenWindows((prev) => [...prev, 'fruitBasketWindow']);
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'fruitBasketWindow'),
            'fruitBasketWindow',
          ]);
          document.getElementById('windowOpenAudio').currentTime = 0;
          document.getElementById('windowOpenAudio').play();
        } else {
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'fruitBasketWindow'),
            'fruitBasketWindow',
          ]);
        }
      } else if (fileId === 'Gallery') {
        if (!openWindows.includes('Gallery')) {
          setOpenWindows((prev) => [...prev, 'Gallery']);
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'Gallery'),
            'gallery',
          ]);
          document.getElementById('windowOpenAudio').currentTime = 0;
          document.getElementById('windowOpenAudio').play();
        } else {
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'gallery'),
            'gallery',
          ]);
        }
      } else if (fileId === 'wutIsJungle') {
        if (!openWindows.includes('wutIsJungle')) {
          setOpenWindows((prev) => [...prev, 'wutIsJungle']);
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'wutIsJungle'),
            'wutIsJungle',
          ]);
          document.getElementById('windowOpenAudio').currentTime = 0;
          document.getElementById('windowOpenAudio').play();
        } else {
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'wutIsJungle'),
            'wutIsJungle',
          ]);
        }
      } else if (fileId === 'JungleShop') {
        if (!openWindows.includes('jungleShopWindow')) {
          setOpenWindows((prev) => [...prev, 'jungleShopWindow']);
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'jungleShopWindow'),
            'jungleShopWindow',
          ]);
          document.getElementById('windowOpenAudio').currentTime = 0;
          document.getElementById('windowOpenAudio').play();
        } else {
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'jungleShopWindow'),
            'jungleShopWindow',
          ]);
        }
      } else if (fileId === 'tamagotchiNotes') {
        if (!openWindows.includes('tamagotchiNotes')) {
          setOpenWindows((prev) => [...prev, 'tamagotchiNotes']);
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'tamagotchiNotes'),
            'tamagotchiNotes',
          ]);
          document.getElementById('windowOpenAudio').currentTime = 0;
          document.getElementById('windowOpenAudio').play();
        } else {
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'tamagotchiNotes'),
            'tamagotchiNotes',
          ]);
        }
      } else if (fileId === 'Juice Zero') {
        if (!openWindows.includes('zero')) {
          setOpenWindows((prev) => [...prev, 'zero']);
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'zero'),
            'zero',
          ]);
          document.getElementById('windowOpenAudio').currentTime = 0;
          document.getElementById('windowOpenAudio').play();
        } else {
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'zero'),
            'zero',
          ]);
        }
      }
    }
    setSelectedFile(fileId);
  };

  const handleMouseDown = (windowName) => (e) => {
    console.log('MouseDown triggered for window:', windowName);
    e.stopPropagation();
    setIsDragging(true);
    setActiveWindow(windowName);
    console.log('Active window set to:', windowName);
    setWindowOrder((prev) => [
      ...prev.filter((w) => w !== windowName),
      windowName,
    ]);

    let position;
    switch (windowName) {
      case 'welcomeWindow':
        position = welcomePosition;
        break;
      case 'achievements':
        position = achievementsPosition;
        break;
      case 'wutIsJuice':
        position = wutIsJuicePosition;
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
      case 'juiceWindow':
        position = juiceWindowPosition;
        break;
      case 'fortuneBasket':
        console.log('Fortune Basket position:', fortuneBasketPosition);
        position = fortuneBasketPosition;
        break;
      case 'kudos':
        position = kudosPosition;
        break;
      case 'Gallery':
        position = GalleryPosition;
        break;
      case 'thanks':
        position = thanksPosition;
        break;
      case 'jungleWindow':
        position = jungleWindowPosition;
        break;
      case 'fruitBasketWindow':
        position = fruitBasketWindowPosition;
        break;
      case 'wutIsJungle':
        position = wutIsJunglePosition;
        break;
      case 'menuWindow':
        position = menuWindowPosition;
        break;
      case 'secondChallenge':
        position = secondChallengePosition;
        break;
      case 'wutIsRelay':
        position = wutIsRelayPosition;
        break;
      case 'jungleShopWindow':
        position = jungleShopWindowPosition;
        break;
      case 'tamagotchiNotes':
        position = tamagotchiNotesPosition;
        break;
      case 'zero':
        position = zeroWindowPosition;
        break;
      case 'wutIsPenguathon':
        position = wutIsPenguathonWindowPosition;
        break;
      default:
        console.log('Unknown window name:', windowName);
        position = { x: 0, y: 0 };
    }

    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    console.log('Drag start set to:', {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      console.log('Mouse move with active window:', activeWindow);
      const newY = e.clientY - dragStart.y;
      const actualTopPosition = window.innerHeight / 2 + newY;

      const windowHeight =
        WINDOW_HEIGHTS[activeWindow] || WINDOW_HEIGHTS.welcomeWindow;
      const boundedY =
        actualTopPosition < TOP_BAR_HEIGHT + windowHeight / 2
          ? TOP_BAR_HEIGHT + windowHeight / 2 - window.innerHeight / 2
          : newY;

      const newPosition = {
        x: e.clientX - dragStart.x,
        y: boundedY,
      };

      if (activeWindow === 'welcomeWindow') {
        setWelcomePosition(newPosition);
      } else if (activeWindow === 'achievements') {
        setAchievementsPosition(newPosition);
      } else if (activeWindow === 'wutIsJuice') {
        setwutIsJuicePosition(newPosition);
      } else if (activeWindow === 'register') {
        setRegisterPosition(newPosition);
      } else if (activeWindow === 'video') {
        setVideoPosition(newPosition);
      } else if (activeWindow === 'faction') {
        setFactionPosition(newPosition);
      } else if (activeWindow === 'firstChallenge') {
        setFirstChallengePosition(newPosition);
      } else if (activeWindow === 'juiceWindow') {
        setJuiceWindowPosition(newPosition);
      } else if (activeWindow === 'fortuneBasket') {
        console.log('Setting new fortune basket position:', newPosition);
        setFortuneBasketPosition(newPosition);
      } else if (activeWindow === 'kudos') {
        setKudosPosition(newPosition);
      } else if (activeWindow === 'Gallery') {
        setGalleryPosition(newPosition);
      } else if (activeWindow === 'thanks') {
        setThanksPosition(newPosition);
      } else if (activeWindow === 'jungleWindow') {
        setjungleWindowPosition(newPosition);
      } else if (activeWindow === 'fruitBasketWindow') {
        setFruitBasketWindowPosition(newPosition);
      } else if (activeWindow === 'menuWindow') {
        setMenuWindowPosition(newPosition);
      } else if (activeWindow === 'wutIsJungle') {
        setwutIsJunglePosition(newPosition);
      } else if (activeWindow === 'secondChallenge') {
        setSecondChallengePosition(newPosition);
      } else if (activeWindow === 'wutIsRelay') {
        setWutIsRelayPosition(newPosition);
      } else if (activeWindow === 'jungleShopWindow') {
        setJungleShopWindowPosition(newPosition);
      } else if (activeWindow === 'tamagotchiNotes') {
        setTamagotchiNotesPosition(newPosition);
      } else if (activeWindow === 'zero') {
        setZeroWindowPosition(newPosition);
      } else if (activeWindow === 'wutIsPenguathon') {
        setWutIsPenguathonWindowPosition(newPosition);
      }
    }
  }; // Add closing brace here

  const handleMouseUp = () => {
    console.log(
      'Mouse up, was dragging:',
      isDragging,
      'active window was:',
      activeWindow
    );
    setIsDragging(false);
    setActiveWindow(null);
  };

  const handleDismiss = (windowName) => {
    setOpenWindows((prev) => prev.filter((window) => window !== windowName));
    setWindowOrder((prev) => prev.filter((w) => w !== windowName));

    // Stop any audio when postcard window is closed
    if (windowName === 'postcard') {
      const audio = document.querySelector('audio[src="./song.mp3"]');
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    }

    if (windowName === 'register' && isLoggedIn) {
      // Any additional UI updates can go here
    }
  };

  const handleJuiceClick = () => {
    if (!openWindows.includes('welcomeWindow')) {
      setOpenWindows((prev) => [...prev, 'welcomeWindow']);
      setWelcomePosition({ x: 0, y: 0 });
      setWindowOrder((prev) => [
        ...prev.filter((w) => w !== 'welcomeWindow'),
        'welcomeWindow',
      ]);
    } else {
      setWindowOrder((prev) => [
        ...prev.filter((w) => w !== 'welcomeWindow'),
        'welcomeWindow',
      ]);
    }
  };

  const handleWindowClick = (windowName) => (e) => {
    e.stopPropagation();
    setWindowOrder((prev) => [
      ...prev.filter((w) => w !== windowName),
      windowName,
    ]);
  };

  const handleRegisterOpen = () => {
    if (!openWindows.includes('register')) {
      setOpenWindows((prev) => [...prev, 'register']);
      document.getElementById('windowOpenAudio').currentTime = 0;
      document.getElementById('windowOpenAudio').play();
      setWindowOrder((prev) => [
        ...prev.filter((w) => w !== 'register'),
        'register',
      ]);
    } else {
      setWindowOrder((prev) => [
        ...prev.filter((w) => w !== 'register'),
        'register',
      ]);
    }
  };

  const handleFactionOpen = () => {
    if (!openWindows.includes('faction')) {
      setOpenWindows((prev) => [...prev, 'faction']);
      document.getElementById('windowOpenAudio').currentTime = 0;
      document.getElementById('windowOpenAudio').play();
      setWindowOrder((prev) => [
        ...prev.filter((w) => w !== 'faction'),
        'faction',
      ]);
    } else {
      setWindowOrder((prev) => [
        ...prev.filter((w) => w !== 'faction'),
        'faction',
      ]);
    }
  };

  const handleFirstChallengeOpen = () => {
    if (!openWindows.includes('firstChallenge')) {
      setOpenWindows((prev) => [...prev, 'firstChallenge']);
      document.getElementById('windowOpenAudio').currentTime = 0;
      document.getElementById('windowOpenAudio').play();
      setWindowOrder((prev) => [
        ...prev.filter((w) => w !== 'firstChallenge'),
        'firstChallenge',
      ]);
    } else {
      setWindowOrder((prev) => [
        ...prev.filter((w) => w !== 'firstChallenge'),
        'firstChallenge',
      ]);
    }
  };
  const handleSecondChallengeOpen = () => {
    if (!openWindows.includes('secondChallenge')) {
      setOpenWindows((prev) => [...prev, 'secondChallenge']);
      document.getElementById('windowOpenAudio').currentTime = 0;
      document.getElementById('windowOpenAudio').play();
      setWindowOrder((prev) => [
        ...prev.filter((w) => w !== 'secondChallenge'),
        'secondChallenge',
      ]);
    } else {
      setWindowOrder((prev) => [
        ...prev.filter((w) => w !== 'secondChallenge'),
        'secondChallenge',
      ]);
    }
  };

  const handlePenguathonClick = () => {
    if (!openWindows.includes('wutIsPenguathon')) {
      setOpenWindows([...openWindows, 'wutIsPenguathon']);
      setWindowOrder([...windowOrder, 'wutIsPenguathon']);
    } else {
      handleWindowClick('wutIsPenguathon')();
    }
  };

  const handleRsvp = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Open register window if no token
        if (!openWindows.includes('register')) {
          setOpenWindows((prev) => [...prev, 'register']);
          document.getElementById('windowOpenAudio').currentTime = 0;
          document.getElementById('windowOpenAudio').play();
          setWindowOrder((prev) => [
            ...prev.filter((w) => w !== 'register'),
            'register',
          ]);
        }
        return;
      }

      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setIsRsvped(true);
      } else {
        console.error('Failed to RSVP');
      }
    } catch (error) {
      console.error('RSVP error:', error);
    }
  };

  React.useEffect(() => {
    if (isDragging) {
      console.log(
        'Adding mouse move/up listeners, active window:',
        activeWindow
      );
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, activeWindow, dragStart]);

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
    juicerSoundRef.current = new Audio('./juicer.mp3');
    juicerSoundRef.current.volume = 0.5;
    collectSoundRef.current = new Audio('./collect.mp3');
    collectSoundRef.current.volume = 0.5;
  }, []);

  React.useEffect(() => {
    if (userData?.invitesAvailable) {
      const allTickets = ['orange', 'kiwi', 'apple'];
      setTickets(
        allTickets.map((id) => ({
          id,
          used: !userData.invitesAvailable.includes(id),
        }))
      );
    }
  }, [userData?.invitesAvailable]);

  const handleFortuneCookieOpen = () => {
    if (!openWindows.includes('fortuneBasket')) {
      setOpenWindows((prev) => [...prev, 'fortuneBasket']);
      document.getElementById('windowOpenAudio').currentTime = 0;
      document.getElementById('windowOpenAudio').play();
    }
  };

  const handleAchievementsOpen = () => {
    if (!openWindows.includes('achievements')) {
      setOpenWindows((prev) => [...prev, 'achievements']);
    }
  };

  const startJuicing = () => {
    setIsJuicing(true);
    const juicerAudio = document.getElementById('juicerAudio');
    if (juicerAudio) {
      juicerAudio.currentTime = 0;
      juicerAudio.play();
    }

    // Stop after 7 seconds
    setTimeout(() => {
      setIsJuicing(false);
    }, 7000);
  };

  const playCollectSound = () => {
    const collectAudio = document.getElementById('collectAudio');
    if (collectAudio) {
      collectAudio.currentTime = 0;
      collectAudio.play();
    }
  };

  const isBeforePenguathonTime = () => {
    return Date.now() < 1740236400000;
  };

  const isPenguathonTime = () => {
    return Date.now() > 1740236400000 && Date.now() < 1740294000000;
  };

  const getPenguathonState = () => {
    const penguathonStart = 1740236400000;
    const penguathonEnd = 1740294000000;

    if (Date.now() > penguathonEnd) {
      return null;
    }

    if (Date.now() < penguathonStart) {
      return 'upcoming';
    }

    return 'happening now!';
  };

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 20000); // Update every second

    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const penguathonStart = new Date(1740236400000);
      const penguathonEnd = new Date(1740294000000);

      if (now >= penguathonStart && now <= penguathonEnd) {
        const totalSeconds = 24 * 60 * 60; // 24 hours in seconds
        const elapsedSeconds = Math.floor((now - penguathonStart) / 1000);
        const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds);

        const hours = Math.floor(remainingSeconds / 3600);
        const minutes = Math.floor((remainingSeconds % 3600) / 60);
        const seconds = remainingSeconds % 60;

        setPenguathonCountdown(
          `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 500); // 1 second grace period
  };

  React.useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      // Get next Friday 9pm EST
      const friday = new Date();
      friday.setDate(friday.getDate() + ((5 + 7 - friday.getDay()) % 7)); // Next Friday
      friday.setHours(21, 0, 0, 0); // 9pm
      friday.setMinutes(0);
      friday.setSeconds(0);

      const diff = friday - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setCountdownText(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      } else {
        setCountdownText('Egg Hatched!');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSquareClick = async (e) => {
    e.stopPropagation();

    // Check progress before playing sound
    const progress = getProgressPercentage(userData);
    if (progress >= 100) {
      playRandomGoodSound();
    } else {
      playRandomBritishSound();
    }

    // Only create Tamagotchi if user is logged in and doesn't have one yet
    if (isLoggedIn && !userData?.Tamagotchi?.length) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/create-tamagotchi', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          throw new Error('Failed to create Tamagotchi');
        }

        const data = await response.json();

        // Update userData with the new Tamagotchi
        setUserData((prevData) => ({
          ...prevData,
          Tamagotchi: [data.record],
        }));

        console.log('Tamagotchi created:', data);
      } catch (error) {
        console.error('Error creating Tamagotchi:', error);
      }
    }
  };

  // Add this function near the top with other helper functions
  const getEggColor = (email) => {
    if (!email) return 'blueegg.gif';

    const firstChar = email.charAt(0).toLowerCase();
    // Split alphabet roughly into thirds
    if ('abcdefghi'.includes(firstChar)) {
      return 'blueegg.gif';
    } else if ('jklmnopq'.includes(firstChar)) {
      return 'greenegg.gif';
    } else {
      return 'pinkegg.gif';
    }
  };

  // Add this helper function near the top of MainView component
  const getTamagotchiDay = (startDate) => {
    if (!startDate) return 1;
    const start = new Date(startDate);
    const now = new Date();
    // Calculate days difference in UTC
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Update the getTodaysHours helper function to use Tamagotchi start time
  const getTodaysHours = (stretches, startDate) => {
    if (!stretches || !startDate) return 0;

    const now = new Date();
    const tamagotchiStart = new Date(startDate);

    // If it's been more than 24 hours since start, use rolling 24h window
    // If it's been less than 24 hours, use time since start
    const dayWindow =
      now.getTime() - tamagotchiStart.getTime() >= 24 * 60 * 60 * 1000
        ? new Date(now.getTime() - 24 * 60 * 60 * 1000)
        : tamagotchiStart;

    console.log('Window start:', dayWindow.toISOString());
    console.log('Current time:', now.toISOString());

    return stretches.reduce((total, stretch) => {
      const stretchStart = new Date(stretch.startTime);
      const stretchEnd = new Date(stretch.endTime);
      
      console.log('\nStretch:', {
        start: stretchStart.toISOString(),
        end: stretchEnd.toISOString(),
        hours: stretch.timeWorkedHours
      });

      // Skip if stretch ended before window
      if (stretchEnd < dayWindow) {
        console.log('-> Skipped: ended before window');
        return total;
      }
      
      // If stretch started before window, only count time since window start
      if (stretchStart < dayWindow) {
        const hoursInWindow = (stretchEnd - dayWindow) / (1000 * 60 * 60);
        console.log('-> Partial: counting', hoursInWindow, 'hours');
        return total + Math.min(hoursInWindow, stretch.timeWorkedHours || 0);
      }
      
      console.log('-> Full: counting', stretch.timeWorkedHours, 'hours');
      return total + (stretch.timeWorkedHours || 0);
    }, 0);
  };

  // Update getRemainingHours to use UTC timestamp
  const getRemainingHours = (userData) => {
    const startDate = userData?.Tamagotchi?.[0]?.startDate;
    const todaysJuiceHours = getTodaysHours(
      userData?.juiceStretches,
      startDate
    );
    const todaysJungleHours = getTodaysHours(
      userData?.jungleStretches,
      startDate
    );
    const totalHours = todaysJuiceHours + todaysJungleHours;
    return Math.max(0, 2 - totalHours).toFixed(2);
  };

  // Update getProgressPercentage for more detailed logging
  const getProgressPercentage = (userData) => {
    if (!userData?.Tamagotchi?.length) return 0;

    const startDate = userData.Tamagotchi[0].startDate;
    const todaysJuiceHours = getTodaysHours(
      userData?.juiceStretches,
      startDate
    );
    const todaysJungleHours = getTodaysHours(
      userData?.jungleStretches,
      startDate
    );
    const totalHours = todaysJuiceHours + todaysJungleHours;
    return Math.min(100, (totalHours / 2) * 100);
  };

  // Add this after getProgressPercentage and before MainView component
  const getStatusMessage = (userData) => {
    const remainingHours = getRemainingHours(userData);
    const startTime = userData?.Tamagotchi?.[0]?.startDate;
    const now = new Date();

    // Calculate next feeding deadline in UTC
    const nextFeedingDeadline = startTime
      ? new Date(new Date(startTime).getTime() + 24 * 60 * 60 * 1000)
      : new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const hoursUntilDeadline = Math.max(
      0,
      Math.ceil(
        (nextFeedingDeadline.getTime() - now.getTime()) / (1000 * 60 * 60)
      )
    );
    const daysLeft =
      10 - getTamagotchiDay(userData?.Tamagotchi?.[0]?.startDate);

    if (remainingHours === '0.00') {
      return `I'm full for the next ${hoursUntilDeadline} hours. ty for feeding me. just ${daysLeft} more days of feeding me and then I'll come to you in the mail as a tamagotchi`;
    } else {
      return `i'm hungry! feed me ${remainingHours} more hours of juice or jungle within the next ${hoursUntilDeadline} hours or I'll perish. ${
        daysLeft > 0
          ? `if you keep me alive ${daysLeft} more days, Hack Club will mail me to you (a real life tamagotchi)`
          : 'Hack Club will mail me to you soon!'
      }`;
    }
  };

  // Add this helper function with the others
  const isTamagotchiDead = (userData) => {
    if (!userData?.Tamagotchi?.length) return false;

    const startTime = new Date(userData.Tamagotchi[0].startDate);
    const now = new Date();

    // Calculate how many complete 24h periods have passed
    const totalHoursSinceStart =
      (now.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    const completePeriods = Math.floor(totalHoursSinceStart / 24);

    // Check each 24h period
    for (let i = 0; i < completePeriods; i++) {
      const periodStart = new Date(
        startTime.getTime() + i * 24 * 60 * 60 * 1000
      );
      const periodEnd = new Date(periodStart.getTime() + 24 * 60 * 60 * 1000);

      // Calculate hours worked in this period
      const periodHours =
        (userData.juiceStretches || []).reduce((total, stretch) => {
          const stretchTime = new Date(stretch.startTime);
          if (stretchTime >= periodStart && stretchTime < periodEnd) {
            return total + (stretch.timeWorkedHours || 0);
          }
          return total;
        }, 0) +
        (userData.jungleStretches || []).reduce((total, stretch) => {
          const stretchTime = new Date(stretch.startTime);
          if (stretchTime >= periodStart && stretchTime < periodEnd) {
            return total + (stretch.timeWorkedHours || 0);
          }
          return total;
        }, 0);

      // If any period has less than 2 hours, the Tamagotchi is dead
      if (periodHours < 2) {
        return true;
      }
    }

    return false;
  };

  // Add this effect to handle the typing animation
  React.useEffect(() => {
    if (!isHovered) {
      setDisplayedMessage('');
      return;
    }

    const progress = getProgressPercentage(userData);

    // Play completion sound when reaching 100% for the first time today
    if (progress >= 100 && !playedCompletionSound) {
      playRandomGoodSound();
      setPlayedCompletionSound(true);
    }

    const message = !isTamagotchiDead(userData) && getStatusMessage(userData);
    messageRef.current = message || '';

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= messageRef.current.length) {
        setDisplayedMessage(messageRef.current.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 7); // Changed from 20ms to 7ms for 3x speed

    return () => clearInterval(interval);
  }, [isHovered, userData, playedCompletionSound]);

  // Reset the completion sound flag at midnight
  React.useEffect(() => {
    const resetCompletionSound = () => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        setPlayedCompletionSound(false);
      }
    };

    const interval = setInterval(resetCompletionSound, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  // Add this new function near the other sound functions
  const playRandomGoodSound = () => {
    try {
      const sounds = [
        'distinguished gentlepet.mp3',
        'another day for my cup of tea.mp3',
        'blimey, tail wagging.mp3',
        'chance to meet.mp3',
        'high five.mp3',
        'most well raised in history.mp3',
        'orange juice or apple juice_.mp3',
        'round of applause.mp3',
        'stupendous work.mp3',
        'well done mate.mp3',
      ];
      const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
      const audio = new Audio(`/BritishSoundsGood/${randomSound}`);

      audio.addEventListener('play', startShaking);
      audio.addEventListener('ended', stopShaking);
      audio.addEventListener('pause', stopShaking);
      audio.addEventListener('error', stopShaking);

      audio.play().catch((error) => {
        console.log('Audio playback error:', error);
        stopShaking();
      });
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };

  // Update the getEggColor function to getTamagotchiType
  const getTamagotchiType = (email) => {
    if (!email) return 'kiwibird.gif'; // Default blue

    const firstChar = email.charAt(0).toLowerCase();
    // Match animals to similar colored eggs:
    // kiwibird (blue) -> blueegg
    // blueberryturtle (green) -> greenegg
    // strawberrycat (pink/red) -> pinkegg
    if ('abcdefghi'.includes(firstChar)) {
      return 'kiwibird.gif'; // Blue theme
    } else if ('jklmnopq'.includes(firstChar)) {
      return 'blueberryturtle.gif'; // Green theme
    } else {
      return 'strawberrycat.gif'; // Pink/red theme
    }
  };
