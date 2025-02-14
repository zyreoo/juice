import React, { useRef } from 'react';

export default function WutIsRelayWindow({ position, isDragging, isActive, handleMouseDown, handleDismiss, handleWindowClick, BASE_Z_INDEX, ACTIVE_Z_INDEX }) {
    const contentRef = useRef(null);

    const isRelayTime = () => {
        const now = new Date();
        const relayTime = new Date('2025-02-14T13:00:00.000Z'); // 9 PM GMT on Feb 14th, 2025
        return now.getTime() >= relayTime.getTime();
    };

    return (
        <div 
            style={{
                transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
                top: "50%",
                left: "50%",
                position: "absolute", 
                zIndex: isActive ? ACTIVE_Z_INDEX : BASE_Z_INDEX,
            }}
        >
            <div 
                onClick={handleWindowClick('wutIsRelay')}
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
                }}
            >
                <div 
                    onMouseDown={handleMouseDown('wutIsRelay')}
                    style={{
                        display: "flex", 
                        borderBottom: "1px solid #00000020", 
                        padding: 8, 
                        flexDirection: "row", 
                        justifyContent: "space-between", 
                        cursor: isDragging ? 'grabbing' : 'grab',
                        backgroundColor: '#f6e7ba',
                        borderTopLeftRadius: 4,
                        borderTopRightRadius: 4
                    }}
                >
                    <div style={{display: "flex", flexDirection: "row", gap: 8}}>
                        <button onClick={(e) => { e.stopPropagation(); handleDismiss('wutIsRelay'); }}>x</button>
                    </div>
                    <p>wutIsRelay.txt</p>
                    <div></div>
                </div>

                <div 
                    ref={contentRef}
                    style={{
                        flex: 1,
                        padding: 16,
                        outline: 'none',
                        overflowY: 'auto',
                        cursor: 'text',
                        userSelect: 'text'
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <p>Yo, <a href="https://hackclub.slack.com/team/U07TYDHRQHM" target="_blank" rel="noopener noreferrer">Talen</a> here!</p>
                        <p>Have a demo but not sure how to show it to people? Want to get feedback on your game? Want to have a good time and play some games?</p>
                        <p>The relay is a way for all of us to improve our games, have a good time, and play each other's games!</p>
                        <p>In the relay we'll have a Sprinting period (1 hour), where we'll be each developing our games and asking for any help we need in the relay zoom call.</p>
                        <p>After the sprinting period, there's a refuel period (~ 15 minutes), where we'll be playing each other's games and giving feedback.</p>
                        <p><b style={{ animation: 'steamGrantFlash 1s infinite'}}>Oh, and did I mention that it's on for 24 HOURS?</b> That's right, you can join the relay at any time and stay as long as you want and I'll even be there the whole time!</p>
                        
                        {isRelayTime() === true && (
                            <a 
                                href="https://hackclub.zoom.us/j/85023610589"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    alignSelf: 'center',
                                    marginTop: '8px',
                                    textDecoration: 'none'
                                }}
                            >
                                <img 
                                    src="/JoinButton.png" 
                                    alt="relay icon" 
                                    style={{
                                        width: '140px',
                                        height: '64px',
                                        imageRendering: 'pixelated'
                                    }}
                                />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 