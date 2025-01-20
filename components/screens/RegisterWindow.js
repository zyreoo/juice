import React, { useEffect, useRef, useState } from 'react';

export default function RegisterWindow({ position, isDragging, isActive, handleMouseDown, handleDismiss, handleWindowClick, BASE_Z_INDEX, ACTIVE_Z_INDEX, isLoggedIn, setIsLoggedIn }) {
    const inputRef = useRef(null);
    const audioRef = useRef(null);
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle');
    const [showTokenUpload, setShowTokenUpload] = useState(false);
    const [isDraggingFile, setIsDraggingFile] = useState(false);
    const [tokenStatus, setTokenStatus] = useState('');
    const [isShaking, setIsShaking] = useState(false);

    useEffect(() => {
        if (inputRef.current && !showTokenUpload) {
            inputRef.current.focus();
        }
    }, [showTokenUpload]);

    const handleSubmit = async () => {
        if (!email) return;
        
        setStatus('loading');
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) throw new Error('Registration failed');

            setStatus('success');
            setEmail('');
            setShowTokenUpload(true);
        } catch (error) {
            console.error('Registration error:', error);
            setStatus('error');
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDraggingFile(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDraggingFile(false);
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        setIsDraggingFile(false);

        const file = e.dataTransfer.files[0];
        if (!file) return;

        try {
            const text = await file.text();
            // Store the token in localStorage
            localStorage.setItem('token', text.trim());
            setTokenStatus('success');
            setIsLoggedIn(true);
            // Play collect sound
            audioRef.current?.play();
            // Trigger the shake animation in the parent
            document.querySelector('div[data-shake-container="true"]')?.style.setProperty('animation', 'shake 0.6s cubic-bezier(.36,.07,.19,.97) both');
            setTimeout(() => {
                document.querySelector('div[data-shake-container="true"]')?.style.setProperty('animation', 'none');
            }, 600);
        } catch (error) {
            console.error('Error reading token file:', error);
            setTokenStatus('error');
        }
    };

    return (
        <div 
            onClick={handleWindowClick('register')}
            style={{
                display: "flex", 
                position: "absolute", 
                zIndex: isActive ? ACTIVE_Z_INDEX : BASE_Z_INDEX, 
                width: 400,
                height: 200,
                color: 'black',
                backgroundColor: "#fff", 
                border: "1px solid #000", 
                borderRadius: 4,
                flexDirection: "column",
                padding: 0,
                justifyContent: "space-between",
                transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
                top: "50%",
                left: "50%",
                userSelect: "none"
            }}>
            {tokenStatus === 'success' && (
                <audio ref={audioRef} src="./collect.mp3" />
            )}
            <div 
                onMouseDown={handleMouseDown('register')}
                style={{display: "flex", borderBottom: "1px solid #000", padding: 8, flexDirection: "row", justifyContent: "space-between", cursor: isDragging ? 'grabbing' : 'grab'}}>
                <div style={{display: "flex", flexDirection: "row", gap: 8}}>
                    <button onClick={(e) => { e.stopPropagation(); handleDismiss('register'); }}>x</button>
                </div>
                <p>{showTokenUpload ? 'Upload Your Special Key' : 'Register'}</p>
                <div></div>
            </div>
            <div style={{flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 12}}>
                {!showTokenUpload ? (
                    <>
                        <p><i>Adventure Calls...</i> signing up means joining our team and committing to making your game.</p>
                        <div style={{display: "flex", height: 24, flexDirection: "row", gap: 8}}>
                            <input 
                                ref={inputRef}
                                style={{height: 24, padding: "2px 4px"}} 
                                placeholder='marsha@mellow.yum'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                            />
                            <button 
                                style={{height: 24}}
                                onClick={handleSubmit}
                                disabled={status === 'loading'}
                            >
                                {status === 'loading' ? 'Sending...' : 'signup'}
                            </button>
                        </div>
                        {status === 'success' && <p style={{color: 'green'}}>Thanks! Check your email soon.</p>}
                        {status === 'error' && <p style={{color: 'red'}}>Oops! Something went wrong. Please try again.</p>}
                        {(!(status === "error" || status === "success")) && (
                            <p>I will immediately email you a guide & special key to get your game started & start juicing.</p>
                        )}
                    </>
                ) : (
                    <div 
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        style={{
                            flex: 1,
                            border: `2px dashed ${isDraggingFile ? '#4a90e2' : '#ccc'}`,
                            borderRadius: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 16,
                            backgroundColor: isDraggingFile ? 'rgba(74, 144, 226, 0.1)' : 'transparent',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {tokenStatus === 'success' ? (
                            <p style={{color: 'green'}}>Special key accepted...</p>
                        ) : tokenStatus === 'error' ? (
                            <p style={{color: 'red'}}>Error reading the key file. Please try again.</p>
                        ) : (
                            <p>Drag and drop your special key file here</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
} 