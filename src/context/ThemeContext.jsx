// ThemeProvider.js (or ThemeContext.js)
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

export const ThemeContext = createContext();

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}

export default function ThemeProvider({ children }) {
  const getInitial = () => localStorage.getItem("theme") || "light";
  const [theme, setTheme] = useState(getInitial);

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(
    () => setTheme((prev) => (prev === "light" ? "dark" : "light")),
    []
  );

  const value = { theme, setTheme, toggleTheme };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
