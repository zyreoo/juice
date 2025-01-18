import React, { useEffect, useRef } from 'react';

export default function RegisterWindow({ position, isDragging, isActive, handleMouseDown, handleDismiss, handleWindowClick, BASE_Z_INDEX, ACTIVE_Z_INDEX }) {
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    return (
        <div 
            onClick={handleWindowClick('register')}
            style={{
                display: "flex", 
                position: "absolute", 
                zIndex: isActive ? ACTIVE_Z_INDEX : BASE_Z_INDEX, 
                width: 400,
                height: 200,
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
                onMouseDown={handleMouseDown('register')}
                style={{display: "flex", borderBottom: "1px solid #000", padding: 8, flexDirection: "row", justifyContent: "space-between", cursor: isDragging ? 'grabbing' : 'grab'}}>
                <div style={{display: "flex", flexDirection: "row", gap: 8}}>
                    <button onClick={(e) => { e.stopPropagation(); handleDismiss('register'); }}>x</button>
                </div>
                <p>Register</p>
                <div></div>
            </div>
            <div style={{flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 12}}>
                <p><i>Adventure Calls...</i> signing up means joining our team and committing to making your game.</p>
                <div style={{display: "flex", height: 24, flexDirection: "row", gap: 8}}>
                    <input 
                        ref={inputRef}
                        style={{height: 24, padding: "2px 4px"}} 
                        placeholder='marsha@mellow.yum'
                    />
                    <button style={{height: 24}}>signup</button>
                </div>
                <p>I will email you invites to our weekly calls, news about people's games, and juice updates.</p>
            </div>
        </div>
    );
} 