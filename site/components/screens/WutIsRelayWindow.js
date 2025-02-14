import React, { useRef } from 'react';

export default function WutIsJungleWindow({ position, isDragging, isActive, handleMouseDown, handleDismiss, handleWindowClick, BASE_Z_INDEX, ACTIVE_Z_INDEX }) {
    const contentRef = useRef(null);

    const handleRegisterClick = (e) => {
        if (e.target.classList.contains('register-link')) {
            e.preventDefault();
            e.stopPropagation();
            const registerButton = document.querySelector('button[data-register-button="true"]');
            if (registerButton) {
                registerButton.click();
            }
        }
    };

    const handleRelayClick = () => {
        const now = new Date();
        const startTime = new Date();
        startTime.setUTCHours(21, 0, 0, 0); // 9 PM GMT

        // If current time is after 9 PM GMT, use the live link
        const relayLink = now >= startTime ? 
            'https://hackclub.zoom.us/j/85023610589' : 
            'YOUR_RSVP_LINK';

        window.open(relayLink, '_blank');
    };

    return (
        <div style={{
            transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
            top: "50%",
            left: "50%",
            position: "absolute", 
            zIndex: isActive ? ACTIVE_Z_INDEX : BASE_Z_INDEX, 
        }}>
            <div 
                onClick={handleWindowClick('wutIsJungle')}
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
                    }}>
                    <div style={{display: "flex", flexDirection: "row", gap: 8}}>
                        <button onClick={(e) => { e.stopPropagation(); handleDismiss('wutIsRelay'); }}>x</button>
                    </div>
                    <p>wutIsRelay.txt</p>
                    <div></div>
                </div>
                <div 
                    ref={contentRef}
                    contentEditable
                    suppressContentEditableWarning
                    onClick={(e) => {
                        e.stopPropagation();
                        handleRegisterClick(e);
                        
                        // Handle regular links
                        const clickedElement = e.target;
                        if (clickedElement.tagName === 'A' && !clickedElement.classList.contains('register-link')) {
                            e.preventDefault();
                            window.open(clickedElement.href, '_blank');
                        }
                    }}
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
                        <p>Yo, <a href="https://hackclub.slack.com/team/U07TYDHRQHM">Talen</a> here!</p>
                        <p>Have a demo but not sure how to show it to people? Want to get feedback on your game? Want to have a good time and play some games?</p>
                        <p>The relay is a way for all of us to improve our games, have a good time, and play each other's games!</p>
                        <p>In the relay we'll have a Sprinting period (1 hour), where we'll be each developing our games and asking for any help we need in the relay zoom call.</p>
                        <p>After the sprinting period, there'll also be a refuel period (~ 15 minutes), where we'll be playing each other's games and giving feedback.</p>
                        <p>Oh also, did I mention that it's on for <b style={{ animation: 'steamGrantFlash 1s infinite'}}>24 HOURS</b>? That's right, you can join the relay at any time and stay as long as you want and I'll even be there the whole time!</p>
                        <p>If you want to join, just click the button below and we'll see you there!</p>
                        
                        <button 
                            onClick={handleRelayClick}
                            style={{
                                padding: 0,
                                backgroundColor: 'transparent',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                alignSelf: 'center',
                                marginTop: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <img 
                                src="./joinButton.png" 
                                alt="relay icon" 
                                style={{
                                    width: '64px',
                                    height: '32px',
                                    imageRendering: 'pixelated'
                                }}
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 