import React from "react";

import "./Item.css";

const Item = ({ id, dragOverlay, handler }) => {
  const style = {
    cursor: dragOverlay ? "grabbing" : "grab",
  };
  return (
    <div className="item">
      <div
        style={{ display: "flex", fontSize: "12px", flexDirection: "column" }}
      >
        <div> PROM {id}</div>
        <div style={{ height: "60px", fontWeight: "bold" }}>
          국제 전립선 증상 점수
        </div>
        <div style={{ fontSize: "8px", color: "gray" }}>
          도메인: 4개 | 문항: 15개
        </div>
      </div>
      <div
        style={{
          background: "#dfdfdf",
          height: "98px",
          width: "16px",
          borderTopRightRadius: "5px",
          borderBottomRightRadius: "5px",
          marginLeft: "auto",
          ...style,
        }}
        {...handler}
      />
    </div>
  );
};

export default Item;
