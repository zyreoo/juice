import React, { useState, useEffect, useRef } from 'react';

export default function JuiceWindow({ position, isDragging, isActive, handleMouseDown, handleDismiss, handleWindowClick, BASE_Z_INDEX, ACTIVE_Z_INDEX, userData, setUserData }) {
    const [isJuicing, setIsJuicing] = useState(false);
    const [currentStretchId, setCurrentStretchId] = useState(null);
    const [timeJuiced, setTimeJuiced] = useState('0:00');
    const [startTime, setStartTime] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [stopTime, setStopTime] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        let interval;
        if (isJuicing && startTime && !stopTime) {
            interval = setInterval(() => {
                const now = new Date();
                const diff = Math.floor((now - startTime) / 1000);
                const minutes = Math.floor(diff / 60);
                const seconds = diff % 60;
                setTimeJuiced(`${minutes}:${seconds.toString().padStart(2, '0')}`);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isJuicing, startTime, stopTime]);

    const handleStartJuicing = async () => {
        try {
            const response = await fetch('/api/start-juice-stretch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: userData.token
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to start juice stretch');
            }

            const data = await response.json();
            setCurrentStretchId(data.stretchId);
            setIsJuicing(true);
            setStartTime(new Date());
            setStopTime(null);
            setSelectedVideo(null);
            setDescription('');
        } catch (error) {
            console.error('Error starting juice stretch:', error);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.type.startsWith('video/')) {
                setSelectedVideo(file);
                setStopTime(new Date());
            } else {
                alert('Please select a video file');
            }
        }
    };

    const handleEndStretch = async () => {
        if (!selectedVideo || !description.trim()) {
            alert('Please upload a video and add a description');
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('video', selectedVideo);
            formData.append('description', description);
            formData.append('token', userData.token);
            formData.append('stretchId', currentStretchId);
            formData.append('stopTime', stopTime.toISOString());

            const response = await fetch('/api/create-omg-moment', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to create OMG moment');
            }

            // Fetch updated user data to get new total time
            const userResponse = await fetch('/api/user', {
                headers: {
                    'Authorization': `Bearer ${userData.token}`
                }
            });
            
            if (userResponse.ok) {
                const { userData: updatedUserData } = await userResponse.json();
                setUserData(updatedUserData);
            }

            setIsJuicing(false);
            setCurrentStretchId(null);
            setStartTime(null);
            setStopTime(null);
            setSelectedVideo(null);
            setDescription('');
            setTimeJuiced('0:00');
        } catch (error) {
            console.error('Error creating OMG moment:', error);
            alert('Failed to create OMG moment. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div 
            onClick={handleWindowClick('juiceWindow')}
            style={{
                display: "flex", 
                position: "absolute", 
                zIndex: isActive ? ACTIVE_Z_INDEX : BASE_Z_INDEX, 
                width: 400,
                height: 300,
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
            <div 
                onMouseDown={handleMouseDown('juiceWindow')}
                style={{
                    display: "flex", 
                    borderBottom: "1px solid #000", 
                    padding: 8, 
                    flexDirection: "row", 
                    justifyContent: "space-between", 
                    cursor: isDragging ? 'grabbing' : 'grab'
                }}>
                <div style={{display: "flex", flexDirection: "row", gap: 8}}>
                    <button onClick={(e) => { e.stopPropagation(); handleDismiss('juiceWindow'); }}>x</button>
                </div>
                <p>Juicer</p>
                <div></div>
            </div>
            <div style={{flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 8}}>
                <h1 style={{fontSize: 32, lineHeight: 1}}>Juicer</h1>
                <p>Current Challenge: Build something amazing!</p>
                <div style={{display: "flex", flexDirection: "column", gap: 4}}>
                    <p>Current Session: {timeJuiced}</p>
                    <p>Total Time Juiced: {userData?.totalStretchHours ? 
                        `${Math.floor(userData.totalStretchHours)} hours ${Math.round((userData.totalStretchHours % 1) * 60)} min` : 
                        "0 hours 0 min"}</p>
                </div>
                {!isJuicing &&
                <button onClick={handleStartJuicing}>
                    Start Juicing
                </button>}
                {isJuicing &&
                <div style={{padding: 8, display: 'flex', gap: 4, flexDirection: "column", border: "1px solid #000"}}>
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="video/*"
                        style={{ display: 'none' }}
                    />
                    <p 
                        onClick={handleUploadClick}
                        style={{
                            cursor: 'pointer', 
                            textAlign: "center", 
                            width: "100%", 
                            padding: 4, 
                            border: "1px solid #000", 
                            textDecoration: 'underline'
                        }}
                    >
                        {selectedVideo ? selectedVideo.name : 'Upload Video'}
                    </p>
                    <textarea 
                        style={{width: "100%", padding: 2}} 
                        placeholder="wut works?"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <button 
                        onClick={handleEndStretch}
                        disabled={isSubmitting}
                        style={{width: "100%"}}
                    >
                        {isSubmitting ? 'Juicing...' : 'End Stretch with your "OMG IT WORKS" moment'}
                    </button>
                </div>
                }
            </div>
        </div>
    );
} 