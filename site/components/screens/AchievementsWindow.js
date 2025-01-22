import React, { useEffect } from 'react';
import Image from 'next/image';

export default function AchievementsWindow({ position, isDragging, isActive, handleMouseDown, handleDismiss, handleWindowClick, selectedRank, setSelectedRank, BASE_Z_INDEX, ACTIVE_Z_INDEX, userData }) {
    const hasPRSubmitted = userData?.achievements?.includes('pr_submitted');

    useEffect(() => {
        if (hasPRSubmitted) {
            setSelectedRank(2);
        } else {
            setSelectedRank(1);
        }
    }, [hasPRSubmitted, setSelectedRank]);

    return (
        <div 
            onClick={handleWindowClick('achievements')}
            style={{
                display: "flex", 
                position: "absolute", 
                zIndex: isActive ? ACTIVE_Z_INDEX : BASE_Z_INDEX, 
                width: 520,
                height: 320,
                backgroundColor: "#fff", 
                border: "1px solid #000", 
                borderRadius: 4,
                flexDirection: "column",
                padding: 0,
                color: 'black',
                justifyContent: "space-between",
                transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
                top: "50%",
                left: "50%",
                userSelect: "none"
            }}>
            <div 
                onMouseDown={handleMouseDown('achievements')}
                style={{display: "flex", borderBottom: "1px solid #000", padding: 8, flexDirection: "row", justifyContent: "space-between", cursor: isDragging ? 'grabbing' : 'grab'}}>
                <div style={{display: "flex", flexDirection: "row", gap: 8}}>
                    <button onClick={(e) => { e.stopPropagation(); handleDismiss('achievements'); }}>x</button>
                </div>
                
                <p>ACHIEVEMENTS</p>
                <div></div> 
            </div>
            <div style={{flex: 1, overflowY: 'auto', display: "flex"}}>
                <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 8, width: "100%", cursor: "default"}}>
                    <div>
                    </div>
                    <div>
                    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                        <p>Challenge Progress</p>
                        <p>{selectedRank === 2 ? 
                            `${userData?.totalStretchHours?.toFixed(2) || "0.00"}/15` : 
                            (hasPRSubmitted ? "1/1" : "0/1")}</p>
                    </div>
                    <div style={{width: "100%", backgroundColor: "#000", height: 1, marginTop: 4, marginBottom: 4}}>
                    </div>
                    {selectedRank === 2 ? (
                        <p>Spend 15+ hours building your proof of concept and then <a target="_blank" href="https://hackclub.slack.com/archives/C0M8PUPU6">#ship</a> it</p>
                    ) : (
                        <p>Add your game idea to the<br/> <a target="_blank" href="https://github.com/SerenityUX/juice">Juice repo</a>, here's <a target="_blank" href="https://github.com/">a guide</a></p>
                    )}
                    </div>
                </div>
                <div style={{borderLeft: "1px solid #000", width: "100%", display: "flex", flexDirection: "column", height: "100%", padding: "2px", gap: "2px"}}>
                    <div 
                        onClick={() => setSelectedRank(1)}
                        style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            padding: "0 12px",
                            border: selectedRank === 1 ? "1px solid #000" : "none",
                            borderRadius: 2,
                            backgroundColor: "transparent",
                            cursor: "pointer"
                        }}>
                        <div style={{display: "flex", alignItems: "center", gap: 8}}>
                            <p>Rank 1</p>
                        </div>
                        <p>Gather your team and PR the idea for your game</p>
                    </div>
                    <div 
                        onClick={() => hasPRSubmitted && setSelectedRank(2)}
                        style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            padding: "0 12px",
                            border: selectedRank === 2 ? "1px solid #000" : "none",
                            borderRadius: 2,
                            backgroundColor: "transparent",
                            opacity: hasPRSubmitted ? 1 : 0.5,
                            cursor: hasPRSubmitted ? "pointer" : "default"
                        }}>
                        <div style={{display: "flex", alignItems: "center", gap: 8}}>
                            <p>Rank 2</p>
                            {!hasPRSubmitted && <Image src="/lock.svg" width={16} height={16} alt="locked" />}
                        </div>
                        <p>Make a proof of concept with no art just the core gameplay loop</p>
                    </div>
                    <div 
                        style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            padding: "0 12px",
                            border: "none",
                            borderRadius: 2,
                            backgroundColor: "transparent",
                            opacity: 0.5,
                            cursor: "default"
                        }}>
                        <div style={{display: "flex", alignItems: "center", gap: 8}}>
                            <p>Rank 3</p>
                            <Image src="/lock.svg" width={16} height={16} alt="locked" />
                        </div>
                        <p>Take a vertical slice of your game and make it great</p>
                    </div>
                    <div 
                        style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            padding: "0 12px",
                            border: "none",
                            borderRadius: 2,
                            backgroundColor: "transparent",
                            opacity: 0.5,
                            cursor: "default"
                        }}>
                        <div style={{display: "flex", alignItems: "center", gap: 8}}>
                            <p>Rank 4</p>
                            <Image src="/lock.svg" width={16} height={16} alt="locked" />
                        </div>
                        <p>Build the game</p>
                    </div>
                    <div 
                        style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            padding: "0 12px",
                            border: "none",
                            borderRadius: 2,
                            backgroundColor: "transparent",
                            opacity: 0.5,
                            cursor: "default"
                        }}>
                        <div style={{display: "flex", alignItems: "center", gap: 8}}>
                            <p>Rank 5</p>
                            <Image src="/lock.svg" width={16} height={16} alt="locked" />
                        </div>
                        <p>Ship to Steam Store & make Juice Cafe in Shanghai</p>
                    </div>
                </div>
            </div>
        </div>
    );
} 