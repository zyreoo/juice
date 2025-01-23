import React, { useState, useEffect } from 'react';

export default function KudosWindow({ position, isDragging, isActive, handleMouseDown, handleDismiss, handleWindowClick, BASE_Z_INDEX, ACTIVE_Z_INDEX }) {
    const [moments, setMoments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMoments = async () => {
            try {
                const response = await fetch('/api/get-omg-moments');
                if (!response.ok) {
                    throw new Error('Failed to fetch moments');
                }
                const data = await response.json();
                setMoments(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMoments();
    }, []);

    return (
        <div 
            onClick={handleWindowClick('kudos')}
            style={{
                display: "flex", 
                position: "absolute", 
                zIndex: isActive ? ACTIVE_Z_INDEX : BASE_Z_INDEX, 
                width: 650,
                color: 'black',
                height: 470,
                backgroundColor: "#fff", 
                border: "1px solid #000", 
                borderRadius: 4,
                flexDirection: "column",
                padding: 0,
                transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
                top: "50%",
                left: "50%",
                userSelect: "none"
            }}>
            <div 
                onMouseDown={handleMouseDown('kudos')}
                style={{display: "flex", borderBottom: "1px solid #000", padding: 8, flexDirection: "row", justifyContent: "space-between", cursor: isDragging ? 'grabbing' : 'grab'}}>
                <div style={{display: "flex", flexDirection: "row", gap: 8}}>
                    <button onClick={(e) => { e.stopPropagation(); handleDismiss('kudos'); }}>x</button>
                </div>
                <p>Kudos</p>
                <div></div>
            </div>
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                padding: 16,
                height: "calc(100% - 37px)", // Account for header height
                overflow: "auto"
            }}>
                <h2 style={{ margin: 0 }}>"OMG IT WORKS MOMENTS" from Today</h2>
                
                {loading && <p>Loading moments...</p>}
                {error && <p style={{ color: 'red' }}>Error: {error}</p>}
                
                {!loading && !error && (
                    moments.length === 0 ? (
                        <p>No moments recorded today yet!</p>
                    ) : (
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: 16,
                            width: "100%"
                        }}>
                            {moments.map(moment => (
                                <div key={moment.id} style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 8,
                                    position: "relative"
                                }}>
                                    <video 
                                        onMouseEnter={e => e.target.play()}
                                        onMouseLeave={e => {
                                            e.target.pause();
                                            e.target.currentTime = 0;
                                        }}
                                        style={{
                                            width: "100%",
                                            borderRadius: 4,
                                            backgroundColor: "#000"
                                        }}
                                    >
                                        <source src={moment.video} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                    <button
                                        style={{
                                            position: "absolute",
                                            left: 4,
                                            top: 4,
                                            padding: "2px 6px",
                                            backgroundColor: "#3870FF",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: 4,
                                            cursor: "pointer",
                                            fontSize: "0.8em",
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // TODO: Implement kudos functionality
                                            console.log("Give kudos for moment:", moment.id);
                                        }}
                                    >
                                        give kudos
                                    </button>
                                    <div style={{
                                        fontSize: "0.9em",
                                        color: "#666"
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
                                            {new Date(moment.createdAt).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
} 
