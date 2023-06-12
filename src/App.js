import React, { useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import Droppable from "./components/Droppable";
import Item from "./components/Item";
import { arrayMove, insertAtIndex, removeAtIndex } from "./utils/array";

import "./App.css";

function App() {
  const [itemGroups, setItemGroups] = useState({
    group1: ["1"],
    group2: ["7", "8", "2", "3"],
    group3: ["6"],
    group4: ["4", "5", "9", "10"],
  });
  const [activeId, setActiveId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = ({ active }) => setActiveId(active.id);

  const handleDragCancel = () => setActiveId(null);

  const handleDragOver = ({ active, over }) => {
    const overId = over?.id;

    if (!overId) {
      return;
    }

    const activeContainer = active.data.current.sortable.containerId;
    const overContainer = over.data.current?.sortable.containerId || over.id;

    if (activeContainer !== overContainer) {
      setItemGroups((itemGroups) => {
        const activeIndex = active.data.current.sortable.index;
        const overIndex =
          over.id in itemGroups
            ? itemGroups[overContainer].length + 1
            : over.data.current.sortable.index;

        return moveBetweenContainers(
          itemGroups,
          activeContainer,
          activeIndex,
          overContainer,
          overIndex,
          active.id
        );
      });
    }
  };

  const handleDragEnd = ({ active, over }) => {
    if (!over) {
      setActiveId(null);
      return;
    }

    if (active.id !== over.id) {
      const activeContainer = active.data.current.sortable.containerId;
      const overContainer = over.data.current?.sortable.containerId || over.id;
      const activeIndex = active.data.current.sortable.index;
      const overIndex =
        over.id in itemGroups
          ? itemGroups[overContainer].length + 1
          : over.data.current.sortable.index;

      setItemGroups((itemGroups) => {
        let newItems;
        if (activeContainer === overContainer) {
          newItems = {
            ...itemGroups,
            [overContainer]: arrayMove(
              itemGroups[overContainer],
              activeIndex,
              overIndex
            ),
          };
        } else {
          newItems = moveBetweenContainers(
            itemGroups,
            activeContainer,
            activeIndex,
            overContainer,
            overIndex,
            active.id
          );
        }

        return newItems;
      });
    }

    setActiveId(null);
  };

  const moveBetweenContainers = (
    items,
    activeContainer,
    activeIndex,
    overContainer,
    overIndex,
    item
  ) => {
    return {
      ...items,
      [activeContainer]: removeAtIndex(items[activeContainer], activeIndex),
      [overContainer]: insertAtIndex(items[overContainer], overIndex, item),
    };
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="container" style={{ padding: '20px' }} onClick={() => { setSelectedItem(null) }}>
        <div className="noscroll" style={{
          display: 'flex',
          width: '1000px',
          height: '600px',
          background: '#f9f9f9',
          border: "2px solid #dfdfdf",
          overflow: 'auto',
          padding: '30px',
          borderRadius: '8px',
          flexDirection: 'column'
        }}>
          <span>
            <button style={{
              background: 'white',
              border: '1px solid #dfdfdf',
              width: '150px',
              height: '30px',
              borderRadius: '4px',
              fontSize: 12,
              color: 'gray'
              , marginBottom: '10px'
            }} >+ STEP 추가하기</button></span>
          <span> <button style={{
            background: 'white',
            border: '1px solid #dfdfdf',
            width: '150px',
            height: '30px',
            borderRadius: '4px',
            fontSize: 12,
            color: 'gray'
            , marginBottom: '30px'
          }}>+ ACTION 추가하기</button></span>
          <div style={{ display: 'flex' }}>
            <div
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <div style={{
                display: 'flex',
                border: "1px solid #d3d3d3",
                borderRadius: "4px",
                width: '80px',
                height: "30px",
                alignItems: 'center',
                justifyContent: 'center',
                background: 'white'
              }}>
                <span style={{ marginRight: 4 }}>▶</span>
                Start
              </div>
              <span style={{ border: '0.5px solid #d3d3d3', width: '20px' }} />
            </div>
            {Object.keys(itemGroups).map((group, idx) => (
              <div style={idx === selectedItem ?
                { display: 'flex', borderRight: '2px dashed #dfdfdf', borderLeft: '2px dashed #dfdfdf', background: '#f3f3f3' }
                :
                { display: 'flex' }}
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedItem(idx)
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }} >
                  <span style={{ border: '0.5px solid #d3d3d3', width: '20px' }} />
                </div>
                <div style={{ display: 'flex' }}>
                  <Droppable
                    id={group}
                    items={itemGroups[group]}
                    activeId={activeId}
                    key={group}
                    selectedItem={selectedItem}
                    setSelectedItem={setSelectedItem}
                  />
                  <div style={{ display: 'flex', alignItems: 'center' }} >
                    <span style={{ border: '0.5px solid #d3d3d3', width: '20px' }} />
                  </div>
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center' }}
            >
              <span style={{ border: '0.5px solid #d3d3d3', width: '20px' }} />
              <div style={{
                display: 'flex',
                border: "1px solid #d3d3d3",
                borderRadius: "4px",
                width: '80px',
                height: "30px",
                alignItems: 'center',
                justifyContent: 'center'
                , background: 'white'
              }}>
                <span style={{ marginRight: 4 }}>◾</span>
                End
              </div>
            </div>
          </div>
        </div>
        <div style={{
          display: 'flex',
          width: '200px',
          height: '680px',
          background: '#fefefe',
          border: "1px solid #dfdfdf",
          overflow: 'auto',
          padding: '10px',
          marginLeft: "40px"
        }}>
          tes
        </div>
      </div>
      <DragOverlay>{activeId ? <Item id={activeId} dragOverlay /> : null}</DragOverlay>
    </DndContext >
  );
}

export default App;
