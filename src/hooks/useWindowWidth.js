import { useEffect, useState } from "react";

export const useWindowWidth = () => {
  const [widthWindow, setWidthWindow] = useState(() => window.innerWidth);

  useEffect(() => {
    const windowResize = () => setWidthWindow(window.innerWidth);
    window.addEventListener("resize", windowResize);
    return () => window.removeEventListener("resize", windowResize);
  }, []);
  return widthWindow;
};
