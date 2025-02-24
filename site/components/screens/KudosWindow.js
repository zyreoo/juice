import React, { useState, useEffect, useRef } from 'react';

export default function KudosWindow({ position, isDragging, isActive, handleMouseDown, handleDismiss, handleWindowClick, BASE_Z_INDEX, ACTIVE_Z_INDEX }) {
    const [moments, setMoments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [kudosCounts, setKudosCounts] = useState({});
    const [animatingKudos, setAnimatingKudos] = useState({});
    const [clickIntensity, setClickIntensity] = useState({});
    const [limitReached, setLimitReached] = useState({});
    
    // Ref for the scrollable container
    const scrollContainerRef = useRef(null);

    // First, calculate the available width accounting for padding and gaps
    const WINDOW_WIDTH = 650;
    const SIDE_PADDING = 0; // 16px padding on each side
    const GRID_GAP = 16; // gap between cards
    const COLUMNS = 3;
    const AVAILABLE_WIDTH = WINDOW_WIDTH - 32;
    const CARD_WIDTH = Math.floor((AVAILABLE_WIDTH - (GRID_GAP * (COLUMNS - 1))) / COLUMNS);

    // Calculate video height for 16:9 aspect ratio
    const VIDEO_HEIGHT = Math.floor((CARD_WIDTH * 9) / 16);

    useEffect(() => {
        const fetchMoments = async () => {
            try {
                const response = await fetch('/api/get-omg-moments');
                if (!response.ok) {
                    throw new Error('Failed to fetch moments');
                }
                const data = await response.json();
                
                // Filter out any moments without videos
                const validMoments = data.filter(moment => moment.video);
                
                // Initialize kudos counts and check for limit reached
                const initialKudos = {};
                const initialLimitReached = {};
                validMoments.forEach(moment => {
                    initialKudos[moment.id] = moment.kudos || 0;
                    initialLimitReached[moment.id] = (moment.kudos || 0) >= 100;
                });
                
                setMoments(validMoments);
                setKudosCounts(initialKudos);
                setLimitReached(initialLimitReached);
            } catch (err) {
                console.error('Error fetching moments:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMoments();
    }, []);

    const handleKudos = async (momentId) => {
        // Don't process if limit is reached
        if (limitReached[momentId]) {
            // Play a special "limit reached" animation
            setAnimatingKudos(prev => ({
                ...prev,
                [momentId]: true
            }));
            setTimeout(() => {
                setAnimatingKudos(prev => ({
                    ...prev,
                    [momentId]: false
                }));
            }, 150);
            return;
        }

        // Track click intensity for this moment
        setClickIntensity(prev => ({
            ...prev,
            [momentId]: (prev[momentId] || 0) + 1
        }));

        // Reset click intensity after a delay
        setTimeout(() => {
            setClickIntensity(prev => ({
                ...prev,
                [momentId]: Math.max(0, (prev[momentId] || 0) - 1)
            }));
        }, 300);

        // Visual feedback - start animation
        setAnimatingKudos(prev => ({
            ...prev,
            [momentId]: true
        }));
        
        // Reset animation after 150ms
        setTimeout(() => {
            setAnimatingKudos(prev => ({
                ...prev,
                [momentId]: false
            }));
        }, 150);

        // Trigger screen shake with intensity based on recent clicks
        const container = document.querySelector('div[data-shake-container="true"]');
        if (container) {
            const intensity = Math.min(1.5, 0.6 + (clickIntensity[momentId] || 0) * 0.1);
            container.style.animation = 'none';
            container.offsetHeight; // Force reflow
            container.style.animation = `shake ${0.6/intensity}s cubic-bezier(.36,.07,.19,.97) both`;
            setTimeout(() => {
                container.style.animation = 'none';
            }, 600/intensity);
        }

        // Optimistically update the UI
        setKudosCounts(prev => ({
            ...prev,
            [momentId]: (prev[momentId] || 0) + 1
        }));
        
        // Play clap sound with varying pitch based on click intensity
        const audio = new Audio('/clap.mp3');
        audio.preservesPitch = false;
        const intensity = clickIntensity[momentId] || 0;
        audio.playbackRate = 0.9 + Math.random() * 0.3 + (intensity * 0.05);
        audio.volume = Math.min(0.8 + (intensity * 0.02), 1);
        audio.play().then(() => {
            audio.addEventListener('ended', () => {
                audio.remove();
            });
        }).catch(err => console.error('Error playing clap:', err));

        try {
            // Call API to persist the kudos
            const response = await fetch('/api/give-kudos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ momentId })
            });

            if (!response.ok) {
                throw new Error('Failed to update kudos');
            }

            const data = await response.json();
            
            // Update with the real count from the server
            setKudosCounts(prev => ({
                ...prev,
                [momentId]: data.kudos
            }));

            // Update limit reached status
            if (data.limitReached) {
                setLimitReached(prev => ({
                    ...prev,
                    [momentId]: true
                }));
            }
        } catch (error) {
            console.error('Error updating kudos:', error);
            // Revert the optimistic update on error
            setKudosCounts(prev => ({
                ...prev,
                [momentId]: (prev[momentId] || 0) - 1
            }));
        }
    };

    return (
        <div style={{
            position: "absolute", 
            transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
            top: "50%",
            left: "50%",
            zIndex: isActive ? ACTIVE_Z_INDEX : BASE_Z_INDEX, 
        }}>
            <div 
                onClick={handleWindowClick('kudos')}
                style={{
                    display: "flex", 
                    width: 650,
                    color: 'black',
                    height: 470,
                    backgroundColor: "#fff", 
                    border: "1px solid #000", 
                    borderRadius: 4,
                    flexDirection: "column",
                    padding: 0,
                    userSelect: "none",
                    animation: "linear .3s windowShakeAndScale"
                }}>
                <style jsx>{`
                    @keyframes colorPulse {
                        0% {
                            background-color: #3870FF;
                            transform: scale(0.95);
                            filter: brightness(1);
                        }
                        25% {
                            background-color: #FF3870;
                            transform: scale(1.05);
                            filter: brightness(1.3);
                        }
                        50% {
                            background-color: #70FF38;
                            transform: scale(0.97);
                            filter: brightness(1.5);
                        }
                        75% {
                            background-color: #FF38F0;
                            transform: scale(1.02);
                            filter: brightness(1.3);
                        }
                        100% {
                            background-color: #3870FF;
                            transform: scale(1);
                            filter: brightness(1);
                        }
                    }
                    @keyframes glowPulse {
                        0% {
                            box-shadow: 0 0 5px rgba(56, 112, 255, 0.5);
                        }
                        25% {
                            box-shadow: 0 0 20px rgba(255, 56, 112, 0.8);
                        }
                        50% {
                            box-shadow: 0 0 35px rgba(112, 255, 56, 1);
                        }
                        75% {
                            box-shadow: 0 0 20px rgba(255, 56, 240, 0.8);
                        }
                        100% {
                            box-shadow: 0 0 5px rgba(56, 112, 255, 0.5);
                        }
                    }
                    @keyframes numberPop {
                        0% {
                            transform: scale(1);
                            filter: hue-rotate(0deg) brightness(1);
                        }
                        50% {
                            transform: scale(1.5);
                            filter: hue-rotate(180deg) brightness(2);
                        }
                        100% {
                            transform: scale(1);
                            filter: hue-rotate(360deg) brightness(1);
                        }
                    }
                `}</style>
                <div 
                    onMouseDown={handleMouseDown('kudos')}
                    style={{display: "flex", borderBottom: "1px solid #000", padding: 8, flexDirection: "row", justifyContent: "space-between", cursor: isDragging ? 'grabbing' : 'grab'}}>
                    <div style={{display: "flex", flexDirection: "row", gap: 8}}>
                        <button onClick={(e) => { e.stopPropagation(); handleDismiss('kudos'); }}>x</button>
                    </div>
                    <p>Kudos</p>
                    <div></div>
                </div>
                <div 
                    ref={scrollContainerRef}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 16,
                        padding: 16,
                        height: "calc(100% - 37px)", // Account for header height
                        overflow: "auto",
                    }}>
                    <h2 style={{ margin: 0 }}>"OMG IT WORKS MOMENTS"</h2>
                    
                    {loading && <p>Loading moments...</p>}
                    {error && <p style={{ color: 'red' }}>Error: {error}</p>}
                    
                    {!loading && !error && (
                        moments.length === 0 ? (
                            <p>No demos shared today yet! Be the first, I dare u ;)</p>
                        ) : (
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: `repeat(3, ${CARD_WIDTH}px)`, // Dynamic width based on calculation
                                gap: GRID_GAP,
                                width: "fit-content",
                                margin: "0 auto",
                                padding: `0 ${SIDE_PADDING/2}px` // Add padding to match the original layout
                            }}>
                                {moments.map(moment => (
                                    <div key={moment.id} style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 8,
                                        position: "relative",
                                        width: CARD_WIDTH,
                                        height: VIDEO_HEIGHT + 90, // Video height + space for description
                                        overflow: "hidden"
                                    }}>
                                        <div style={{
                                            position: "relative",
                                            width: CARD_WIDTH,
                                            height: VIDEO_HEIGHT,
                                            backgroundColor: "#000",
                                            borderRadius: 4,
                                            overflow: "hidden"
                                        }}>
                                            <video 
                                                onMouseEnter={e => {
                                                    try {
                                                        e.target.play();
                                                    } catch (err) {
                                                        console.error('Error playing video:', err);
                                                    }
                                                }}
                                                onMouseLeave={e => {
                                                    try {
                                                        e.target.pause();
                                                        e.target.currentTime = 0;
                                                    } catch (err) {
                                                        console.error('Error pausing video:', err);
                                                    }
                                                }}
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover",
                                                    borderRadius: 4
                                                }}
                                            >
                                                <source src={moment.video} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        </div>
                                        <div style={{
                                            position: "absolute",
                                            left: 4,
                                            top: 4,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 8,
                                            zIndex: 2
                                        }}>
                                            <button
                                                style={{
                                                    padding: "2px 6px",
                                                    backgroundColor: limitReached[moment.id] ? "#FF3870" : "#3870FF",
                                                    color: "#fff",
                                                    border: "none",
                                                    borderRadius: 4,
                                                    cursor: limitReached[moment.id] ? "not-allowed" : "pointer",
                                                    fontSize: "0.8em",
                                                    transform: `scale(${animatingKudos[moment.id] ? 0.95 : 1}) rotate(${(clickIntensity[moment.id] || 0) * 2}deg)`,
                                                    transition: 'all 0.15s cubic-bezier(0.17, 0.67, 0.83, 0.67)',
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                                    animation: animatingKudos[moment.id] ? 'colorPulse 0.6s ease-in-out, glowPulse 0.6s ease-in-out' : 'none',
                                                    filter: `brightness(${1 + ((clickIntensity[moment.id] || 0) * 0.1)})`,
                                                    opacity: limitReached[moment.id] ? 0.8 : 1,
                                                    ':active': {
                                                        transform: 'scale(0.95)'
                                                    }
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleKudos(moment.id);
                                                }}
                                            >
                                                {limitReached[moment.id] ? "max kudos!" : "give kudos"}
                                            </button>
                                            <span style={{
                                                backgroundColor: limitReached[moment.id] ? "rgba(255,56,112,0.5)" : "rgba(0,0,0,0.5)",
                                                color: "#fff",
                                                padding: "2px 6px",
                                                borderRadius: 4,
                                                fontSize: "0.8em",
                                                cursor: limitReached[moment.id] ? "not-allowed" : "pointer",
                                                transform: `scale(${animatingKudos[moment.id] ? 1.2 : 1}) rotate(${-(clickIntensity[moment.id] || 0) * 3}deg)`,
                                                transition: 'all 0.15s cubic-bezier(0.17, 0.67, 0.83, 0.67)',
                                                userSelect: 'none',
                                                fontWeight: 'bold',
                                                textShadow: animatingKudos[moment.id] ? `0 0 ${12 + (clickIntensity[moment.id] || 0) * 2}px rgba(255,255,255,0.8)` : 'none',
                                                animation: animatingKudos[moment.id] ? 'numberPop 0.6s ease-in-out' : 'none',
                                                backdropFilter: animatingKudos[moment.id] ? `hue-rotate(${90 + (clickIntensity[moment.id] || 0) * 30}deg) brightness(${1.5 + (clickIntensity[moment.id] || 0) * 0.1})` : 'none'
                                            }} onClick={(e) => {
                                                e.stopPropagation();
                                                handleKudos(moment.id);
                                            }}>
                                                {kudosCounts[moment.id] || 0}
                                            </span>
                                        </div>
                                        <div style={{
                                            fontSize: "0.9em",
                                            color: "#666",
                                            padding: "0 4px",
                                            height: "90px",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-between"
                                        }}>
                                            <div style={{ 
                                                height: "60px",
                                                overflowY: "auto",
                                                marginBottom: 4
                                            }}>
                                                <p style={{ 
                                                    margin: "4px 0",
                                                    fontSize: 14,
                                                    lineHeight: "1.2em"
                                                }}>{moment.description}</p>
                                            </div>
                                            <p style={{ 
                                                margin: "4px 0", 
                                                fontSize: "0.8em",
                                                flexShrink: 0
                                            }}>
                                                {new Date(moment.created_at).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
} 
