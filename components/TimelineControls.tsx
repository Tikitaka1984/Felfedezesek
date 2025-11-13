import React from "react";

type TimelineControlsProps = {};

const TimelineControls: React.FC<TimelineControlsProps> = () => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "10px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "white",
        border: "2px solid red",
        borderRadius: "8px",
        padding: "8px 16px",
        zIndex: 9999,
      }}
    >
      <strong>IDŐVONAL</strong> – itt lesz majd a csúszka és a Play gomb
    </div>
  );
};

export default TimelineControls;
