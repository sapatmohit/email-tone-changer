import { useEffect, useState } from "react";

export const useTheme = () => {
  const [theme, setTheme] = useState("system");

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
  }, []);

  return { theme };
};
