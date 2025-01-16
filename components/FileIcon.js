import React from 'react';

export default function FileIcon({ text, icon, isSelected, onClick }) {
    return (
        <div 
            onClick={onClick}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                padding: 8,
                cursor: 'pointer',
                margin: '4px 0',
                width: 90
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
                    borderRadius: 4
                }}
            />
            <div style={{
                backgroundColor: isSelected ? 'rgba(66, 133, 244, 0.9)' : 'transparent',
                borderRadius: 4,
                padding: '2px 8px'
            }}>
                <p style={{
                    margin: 0,
                    fontSize: 12,
                    textAlign: 'center',
                    color: '#ffffff',
                    textShadow: isSelected ? 'none' : `
                        -1px -1px 0 rgba(0,0,0,1),  
                        1px -1px 0 rgba(0,0,0,1),
                        -1px 1px 0 rgba(0,0,0,1),
                        1px 1px 0 rgba(0,0,0,1),
                        0 1px 3px rgba(0,0,0,0.9)
                    `,
                    maxWidth: '100%',
                    fontWeight: 600,
                    letterSpacing: '0.2px'
                }}>
                    {text}
                </p>
            </div>
        </div>
    );
} 