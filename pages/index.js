import Head from "next/head";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useState, useRef, useEffect } from "react";
import ThreeDWorld from "@/components/screens/ThreeDWorld";
import LoadingScreen from "@/components/screens/LoadingScreen";
import MainView from "@/components/screens/MainView";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [stage, setStage] = useState('initial'); // 'initial', 'mac', 'loading', or 'computer'
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const progressRef = useRef(0);

  const handleAuthentication = async (token) => {
    try {
      const response = await fetch('/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.userData) {
        localStorage.setItem('authToken', token);
        setUserData(data.userData);
        setIsLoggedIn(true);
        setStage('computer');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error authenticating:', error);
      return false;
    }
  };

  useEffect(() => {
    // Check for auth token on mount
    const authToken = localStorage.getItem('token');
    if (authToken) {
      setIsLoggedIn(true);
      setStage('computer'); // Skip straight to computer stage
      
      // Fetch user data
      fetch('/api/user', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.userData) {
          setUserData(data.userData);
        }
        console.log(data.userData)
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
    } else {
      setStage('mac'); // Start with 3D world if not logged in
    }
  }, []);

  useEffect(() => {
    if (stage === 'loading') {
      const startTime = Date.now();
      const duration = 12500;
      let animationFrame;

      const easeInOutCubic = (x) => {
        return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
      };

      const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        const rawProgress = Math.min(elapsed / duration, 1);
        const easedProgress = easeInOutCubic(rawProgress) * 100;
        
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
          progressBar.style.width = `${easedProgress}%`;
        }

        if (rawProgress < 1) {
          animationFrame = requestAnimationFrame(updateProgress);
        } else {
          setStage('computer');
        }
      };

      animationFrame = requestAnimationFrame(updateProgress);
      
      return () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
      };
    }
  }, [stage]);

  return (
    <>
      <Head>
        <title>Juice</title>
        <meta name="description" content="juice" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        {stage === 'mac' && <ThreeDWorld onDiskInserted={() => setStage('loading')} />}
        {stage === 'loading' && <LoadingScreen />}
        {stage === 'computer' && (
          <MainView 
            isLoggedIn={isLoggedIn} 
            setIsLoggedIn={setIsLoggedIn} 
            userData={userData}
            onAuthenticate={handleAuthentication}
          />
        )}
      </main>
    </>
  );
}
