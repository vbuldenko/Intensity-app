import { ShieldExclamationIcon } from '@heroicons/react/24/outline';

const Toggle = ({ state, handleClick }) => {
    return (
        <div className="switch-container">
            <div
                className={`switch-button ${state ? 'active' : ''}`}
                onClick={handleClick}
            >
                <div className="switch-slider">
                    {state ? (
                        <ShieldExclamationIcon className="h-3 w-3 green-clr" />
                    ) : (
                        ''
                    )}
                </div>
            </div>
        </div>
    );
};

export default Toggle;
