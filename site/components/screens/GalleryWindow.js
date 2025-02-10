import React, { useState, useEffect } from 'react';

export default function GalleryWindow({ position, isDragging, isActive, handleMouseDown, handleDismiss, handleWindowClick, BASE_Z_INDEX, ACTIVE_Z_INDEX }) {
    const [moments, setMoments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [kudosCounts, setKudosCounts] = useState({});
    const [animatingKudos, setAnimatingKudos] = useState({});
    const [clickIntensity, setClickIntensity] = useState({});
    const [limitReached, setLimitReached] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const momentsPerPage = 9;

    useEffect(() => {
        const fetchMoments = async () => {
            try {
                const response = await fetch('/api/get-gallery');
                if (!response.ok) {
                    throw new Error('Failed to fetch gallery');
                }
                const data = await response.json();
                setMoments(data);
                
                const initialKudos = {};
                const initialLimitReached = {};
                data.forEach(moment => {
                    initialKudos[moment.id] = moment.kudos;
                    initialLimitReached[moment.id] = moment.kudos >= 100;
                });
            } catch (err) {
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

    // Calculate pagination values
    const indexOfLastMoment = currentPage * momentsPerPage;
    const indexOfFirstMoment = indexOfLastMoment - momentsPerPage;
    const currentMoments = moments.slice(indexOfFirstMoment, indexOfLastMoment);
    const totalPages = Math.ceil(moments.length / momentsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
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
                onClick={handleWindowClick('Gallery')}
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
                    onMouseDown={handleMouseDown('Gallery')}
                    style={{display: "flex", borderBottom: "1px solid #000", padding: 8, flexDirection: "row", justifyContent: "space-between", cursor: isDragging ? 'grabbing' : 'grab'}}>
                    <div style={{display: "flex", flexDirection: "row", gap: 8}}>
                        <button onClick={(e) => { e.stopPropagation(); handleDismiss('Gallery'); }}>x</button>
                    </div>
                    <p>Gallery</p>
                    <div></div>
                </div>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                    padding: 16,
                    height: "calc(100% - 37px)", // Account for header height
                    overflow: "auto",
                }}>
                    <h2 style={{ margin: 0 }}>Games made by fellow hackclubbers:</h2>
                    
                    {loading && <p>Loading moments...</p>}
                    {error && <p style={{ color: 'red' }}>Error: {error}</p>}
                    
                    {!loading && !error && (
                        moments.length === 0 ? (
                            <p>No games shared yet! Be the first, I dare u ;)</p>
                        ) : (
                            <>
                                <div style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(3, 1fr)",
                                    gap: 16,
                                    width: "100%"
                                }}>
                                    {currentMoments.map(moment => (
                                       
                                        <div key={moment.id} style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 8,
                                            position: "relative"
                                        }}>
                                             <a href={moment.itchurl}>
                                            <img src={moment.thumbnail}
                                             
                                                style={{
                                                    width: "100%",
                                                    borderRadius: 4,
                                                    backgroundColor: "#000"
                                                }}
                                            >
                                             
                                                
                                            </img>
                                        
                                            <div style={{
                                                fontSize: "0.9em",
                                           
                                            }}>
                                                <div style={{ 
                                                    maxHeight: "3.6em", // approximately 3 lines (1.2em per line)
                                                    overflowY: "auto",
                                                    marginBottom: 4
                                                }}>
                                                    <p style={{ 
                                                        margin: "4px 0", 
                                                        fontSize: 14,
                                                        lineHeight: "1.2em"
                                                    }}>{moment.description}</p>
                                                </div>
                                                <p style={{ margin: "4px 0", fontSize: "0.8em" }}>
                                                    {moment.gamename}
                                                </p>
                                                
                                            </div>
                                            </a>
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        gap: 8,
                                        marginTop: 16
                                    }}>
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            style={{
                                                padding: "4px 8px",
                                                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                                                opacity: currentPage === 1 ? 0.5 : 1
                                            }}
                                        >
                                            ←
                                        </button>
                                        
                                        {[...Array(totalPages)].map((_, index) => (
                                            <button
                                                key={index + 1}
                                                onClick={() => handlePageChange(index + 1)}
                                                style={{
                                                    padding: "4px 8px",
                                                    backgroundColor: currentPage === index + 1 ? "#3870FF" : "white",
                                                    color: currentPage === index + 1 ? "white" : "black",
                                                    border: "1px solid #3870FF",
                                                    borderRadius: 4,
                                                    cursor: "pointer"
                                                }}
                                            >
                                                {index + 1}
                                            </button>
                                        ))}
                                        
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            style={{
                                                padding: "4px 8px",
                                                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                                                opacity: currentPage === totalPages ? 0.5 : 1
                                            }}
                                        >
                                            →
                                        </button>
                                    </div>
                                )}
                            </>
                        )
                    )}
                </div>
            </div>
        </div>
    );
} 
