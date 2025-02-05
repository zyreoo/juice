import React, { useState, useEffect, useRef } from 'react';

export default function SecondChallengeWindow({ position, isDragging, isActive, handleMouseDown, handleDismiss, handleWindowClick, BASE_Z_INDEX, ACTIVE_Z_INDEX, userData, setUserData }) {
    const [prLink, setPrLink] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [token, setToken] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
        
        // Check achievements from userData prop
        if (userData?.achievements?.includes('second_challenge_completed')) {
            setIsSuccess(true);
        }
    }, [userData]);

    const handleSubmit = async () => {
        if (!token) {
            setError('Please log in first');
            return;
        }

        if (!prLink) {
            setError('Please enter a PR link');
            return;
        }
        
        setIsSubmitting(true);
        setError('');
        
        try {
            const response = await fetch('/api/submit-second-challenge', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, prLink }),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to submit');
            }
            
            // Play collect sound
            audioRef.current?.play();
            
            // Trigger the shake animation
            document.querySelector('div[data-shake-container="true"]')?.style.setProperty('animation', 'shake 0.6s cubic-bezier(.36,.07,.19,.97) both');
            setTimeout(() => {
                document.querySelector('div[data-shake-container="true"]')?.style.setProperty('animation', 'none');
            }, 600);

            // Update userData with new achievement
            setUserData({
                ...userData,
                achievements: [...(userData?.achievements || []), 'second_challenge_completed']
            });

            setIsSuccess(true);
            setPrLink(''); // Clear the input
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const hasCompleted = userData?.achievements?.includes('second_challenge_completed') || isSuccess;

    return (
        <div style={{
            position: "absolute", 
            zIndex: isActive ? ACTIVE_Z_INDEX : BASE_Z_INDEX, 
            transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
            top: "50%",
            left: "50%",
        }}>
            <div 
                onClick={handleWindowClick('secondChallenge')}
                style={{
                    display: "flex", 
                    width: 500,
                    color: 'black',
                    height: 300,
                    backgroundColor: "#fff", 
                    border: "1px solid #000", 
                    borderRadius: 4,
                    flexDirection: "column",
                    padding: 0,
                    userSelect: "none",
                    animation: "linear .3s windowShakeAndScale"
                }}>
                <audio ref={audioRef} src="/collect.mp3" />
                <div 
                    onMouseDown={handleMouseDown('secondChallenge')}
                    style={{display: "flex", borderBottom: "1px solid #000", padding: 8, flexDirection: "row", justifyContent: "space-between", cursor: isDragging ? 'grabbing' : 'grab'}}>
                    <div style={{display: "flex", flexDirection: "row", gap: 8}}>
                        <button onClick={(e) => { e.stopPropagation(); handleDismiss('secondChallenge'); }}>x</button>
                    </div>
                    <p>SecondChallenge.txt</p>
                    <div></div>
                </div>
                <div style={{display: "flex", flexDirection: "column", gap: 12, padding: 16}}>
                    <p>Hello World</p>
                    {!hasCompleted && (
                        <div style={{display: "flex", flexDirection: "row", gap: 8}}>
                            <input 
                                placeholder="link to your submission" 
                                style={{width: 250}} 
                                value={prLink}
                                onChange={(e) => setPrLink(e.target.value)}
                            />
                            <button 
                                style={{width: 150}}
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'complete challenge'}
                            </button>
                        </div>
                    )}
                    {error && <p style={{color: 'red', margin: 0}}>{error}</p>}
                    {hasCompleted && (
                        <p style={{color: 'green', margin: 0}}>Challenge completed! Achievement unlocked: Second Challenge Complete 🎉</p>
                    )}
                </div>
            </div>
        </div>
    );
} 