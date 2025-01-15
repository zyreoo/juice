import React from 'react';

export default function VideoWindow({ position, isDragging, isActive, handleMouseDown, handleDismiss, handleWindowClick, BASE_Z_INDEX, ACTIVE_Z_INDEX }) {
    return (
        <div 
            onClick={handleWindowClick('video')}
            style={{
                display: "flex", 
                position: "absolute", 
                zIndex: isActive ? ACTIVE_Z_INDEX : BASE_Z_INDEX, 
                width: 640,
                height: 397,
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
                onMouseDown={handleMouseDown('video')}
                style={{display: "flex", borderBottom: "1px solid #000", padding: 8, flexDirection: "row", justifyContent: "space-between", cursor: isDragging ? 'grabbing' : 'grab'}}>
                <div style={{display: "flex", flexDirection: "row", gap: 8}}>
                    <button onClick={(e) => { e.stopPropagation(); handleDismiss('video'); }}>x</button>
                </div>
                <p>juice.mp4</p>
                <div></div>
            </div>
            <div style={{flex: 1, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#000"}}>
                <video 
                    autoPlay 
                    controls
                    style={{width: "100%", height: "100%", objectFit: "contain"}}
                >
                    <source src="./juice.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
    );
} 