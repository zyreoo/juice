import React from 'react';

export default function FileIcon({ text, icon, isSelected, onClick, delay }) {
    return (
        <div 
            data-file-name={text}
            onClick={onClick}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                padding: 8,
                cursor: 'pointer',
                margin: '4px 0',
                width: 90,
                animation: `popIn 0.3s ease-out ${delay}s both`,
                opacity: 0
            }}
        >
            <div 
                style={{
                    width: 48,
                    height: 48,
                    backgroundColor: isSelected ? '#e8e8e8' : (icon ? 'transparent' : '#000'),
                    backgroundImage: icon ? `url(${icon})` : 'none',
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    borderRadius: 4,
                    filter: icon ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' : 'none'
                }}
            />
            <div style={{
                backgroundColor: isSelected ? 'rgba(66, 133, 244, 0.12)' : 'transparent',
                borderRadius: 4,
                padding: '2px 8px'
            }}>
                <p style={{
                    margin: 0,
                    fontSize: 12,
                    textAlign: 'center',
                    color: isSelected ? '#FFE600' : '#ffffff',
                    textShadow: `
                        -1px -1px 0 #000,
                        1px -1px 0 #000,
                        -1px 1px 0 #000,
                        1px 1px 0 #000,
                        -2px 0 0 #000,
                        2px 0 0 #000,
                        0 -2px 0 #000,
                        0 2px 0 #000`,
                    fontWeight: 600,
                    letterSpacing: '0.2px'
                }}>
                    {text}
                </p>
            </div>
            <style>{`
                @keyframes popIn {
                    0% {
                        transform: scale(0);
                        opacity: 0;
                    }
                    70% {
                        transform: scale(1.1);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
} 