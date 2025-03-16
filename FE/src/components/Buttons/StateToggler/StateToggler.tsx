import { ShieldExclamationIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import "./StateToggler.scss";

interface StateTogglerProps {
  state: boolean;
  handleClick: () => void;
  disabled?: boolean;
  className?: string;
}

const StateToggler: React.FC<StateTogglerProps> = ({
  state,
  handleClick,
  disabled = false,
  className = "",
}) => {
  return (
    <div className={classNames("switch-container", className)}>
      <div
        className={classNames("switch-container__button", {
          "switch-container__button--active": state,
          "switch-container__button--disabled": disabled,
        })}
        onClick={disabled ? undefined : handleClick}
        role="switch"
        aria-checked={state}
        tabIndex={disabled ? -1 : 0}
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
