import { useEffect, useState } from 'react';

const useContextMenu = () => {
  const [open, setOpen] = useState(false);
  const [points, setPoints] = useState({
    x: 0,
    y: 0,
  });
  useEffect(() => {
    const handleClick = () => {
      setOpen(false);
    };
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);
  return {
    points,
    setPoints,
    open,
    setOpen,
  };
};
export default useContextMenu;
