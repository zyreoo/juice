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
    if (userData?.juiceStretches) {
      let total = 0;
      let pending = 0;
      let approved = 0;
      let rejected = 0;

      userData.juiceStretches.forEach((stretch) => {
        const stretchHours =
          Math.round(((stretch.timeWorkedSeconds || 0) / 3600) * 100) / 100;
        total += stretchHours;

        if (stretch.Review === "Approved") {
          approved += stretchHours;
        } else if (stretch.Review === "Rejected") {
          rejected += stretchHours;
        } else {
          pending += stretchHours;
        }
      });

      setTotalHours(total);
      setPendingHours(pending);
      setApprovedHours(approved);
      setRejectedHours(rejected);

      // Get moments and sort them with oldest first
      const allMoments = userData.juiceStretches.reduce((acc, stretch) => {
        if (stretch.omgMoments) {
          return [...acc, ...stretch.omgMoments];
        }
        return acc;
      }, []);

      // Sort moments by created_at in ascending order (oldest first)
      const sortedMoments = allMoments.sort((a, b) => {
        return new Date(a.created_at) - new Date(b.created_at);
      });

      setMoments(sortedMoments);
      setLoading(false);
    }
  }, [userData]);

  const handleMomentClick = (moment) => {
    setSelectedMoment(moment); // Set the selected moment to show details
  };

  const closePopup = () => {
    setSelectedMoment(null); // Close the popup by resetting selected moment
  };

  // Add useEffect to handle escape key
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === "Escape" && selectedMoment) {
        closePopup();
      }
    };

    if (selectedMoment) {
      document.addEventListener("keydown", handleEscapeKey);
    }

    // Cleanup listener when component unmounts or selectedMoment changes
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [selectedMoment]);

  return (
    <div
      style={{
        position: "absolute",
        transform: `translate(${position.x}px, ${position.y}px)`,
        zIndex: isActive ? ACTIVE_Z_INDEX : BASE_Z_INDEX,
      }}
    >
      <div
        onClick={handleWindowClick("menuWindow")}
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
          onMouseDown={handleMouseDown("menuWindow")}
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
                handleDismiss("menuWindow");
              }}
            >
              x
            </button>
          </div>
          <p>Moments</p>
          <div></div>
        </div>

        <h2
          style={{
            margin: 0,
            textAlign: "center",
            flexDirection: "row",
            fontSize: 32,
            marginTop: 8,
          }}
        >
          {approvedHours.toFixed(2)}/100{" "}
          <p style={{ fontSize: 16 }}>approved shipped hours</p>
        </h2>
        <div style={{ width: "80%", margin: "auto", textAlign: "center" }}>
          <div
            style={{
              height: "12px",
              width: "100%",
              background: "#ddd",
              borderRadius: "6px",
              overflow: "hidden",
              marginTop: "5px",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${(approvedHours / 100) * 100}%`,
                background: approvedHours >= 100 ? "gold" : "green",
                transition: "width 0.5s ease-in-out",
              }}
            />
          </div>
        </div>
        <p
          style={{ margin: 0, textAlign: "center", padding: 10, fontSize: 14 }}
        >
          After completing the base 100 hours, each new approved hour will get
          <br />
          converted into $5 additional for your stipend!
        </p>

        {/* Displaying the Hours Summary */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            padding: "8px 0",
            backgroundColor: "#ffffff",
            borderBottom: "1px solid #000",
            borderTop: "1px solid #000",
          }}
        >
          <div>
            Total Hours: <br />
            <span style={{ color: "black" }}>{totalHours.toFixed(2)} hrs</span>
          </div>
          <div>
            Pending Hours: <br />
            <span style={{ color: "orange" }}>
              {pendingHours.toFixed(2)} hrs
            </span>
          </div>
          <div>
            Approved Hours: <br />
            <span style={{ color: "green" }}>
              {approvedHours.toFixed(2)} hrs
            </span>
          </div>
          <div>
            Rejected Hours: <br />
            <span style={{ color: "red" }}>{rejectedHours.toFixed(2)} hrs</span>
          </div>
        </div>

        <div
          style={{
            textAlign: "center",
            paddingTop: "5px",
            paddingBottom: "0px",
          }}
        >
          <span
            style={{ color: "green", marginRight: "10px", fontSize: "15px" }}
          >
            ⬤ Approved
          </span>
          <span
            style={{ color: "orange", marginRight: "10px", fontSize: "15px" }}
          >
            ⬤ Pending
          </span>
          <span style={{ color: "red", fontSize: "15px" }}>⬤ Rejected</span>
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
            display: "flex",
            flexDirection: "row",
            border: "1px solid #000",
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
            {/* <h3>Description</h3> */}
            <p>{selectedMoment.description}</p>
            <p style={{ paddingTop: 10 }}>
              {new Date(selectedMoment.created_at).toLocaleString()}
            </p>
            {/* <p style={{ paddingTop: 10 }}>
              Reviewer Comments:{" "}
              {selectedMoment.reviewer_comments || "No comments available."}
            </p> */}
            <button onClick={closePopup} style={{ marginTop: 10 }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
