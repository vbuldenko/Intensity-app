import { useTheme } from "../../../contexts/ThemeContext";
import "./Toggler.scss";

export const Toggler = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`toggler toggler--${theme}`}
    ></button>
  );
};
