import Head from "next/head";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [currentFruit, setCurrentFruit] = useState("🧃");
  const [faviconHref, setFaviconHref] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const juicyFruits = ["🍎", "🍐", "🍊", "🍋", "🍇", "🫐", "🍑", "🍓", "🍒", "🍍", "🥭", "🍎"];

  // Add this new useEffect at the top with other effects
  useEffect(() => {
    const links = [
      "https://youtu.be/Fy0aCDmgnxg?feature=shared",
      "https://www.youtube.com/watch?v=ufMUJ9D1fi8",
      "https://www.youtube.com/shorts/Ns-bX2KbBRg",
      "https://youtu.be/2sLou4kva1s?feature=shared",
      "https://www.youtube.com/watch?v=m5GH9xyneTg",
      "https://quarter--mile.com/Unconventional-Adventures",
      "https://youtu.be/Hv9TyB9jvpM?feature=shared"
    ];
    
    const randomLink = links[Math.floor(Math.random() * links.length)];
    console.log(randomLink);
  }, []); // Empty dependency array means this runs once on mount

  // Countdown timer effect
  useEffect(() => {
    const targetDate = new Date('2025-01-24T19:30:00-05:00'); // 7:30 PM EST on Jan 24 2025

    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft("IT'S TIME");
        clearInterval(timer);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      
      // Play tick sound if isPlaying is true
      if (isPlaying && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying]);

  useEffect(() => {
    // Create favicon from emoji
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    ctx.font = '28px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(currentFruit, 16, 16);
    setFaviconHref(canvas.toDataURL());
  }, [currentFruit]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFruit(prevFruit => {
        const currentIndex = juicyFruits.indexOf(prevFruit);
        return juicyFruits[(currentIndex + 1) % juicyFruits.length];
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    setIsPlaying(true);
  };

  return (
    <>
      <Head>
        <title>{currentFruit}{currentFruit}{currentFruit}{currentFruit}{currentFruit}{currentFruit}{currentFruit}{currentFruit}{currentFruit}{currentFruit}{currentFruit}{currentFruit}{currentFruit}{currentFruit}</title>
        <meta name="description" content="erofeb deneppah reven sah siht" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={faviconHref} />
      </Head>
      <div 
        onClick={handleClick} 
        style={{display: "flex", cursor: "pointer", alignItems: "center", justifyContent: "center", width: "100%", height: "100vh", flexDirection: "column"}}
      >
        <p style={{fontSize: 8}}><a 
          href="https://support.google.com/chrome/answer/95314#:~:text=Choose%20your%20homepage" 
          target="_blank" 
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
        >
          make this home
        </a></p>
        <p>it shaped who we are and now we get to shape it</p>
        <p>a new internet, a new world, a new you</p>
        <p>{timeLeft}</p>
        <audio ref={audioRef} src="./tick.mp3" />
      </div>
    </>
  );
}
