import React, { useState, useMemo, useEffect } from "react";
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


const MockPathList = [
  {
    from: 'start',
    to: "1"
  },
  {
    from: 'start',
    to: "7"
  },
  {
    from: "4",
    to: "end"
  },
  {
    from: "9",
    to: "end"
  },
  {
    from: "1",
    to: "8"
  },
  {
    from: "7",
    to: "2"
  },
  {
    from: "2",
    to: "6"
  },
  {
    from: "6",
    to: "10"
  },
  {
    from: "1",
    to: "2"
  },
  {
    from: "8",
    to: "5"
  },
  {
    from: "5",
    to: "9"
  },
  {
    from: "5",
    to: "4"
  }]

const findPathTree = (startId) => {
  const targetList = MockPathList.filter(i => i.from === startId)
  return [...targetList, ...targetList.map(t => findPathTree(t.to)).reduce((acc, arr) => [...acc, ...arr], [])]
}

function App() {
  const [itemGroups, setItemGroups] = useState({
    group1: ["1", "7"],
    group2: ["8", "2", "3"],
    group3: ["6", "5"],
    group4: ["4", "9", "10"],
  });
  const [activeId, setActiveId] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const pathList = useMemo(() => {
    if (selectedItem === null) {
      return []
    }
    if (selectedItem === 'start') {
      return MockPathList
    }
    if (selectedItem === 'end') {
      return []
    }
    return findPathTree(selectedItem)
  }, [selectedItem])

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );


  const paintAPath = (groupId) => {
    if (selectedItem === 'start') {
      return pathList.findIndex((path) => {
        return itemGroups[groupId].includes(path.to)
      }) !== -1
    }

    const currentGroupIndex = Object.keys(itemGroups).findIndex((key) => {
      return itemGroups[key].find(id => id === selectedItem)
    })

    const targetGroupIndex = Object.keys(itemGroups).findIndex((key) => {
      return key === groupId
    })

    if (currentGroupIndex !== -1 && targetGroupIndex > currentGroupIndex) {
      return pathList.findIndex((path) => {
        return itemGroups[groupId].includes(path.to)
      }) !== -1
    }
    return false
  }
  const paintBPath = (groupId, itemId) => {
    const paintedA = paintAPath(groupId)
    if (!paintedA) return {
      up: false,
      down: false
    }

    const currentGroup = itemGroups[groupId]
    const currentItemIndex = currentGroup.findIndex(i => i === itemId)
    const firstItemIndex = currentGroup.findIndex((i) => pathList.map(p => p.to).includes(i))
    const lastItemIndex = (currentGroup.length - 1) - [...currentGroup].reverse().findIndex((i) => pathList.map(p => p.to).includes(i))
    const centerIndex = (currentGroup.length - 1) / 2

    //중앙에 위치
    if (centerIndex === currentItemIndex) {
      return {
        up: firstItemIndex < currentItemIndex,
        down: lastItemIndex > currentItemIndex,
      }
    }
    //중앙idx보다 상단에 위치
    if (centerIndex > currentItemIndex) {
      return {
        up: firstItemIndex < currentItemIndex,
        down: firstItemIndex <= currentItemIndex,
      }
    }
    if (centerIndex < currentItemIndex) {
      return {
        up: lastItemIndex >= currentItemIndex,
        down: lastItemIndex > currentItemIndex,
      }
    }

  }
  const paintCPath = (groupId, itemId) => {
    const paintedA = paintAPath(groupId)
    if (!paintedA) return false

    return pathList.map(p => p.to).includes(itemId)
  }

  const paintDPath = (groupId, itemId) => {
    const paintedF = paintFPath(groupId)
    if (!paintedF) return false
    return pathList.map(p => p.from).includes(itemId)
  }

  const paintEPath = (groupId, itemId) => {
    const paintedF = paintFPath(groupId, itemId)
    if (!paintedF) return {
      up: false,
      down: false
    }

    const currentGroup = itemGroups[groupId]
    const currentItemIndex = currentGroup.findIndex(i => i === itemId)
    const firstItemIndex = currentGroup.findIndex((i) => pathList.map(p => p.from).includes(i))
    const lastItemIndex = (currentGroup.length - 1) - [...currentGroup].reverse().findIndex((i) => pathList.map(p => p.from).includes(i))
    const centerIndex = (currentGroup.length - 1) / 2

    //중앙에 위치
    if (centerIndex === currentItemIndex) {
      return {
        up: firstItemIndex < currentItemIndex,
        down: lastItemIndex > currentItemIndex,
      }
    }
    //중앙idx보다 상단에 위치
    if (centerIndex > currentItemIndex) {
      return {
        up: firstItemIndex < currentItemIndex,
        down: firstItemIndex <= currentItemIndex,
      }
    }
    //중앙idx보다 하단에 위치
    if (centerIndex < currentItemIndex) {
      return {
        up: lastItemIndex >= currentItemIndex,
        down: lastItemIndex > currentItemIndex,
      }
    }
  }

  const paintFPath = (groupId) => {



    let currentGroupIndex = Object.keys(itemGroups).findIndex((key) => {
      return itemGroups[key].find(id => id === selectedItem)
    })
    if (selectedItem === 'start') {
      currentGroupIndex = 0
    }

    const targetGroupIndex = Object.keys(itemGroups).findIndex((key) => {
      return key === groupId
    })
    if (Object.keys(itemGroups).length - 1 === targetGroupIndex) {

      return pathList.findIndex((path) => {
        return path.to === "end"
      }) !== -1
    }
    if (currentGroupIndex !== -1 && targetGroupIndex >= currentGroupIndex) {
      return pathList.findIndex((path) => {
        const target = Object.keys(itemGroups)[targetGroupIndex + 1]
        if (!itemGroups[target]) {
          return false
        }
        return itemGroups[target].includes(path.to)
      }) !== -1
    }
    return false
  }
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
      <div className="container" style={{ padding: '20px' }} onClick={() => { setActiveItem(null) }}>
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
            }} onClick={() => {
              setItemGroups({ ...itemGroups, [`group${Object.keys(itemGroups).length + 1}`]: [] })
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
          <div style={{ display: 'flex', minHeight: '500px' }}>
            <div
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <div style={{
                display: 'flex',
                border: selectedItem === 'start' ? "2px solid skyblue" : "1px solid #dadada",
                borderRadius: "4px",
                width: '80px',
                height: "30px",
                alignItems: 'center',
                justifyContent: 'center',
                background: 'white'
              }}
                onClick={() => setSelectedItem("start")}
              >
                <span style={{ marginRight: 4 }}>▶</span>
                Start
              </div>
              <span style={{ border: selectedItem === 'start' ? "1px solid skyblue" : "1px dashed #dadada", width: '20px' }} />
            </div>
            {Object.keys(itemGroups).map((group, idx) => (
              <div style={idx === activeItem ?
                { display: 'flex', borderRight: '2px solid #efefef', borderLeft: '2px solid #efefef', background: '#f3f3f3' }
                :
                { display: 'flex' }}
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedItem(null)
                  setActiveItem(idx)
                }}
              >
                <Droppable
                  id={group}
                  items={itemGroups[group]}
                  activeId={activeId}
                  key={group}
                  selectedItem={selectedItem}
                  setSelectedItem={(data) => {
                    setActiveItem(null)
                    setSelectedItem(data)
                  }}
                  paintAPath={paintAPath}
                  paintBPath={paintBPath}
                  paintCPath={paintCPath}
                  paintDPath={paintDPath}
                  paintEPath={paintEPath}
                  paintFPath={paintFPath}
                />
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center' }}
            >
              <span style={{ border: paintFPath(Object.keys(itemGroups)[Object.keys(itemGroups).length - 1]) ? "1px solid skyblue" : "1px dashed #dadada", width: '20px' }} />
              <div style={{
                display: 'flex',
                border: selectedItem === 'end' ? "2px solid skyblue" : "1px solid #dadada",
                borderRadius: "4px",
                width: '80px',
                height: "30px",
                alignItems: 'center',
                justifyContent: 'center',
                background: 'white',
                marginRight: '40px'
              }}
                onClick={() => setSelectedItem("end")}
              >
                <span style={{ marginRight: 4 }}>◾</span>
                End
              </div>
            </div>
          </div>
        </div>
        <div style={{
          display: 'flex',
          width: '200px',
          height: '640px',
          borderRadius: '8px',
          background: '#fefefe',
          border: "2px solid #dfdfdf",
          overflow: 'auto',
          padding: '10px',
          marginLeft: "40px"
        }}>
          패널
        </div>
      </div>
      <DragOverlay>{activeId ? <Item id={activeId} dragOverlay /> : null}</DragOverlay>
    </DndContext >
  );
}

export default App;
