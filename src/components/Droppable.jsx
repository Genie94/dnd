import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import Item from "./Item";
import SortableItem from "./SortableItem";

import "./Droppable.css";

const Droppable = ({
  id,
  items,
  selectedItem,
  setSelectedItem,
  paintAPath,
  paintBPath,
  paintCPath,
  paintDPath,
  paintEPath,
  paintFPath,
}) => {
  const { setNodeRef } = useDroppable({ id });
  const borderStyle = { border: "1px dashed #dadada" };
  const horizonBorderStyle = {
    ...borderStyle,
    width: "20px",
  };
  return (
    <SortableContext id={id} items={items} strategy={rectSortingStrategy}>
      <div style={{ display: "flex" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span
            style={{
              ...horizonBorderStyle,
              ...(paintAPath(id) ? { border: "1px solid skyblue" } : {}),
            }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <ul className="droppable" ref={setNodeRef}>
            {items.length === 0 && (
              <div style={{ display: "flex" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span style={horizonBorderStyle} />
                  <li>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        boxSizing: "border-box",
                        width: "210px",
                        height: "100px",
                        marginBottom: "5px",
                        paddingLeft: "5px",
                        border: "1px dashed #dadada",
                        borderRadius: "8px",
                        userSelect: "none",
                        backgroundColor: "#ffffff11",
                        color: "#33333366",
                        justifyContent: "center",
                      }}
                    >
                      Empty
                    </div>
                  </li>
                  <span style={horizonBorderStyle} />
                </div>
              </div>
            )}
            {items.map((item, idx) => {
              const pathB = paintBPath(id, item);
              const pathE = paintEPath(id, item);
              return (
                <div style={{ display: "flex" }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span
                      style={{
                        ...borderStyle,
                        paddingTop: "52px",
                        borderColor:
                          idx === 0
                            ? "transparent"
                            : pathB.up
                            ? "skyblue"
                            : "#dadada",
                        borderStyle: pathB.up ? "solid" : "dashed",
                      }}
                    />
                    <span
                      style={{
                        ...borderStyle,
                        paddingBottom: "52px",
                        borderColor:
                          idx === items.length - 1
                            ? "transparent"
                            : pathB.down
                            ? "skyblue"
                            : "#dadada",
                        borderStyle: pathB.down ? "solid" : "dashed",
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span
                      style={{
                        ...horizonBorderStyle,
                        ...(paintCPath(id, item)
                          ? { borderColor: "skyblue", borderStyle: "solid" }
                          : { borderColor: "#dadada", borderStyle: "dashed" }),
                      }}
                    />
                    <SortableItem
                      key={item}
                      id={item}
                      selectedItem={selectedItem}
                      setSelectedItem={setSelectedItem}
                    />
                    <span
                      style={{
                        ...horizonBorderStyle,
                        ...(paintDPath(id, item)
                          ? { borderColor: "skyblue", borderStyle: "solid" }
                          : { borderColor: "#dadada", borderStyle: "dashed" }),
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span
                      style={{
                        ...borderStyle,
                        paddingTop: "52px",
                        borderColor:
                          idx === 0
                            ? "transparent"
                            : pathE.up
                            ? "skyblue"
                            : "#dadada",
                        borderStyle: pathE.up ? "solid" : "dashed",
                      }}
                    />
                    <span
                      style={{
                        ...borderStyle,
                        paddingBottom: "52px",
                        borderColor:
                          idx === items.length - 1
                            ? "transparent"
                            : pathE.down
                            ? "skyblue"
                            : "#dadada",
                        borderStyle: pathE.down ? "solid" : "dashed",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </ul>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span
            style={{
              ...horizonBorderStyle,
              ...(paintFPath(id) ? { border: "1px solid skyblue" } : {}),
            }}
          />
        </div>
      </div>
    </SortableContext>
  );
};

export default Droppable;
