import React from 'react';

export default function WelcomeWindow({ position, isDragging, isActive, handleMouseDown, handleDismiss, handleWindowClick, BASE_Z_INDEX, ACTIVE_Z_INDEX }) {
    const handleRegisterClick = (e) => {
        e.stopPropagation();
        // Find and click the register button in the top bar
        const registerButton = document.querySelector('button[data-register-button="true"]');
        if (registerButton) {
            registerButton.click();
        }
    };

    return (
        <div 
            onClick={handleWindowClick('welcomeWindow')}
            onMouseDown={handleMouseDown('welcomeWindow')}
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
                userSelect: "none",
                cursor: isDragging ? 'grabbing' : 'grab'
            }}>
            <div style={{
                margin: -16,
                marginBottom: 0,
                padding: 16,
                paddingBottom: 0,
                pointerEvents: 'none'
            }}>
                <p className="welcome-title">Welcome to Juice</p>
            </div>
            <p style={{ pointerEvents: 'none' }}>2 month online game jam followed by an in-person popup hacker cafe in Shanghai, China<br/> <i>(flight stipends available for game devs)</i></p>
            <div style={{display: "flex", flexDirection: "row", gap: 8, pointerEvents: 'auto'}}>
                <button onClick={handleRegisterClick}>Register</button>
                <button onClick={() => handleDismiss('welcomeWindow')}>Dismiss</button>
            </div>
        </div>
    );
} 