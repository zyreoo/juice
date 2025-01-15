import React from 'react';

export default function FileIcon({ icon, text, isSelected, onClick }) {
    return (
        <div 
            onClick={onClick}
            style={{
                display: "flex", 
                alignItems: "center", 
                flexDirection: "column",
                cursor: "pointer",
                userSelect: "none",
                WebkitUserSelect: "none",
                msUserSelect: "none"
            }}
        >
            <div style={{
                height: 64, 
                width: 64, 
                borderRadius: 8, 
                backgroundColor: isSelected ? "#e0e0e0" : (icon ? 'transparent' : "#000"),
                backgroundImage: icon ? `url(${icon})` : 'none',
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                userSelect: "none",
                WebkitUserSelect: "none",
                msUserSelect: "none"
            }}></div>
            <p style={{
                fontSize: 10, 
                padding: "2px 6px",
                textAlign: "center",
                backgroundColor: isSelected ? "#007AFF" : "transparent",
                color: isSelected ? "white" : "black",
                borderRadius: 4,
                margin: "4px 0",
                userSelect: "none",
                WebkitUserSelect: "none",
                msUserSelect: "none"
            }}>{text}</p>
        </div>
    );
} 