import React, { useState, useEffect } from 'react';

export default function GalleryWindow({ position, isDragging, isActive, handleMouseDown, handleDismiss, handleWindowClick, BASE_Z_INDEX, ACTIVE_Z_INDEX }) {
    const [moments, setMoments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const momentsPerPage = 9;

    useEffect(() => {
        // // Check sessionStorage for cached moments
        // const cachedMoments = sessionStorage.getItem('cachedGallery');

        // if (cachedMoments) {
        //     setMoments(JSON.parse(cachedMoments));
        //     setLoading(false);
        // } else {
            const fetchMoments = async () => {
                try {
                    const response = await fetch('/api/get-gallery');
                    if (!response.ok) {
                        throw new Error('Failed to fetch gallery');
                    }
                    const data = await response.json();
                    
                    // Store fetched moments in cache
                    // sessionStorage.setItem('cachedGallery', JSON.stringify(data));
                    setMoments(data);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchMoments();
    }, []);

    // Calculate pagination
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
                    height: 470,
                    backgroundColor: "#fff", 
                    border: "1px solid #000", 
                    borderRadius: 4,
                    flexDirection: "column",
                    padding: 0,
                    userSelect: "none",
                    animation: "linear .3s windowShakeAndScale"
                }}>
                
                <div 
                    onMouseDown={handleMouseDown('Gallery')}
                    style={{
                        display: "flex", 
                        borderBottom: "1px solid #000", 
                        padding: 8, 
                        justifyContent: "space-between", 
                        cursor: isDragging ? 'grabbing' : 'grab'
                    }}>
                    <button onClick={(e) => { e.stopPropagation(); handleDismiss('Gallery'); }}>x</button>
                    <p>Gallery</p>
                    <div></div>
                </div>

                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                    padding: 16,
                    height: "calc(100% - 37px)", 
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
                                                />
                                                <div style={{
                                                    fontSize: "0.9em",
                                                }}>
                                                    <p style={{ 
                                                        margin: "4px 0", 
                                                        fontSize: 14,
                                                        lineHeight: "1.2em"
                                                    }}>{moment.description}</p>
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
