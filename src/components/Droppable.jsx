import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";

import SortableItem from "./SortableItem";

import "./Droppable.css";

const Droppable = ({ id, items, selectedItem, setSelectedItem }) => {
  const { setNodeRef } = useDroppable({ id });
  return (
    <SortableContext id={id} items={items} strategy={rectSortingStrategy}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <ul className="droppable" ref={setNodeRef}>
          {items.map((item, idx) => {
            const defaultStyle = { display: "flex" };
            const topStyle = idx === 0 ? { paddingTop: "52px" } : {};
            const bottomStyle =
              idx === items.length - 1 ? { paddingBottom: "52px" } : {};
            const lineStyle = { ...defaultStyle, ...topStyle, ...bottomStyle };
            return (
              <div style={{ display: "flex" }}>
                <div style={lineStyle}>
                  <span style={{ border: "1px solid #d3d3d3" }} />
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span
                    style={{ border: "0.5px solid #d3d3d3", width: "20px" }}
                  />
                  <SortableItem key={item} id={item} />
                  <span
                    style={{ border: "0.5px solid #d3d3d3", width: "20px" }}
                  />
                </div>
                <div style={lineStyle}>
                  <span style={{ border: "1px solid #d3d3d3" }} />
                </div>
              </div>
            );
          })}
        </ul>
      </div>
    </SortableContext>
  );
};

export default Droppable;
