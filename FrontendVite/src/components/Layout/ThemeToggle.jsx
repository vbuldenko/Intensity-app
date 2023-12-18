import { useTheme } from '../../context/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="switch-container">
            <div
                className={`switch-button ${theme === 'dark' ? 'active' : ''}`}
                onClick={toggleTheme}
            >
                <div className="switch-slider">
                    {theme === 'light' ? (
                        <SunIcon className="h-3 w-3" />
                    ) : (
                        <MoonIcon className="h-3 w-3" />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ThemeToggle;
