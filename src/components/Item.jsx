import React from "react";

import "./Item.css";

const Item = ({ id, dragOverlay, handler, selectedItem, setSelectedItem }) => {
  const style = {
    cursor: dragOverlay ? "grabbing" : "grab",
  };
  return (
    <div
      className="item"
      onClick={(e) => {
        e.stopPropagation();
        setSelectedItem(id);
      }}
      style={{
        border: selectedItem === id ? "2px solid skyblue" : "1px solid #dadada",
      }}
    >
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
          background: "#dfdfdfaa",
          height: "96px",
          width: "16px",
          borderTopRightRadius: "4px",
          borderBottomRightRadius: "4px",
          marginLeft: "auto",
          marginRight: "1px",
          ...style,
        }}
        {...handler}
      />
    </div>
  );
};

export default Item;
