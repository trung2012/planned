import { useState } from 'react';

export default () => {
  const [location, setLocation] = useState({
    startX: null,
    startScrollX: null
  });

  const handleMouseDown = ({ target, clientX }) => {
    const boardContainer = document.getElementById('board-container');
    if (target.className !== 'board-list' && !target.className.includes('board-task')) {
      return;
    }
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    setLocation({
      startX: clientX,
      startScrollX: boardContainer.scrollLeft
    })
  };

  const handleMouseMove = ({ clientX }) => {
    const scrollX = startScrollX - clientX + startX;
    window.scrollTo(scrollX, 0);
    const windowScrollX = window.scrollX;
    if (scrollX !== windowScrollX) {
      setStartX(clientX + windowScrollX - startScrollX);
    }
  };

  const handleMouseUp = () => {
    if (startX) {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      setStartX(null);
      setStartScrollX(null);
    }
  };

  return {
    startX,
    startScrollX,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  }
}