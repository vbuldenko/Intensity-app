import { ShieldExclamationIcon } from "@heroicons/react/24/outline";
import "./StateToggler.scss";

interface StateTogglerProps {
  state: boolean;
  handleClick: () => void;
}

const StateToggler: React.FC<StateTogglerProps> = ({ state, handleClick }) => {
  return (
    <div className="switch-container">
      <div
        className={`switch-container__button ${state ? "switch-container__button--active" : ""}`}
        onClick={handleClick}
      >
        <div className="switch-container__slider">
          {state && (
            <ShieldExclamationIcon className="switch-container__icon" />
          )}
        </div>
      </div>
    </div>
  );
};

export default StateToggler;
