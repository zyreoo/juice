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
  setUserData,
}) {
  const [moments, setMoments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMoment, setSelectedMoment] = useState(null); // To handle popup

  // Variables to hold calculated total hours for each status
  const [totalHours, setTotalHours] = useState(0);
  const [pendingHours, setPendingHours] = useState(0);
  const [approvedHours, setApprovedHours] = useState(0);
  const [rejectedHours, setRejectedHours] = useState(0);

  useEffect(() => {
    const fetchMoments = async () => {
      const userEmail = userData?.email;
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

  const handleMomentClick = (moment) => {
    setSelectedMoment(moment); // Set the selected moment to show details
  };

  const closePopup = () => {
    setSelectedMoment(null); // Close the popup by resetting selected moment
  };

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

        <h2 style={{ margin: 0, textAlign: "center", padding: 10 }}>
          SuperJuice!
        </h2>
        <p style={{ margin: 0, textAlign: "center", padding: 10 }}>
          After completing the base 100 hours, each new accepted hour will get
          converted into 5$ for your stipend!
        </p>

        {/* Displaying the Hours Summary */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            padding: "16px 0",
            backgroundColor: "#ffffff",
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
                  gridTemplateColumns: "repeat(20, 1fr)",
                  gap: 16,
                  width: "100%",
                }}
              >
                {moments.map((moment) => {
                  let borderColor;
                  if (moment.status === "Approved") {
                    borderColor = "green";
                  } else if (moment.status === "Rejected") {
                    borderColor = "red";
                  } else {
                    borderColor = "orange";
                  }

                  return (
                    <div
                      key={moment.id}
                      onClick={() => handleMomentClick(moment)} // Show the moment details when clicked
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: borderColor,
                        borderRadius: "12px",
                        width: "30px",
                        height: "30px",
                        cursor: "pointer",
                      }}
                    ></div>
                  );
                })}
              </div>
            ))}
        </div>
      </div>

      {/* Popup Modal */}
      {selectedMoment && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 9999,
            width: "80%",
            maxWidth: "800px",
            backgroundColor: "white",
            padding: 20,
            borderRadius: 8,
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div style={{ flex: 1, marginRight: 16 }}>
            <video
              controls
              style={{
                width: "100%",
                borderRadius: 8,
                backgroundColor: "#000",
              }}
            >
              <source src={selectedMoment.video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <div style={{ flex: 1 }}>
            <h3>Description</h3>
            <p>{selectedMoment.description}</p>
            <p style={{ paddingTop: 10 }}>
              Created at: {new Date(selectedMoment.created_at).toLocaleString()}
            </p>
            <p style={{ paddingTop: 10 }}>
              Reviewer Comments:{" "}
              {selectedMoment.reviewer_comments || "No comments available."}
            </p>
            <button onClick={closePopup} style={{ marginTop: 10 }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
