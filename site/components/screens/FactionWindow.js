import React from 'react';
import appleTicket from '../../public/appleticket.png';
import orangeTicket from '../../public/orangeticket.png'; 
import lemonTicket from '../../public/lemonticket.png';
import kiwiTicket from '../../public/kiwiticket.png'; 
import blueberryTicket from '../../public/blueberryticket.png'; 
import grapeTicket from '../../public/grapeticket.png'; 

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

const allTickets = [
    { id: 'apple', used: false, image: appleTicket },
    { id: 'orange', used: false, image: orangeTicket },
    { id: 'lemon', used: false, image: lemonTicket },
    { id: 'kiwi', used: false, image: kiwiTicket },
    { id: 'blueberry', used: false, image: blueberryTicket },
    { id: 'grape', used: false, image: grapeTicket }
];

const getRandomTickets = (num) => {
    const shuffled = allTickets.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
};

export default function FactionWindow({ position, isDragging, isActive, handleMouseDown, handleDismiss, handleWindowClick, BASE_Z_INDEX, ACTIVE_Z_INDEX, tickets, setTickets }) {

    React.useEffect(() => {
        const initialTickets = getRandomTickets(3);
        setTickets(initialTickets);
    }, [setTickets]);

    const availableTickets = tickets.filter(t => !t.used).length;

    React.useEffect(() => {
        if (isActive && availableTickets === 0) {
            handleDismiss('faction');
        }
    }, [availableTickets, isActive]);

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
                    const allTickets = ['apple', 'orange', 'lemon', 'kiwi', 'blueberry', 'grape'];
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
                    height: 300,
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
                        {tickets.map((ticket) => {
                            console.log(`Ticket ID: ${ticket.id}, Image Path: ${ticket.image}`);
                            return (
                                <div 
                                    key={ticket.id}
                                    style={{
                                        backgroundColor: "#fff",
                                        position: "relative", 
                                        height: 120, 
                                        width: 90, 
                                        display: "flex", 
                                        flexDirection: "column", 
                                        alignItems: "center", 
                                        justifyContent: "flex-start", 
                                        paddingBottom: 8,
                                        opacity: ticket.used ? 0.4 : 1,
                                        animation: ticket.used ? 'none' : 'ticketShake 1.2s linear infinite',
                                        transformOrigin: '50% 50%'
                                    }}>
                                    <img 
                                        src={ticket.image.src} 
                                        alt={ticket.id} 
                                        style={{ 
                                            width: '100%', 
                                            height: 'auto', 
                                            imageRendering: 'pixelated' 
                                        }} 
                                    />
                                    <div style={{
                                        color: '#000',
                                        fontSize: 20,
                                        textTransform: 'uppercase',
                                        marginTop: 4
                                    }}>
                                        {ticket.id.charAt(0).toUpperCase() + ticket.id.slice(1)}
                                    </div>
                                    <button 
                                        style={{fontSize: 16}}
                                        onClick={() => !ticket.used && handleSendInvite(ticket.id)}
                                    >
                                        {ticket.used ? "Ticket Sent" : "Send Invite"}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
} 