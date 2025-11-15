import { useTheme } from "../context/ThemeContext";

export default function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="btn btn-outline-secondary mb-3"
      style={{
        minWidth: "120px",
        borderRadius: "20px",
        fontWeight: "bold",
      }}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? "Light Mode 🌞" : "Dark Mode 🌙"}
    </button>
  );
}
