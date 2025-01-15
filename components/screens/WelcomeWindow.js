import React from 'react';

export default function WelcomeWindow({ position, isDragging, isActive, handleMouseDown, handleDismiss, handleWindowClick, BASE_Z_INDEX, ACTIVE_Z_INDEX }) {
    return (
        <div 
            onClick={handleWindowClick('welcomeWindow')}
            style={{
                display: "flex", 
                position: "absolute", 
                zIndex: isActive ? ACTIVE_Z_INDEX : BASE_Z_INDEX, 
                width: 400,
                height: 160,
                backgroundColor: "#fff", 
                border: "1px solid #000", 
                borderRadius: 4,
                flexDirection: "column",
                padding: 16,
                justifyContent: "space-between",
                transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
                top: "50%",
                left: "50%",
                userSelect: "none"
            }}>
            <div 
                onMouseDown={handleMouseDown('welcomeWindow')}
                style={{
                    margin: -16,
                    marginBottom: 0,
                    padding: 16,
                    paddingBottom: 0,
                    cursor: isDragging ? 'grabbing' : 'grab'
                }}>
                <p>Welcome to Juice</p>
            </div>
            <p>2 month online game jam followed by an in-person popup hacker cafe in Shanghai, China<br/> <i>(flight stipends available for game devs)</i></p>
            <div style={{display: "flex", flexDirection: "row", gap: 8}}>
                <button>Register</button>
                <button onClick={() => handleDismiss('welcomeWindow')}>Dismiss</button>
            </div>
        </div>
    );
} 