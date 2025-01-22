import React from 'react';

const ticketShakeKeyframes = `
    @keyframes ticketShake {
        0% { transform: rotate(0deg) scale(1); }
        15% { transform: rotate(-0.5deg) scale(0.998); }
        30% { transform: rotate(0.8deg) scale(1.001); }
        45% { transform: rotate(-0.7deg) scale(0.999); }
        60% { transform: rotate(0.3deg) scale(1.002); }
        75% { transform: rotate(-0.5deg) scale(0.998); }
        85% { transform: rotate(0.4deg) scale(1.001); }
        100% { transform: rotate(0deg) scale(1); }
    }
`;

export default function FactionWindow({ position, isDragging, isActive, handleMouseDown, handleDismiss, handleWindowClick, BASE_Z_INDEX, ACTIVE_Z_INDEX, tickets, setTickets }) {
    const availableTickets = tickets.filter(t => !t.used).length;

    React.useEffect(() => {
        if (availableTickets === 0) {
            handleDismiss('faction');
        }
    }, [availableTickets]);

    const handleSendInvite = async (ticketId) => {
        const email = window.prompt("Enter friend's email address:");
        if (email) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/invite', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        invitedParticipantEmail: email,
                        flavor: ticketId
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    // Update tickets based on remaining invites from API
                    const remainingInvites = data.remainingInvites || [];
                    const allTickets = ['apple', 'carrot', 'berry'];
                    setTickets(allTickets.map(id => ({ 
                        id, 
                        used: !remainingInvites.includes(id)
                    })));
                } else {
                    const error = await response.json();
                    console.error('Failed to send invite:', error);
                    alert('Failed to send invite. Please try again.');
                }
            } catch (error) {
                console.error('Error sending invite:', error);
                alert('Error sending invite. Please try again.');
            }
        }
    };

    return (
        <>
            <style>{ticketShakeKeyframes}</style>
            <div 
                onClick={handleWindowClick('faction')}
                style={{
                    display: "flex", 
                    position: "absolute", 
                    zIndex: isActive ? ACTIVE_Z_INDEX : BASE_Z_INDEX, 
                    width: 400,
                    height: 200,
                    color: 'black',
                    overflow: "hidden",
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
                    onMouseDown={handleMouseDown('faction')}
                    style={{display: "flex", borderBottom: "1px solid #000", padding: 8, flexDirection: "row", justifyContent: "space-between", cursor: isDragging ? 'grabbing' : 'grab'}}>
                    <div style={{display: "flex", flexDirection: "row", gap: 8}}>
                        <button onClick={(e) => { e.stopPropagation(); handleDismiss('faction'); }}>x</button>
                    </div>
                    <p>Special Tickets</p>
                    <div></div>
                </div>
                <div style={{flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 12}}>
                    <p>ooo... you have {availableTickets} juice tickets to invite your friends to join you on this adventure</p>
                    <div style={{display: "flex", flexDirection: "row", gap: 16}}>
                        {tickets.map((ticket) => (
                            <div 
                                key={ticket.id}
                                style={{
                                    backgroundColor: "#000", 
                                    position: "relative", 
                                    height: 120, 
                                    width: 90, 
                                    display: "flex", 
                                    alignItems: "flex-end", 
                                    justifyContent: "center", 
                                    paddingBottom: 32,
                                    opacity: ticket.used ? 0.4 : 1,
                                    animation: ticket.used ? 'none' : 'ticketShake 1.2s linear infinite',
                                    transformOrigin: '50% 50%'
                                }}>
                                <div style={{
                                    position: 'absolute',
                                    top: 16,
                                    color: '#fff',
                                    fontSize: 12,
                                    textTransform: 'uppercase'
                                }}>
                                    {ticket.id}
                                </div>
                                <button 
                                    style={{fontSize: 16}}
                                    onClick={() => !ticket.used && handleSendInvite(ticket.id)}
                                >
                                    {ticket.used ? "Ticket Sent" : "Send Invite"}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
} 