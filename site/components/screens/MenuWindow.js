import React, { useState, useEffect } from "react";

export default function MenuWindow({
  position,
  isDragging,
  isActive,
  handleMouseDown,
  handleDismiss,
  handleWindowClick,
  BASE_Z_INDEX,
  ACTIVE_Z_INDEX,
  userData,
}) {
  const [moments, setMoments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Variables to hold calculated total hours for each status
  const [totalHours, setTotalHours] = useState(0);
  const [pendingHours, setPendingHours] = useState(0);
  const [approvedHours, setApprovedHours] = useState(0);
  const [rejectedHours, setRejectedHours] = useState(0);

  useEffect(() => {
    const fetchMoments = async () => {
      const userEmail = "irtazanaqvi05@gmail.com";
      try {
        const response = await fetch(
          `/api/get-user-omg-moments?email=${encodeURIComponent(userEmail)}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch moments");
        }
        const data = await response.json();
        setMoments(data);

        // Calculate hours for each status after data is fetched
        let total = 0;
        let pending = 0;
        let approved = 0;
        let rejected = 0;

        data.forEach((moment) => {
          total += moment.timeHr;

          if (moment.status === "Pending") {
            pending += moment.timeHr;
          } else if (moment.status === "Approved") {
            approved += moment.timeHr;
          } else if (moment.status === "Rejected") {
            rejected += moment.timeHr;
          }
        });

        setTotalHours(total);
        setPendingHours(pending);
        setApprovedHours(approved);
        setRejectedHours(rejected);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMoments();
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
        top: "50%",
        left: "50%",
        zIndex: isActive ? ACTIVE_Z_INDEX : BASE_Z_INDEX,
      }}
    >
      <div
        onClick={handleWindowClick("menu")}
        style={{
          display: "flex",
          width: 650,
          color: "black",
          height: 470,
          backgroundColor: "#fff",
          border: "1px solid #000",
          borderRadius: 4,
          flexDirection: "column",
          padding: 0,
          userSelect: "none",
          animation: "linear .3s windowShakeAndScale",
        }}
      >
        <div
          onMouseDown={handleMouseDown("menu")}
          style={{
            display: "flex",
            borderBottom: "1px solid #000",
            padding: 8,
            flexDirection: "row",
            justifyContent: "space-between",
            cursor: isDragging ? "grabbing" : "grab",
          }}
        >
          <div style={{ display: "flex", flexDirection: "row", gap: 8 }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDismiss("menu");
              }}
            >
              x
            </button>
          </div>
          <p>Menu</p>
          <div></div>
        </div>

        {/* Displaying the Hours Summary */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            padding: "16px 0",
            backgroundColor: "#f2f2f2",
            borderBottom: "1px solid #ddd",
          }}
        >
          <div>Total Hours: {totalHours} hrs</div>
          <div>Pending Hours: {pendingHours} hrs</div>
          <div>Approved Hours: {approvedHours} hrs</div>
          <div>Rejected Hours: {rejectedHours} hrs</div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            padding: 16,
            height: "calc(100% - 70px)", // Account for header and summary height
            overflow: "auto",
          }}
        >
          <h2 style={{ margin: 0 }}>SuperJuice!</h2>

          {loading && <p>Loading moments...</p>}
          {error && <p style={{ color: "red" }}>Error: {error}</p>}

          {!loading &&
            !error &&
            (moments.length === 0 ? (
              <p>You haven't submitted any demos yet!</p>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 16,
                  width: "100%",
                }}
              >
                {moments.map((moment) => (
                  <div
                    key={moment.id}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      position: "relative",
                    }}
                  >
                    <video
                      onMouseEnter={(e) => e.target.play()}
                      onMouseLeave={(e) => {
                        e.target.pause();
                        e.target.currentTime = 0;
                      }}
                      style={{
                        width: "100%",
                        borderRadius: 4,
                        backgroundColor: "#000",
                      }}
                    >
                      <source src={moment.video} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>

                    <div
                      style={{
                        fontSize: "0.9em",
                        color: "#666",
                      }}
                    >
                      <div
                        style={{
                          maxHeight: "3.6em", // approximately 3 lines (1.2em per line)
                          overflowY: "auto",
                          marginBottom: 4,
                        }}
                      >
                        <p
                          style={{
                            margin: "4px 0",
                            fontSize: 14,
                            lineHeight: "1.2em",
                          }}
                        >
                          {moment.description}
                        </p>
                      </div>
                      <p style={{ margin: "4px 0", fontSize: "0.8em" }}>
                        {new Date(moment.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
