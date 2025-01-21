import React from 'react';

export default function FirstChallengeWindow({ position, isDragging, isActive, handleMouseDown, handleDismiss, handleWindowClick, BASE_Z_INDEX, ACTIVE_Z_INDEX }) {
    return (
        <div 
            onClick={handleWindowClick('firstChallenge')}
            style={{
                display: "flex", 
                position: "absolute", 
                zIndex: isActive ? ACTIVE_Z_INDEX : BASE_Z_INDEX, 
                width: 500,
                color: 'black',
                height: 300,
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
                onMouseDown={handleMouseDown('firstChallenge')}
                style={{display: "flex", borderBottom: "1px solid #000", padding: 8, flexDirection: "row", justifyContent: "space-between", cursor: isDragging ? 'grabbing' : 'grab'}}>
                <div style={{display: "flex", flexDirection: "row", gap: 8}}>
                    <button onClick={(e) => { e.stopPropagation(); handleDismiss('firstChallenge'); }}>x</button>
                </div>
                <p>FirstChallenge.txt</p>
                <div></div>
            </div>
            <div style={{display: "flex", flexDirection: "column", gap: 12, padding: 16}}>
                <p>Your first challenge, should you choose to accept it, is to come up with your idea & add it to Juice repo games folder.</p>
                <ol>
                    <li>write your idea in a markdown file <a href="https://github.com/SerenityUX/juice/blob/main/games/template/README.md">(template)</a></li>
                    <li>open a PR to the <a href="https://github.com/SerenityUX/juice">Juice repo</a> & add your idea <a href="https://github.com/SerenityUX/juice/blob/main/games/README.md">(guide)</a></li>
                </ol>
                <p>Here's <a href="">the markdown file that Paolo & I made for our game</a>.</p>
                <div>
                <p>~Thomas</p>
                <i>In life we are always learning</i>
                </div>
                <div style={{display: "flex", width: "100%", backgroundColor: "#000", height: 1}}></div>
                <div style={{display: "flex", flexDirection: "row", gap: 8}}>
                    <input placeholder="link to your team's pr" style={{width: 250}} />
                    <button style={{width: 150}}>complete challenge</button>
                </div>
                <p></p>
            </div>
        </div>
    );
} 