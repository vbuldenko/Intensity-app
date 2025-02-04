import React from "react";
import "./Selector.scss";

interface ButtonName {
  value: string;
  label: string;
}

interface SelectorProps {
  selection: string;
  handleSelection: (buttonName: any) => void;
  buttonNames: ButtonName[];
}

const Selector: React.FC<SelectorProps> = ({
  selection,
  handleSelection,
  buttonNames,
}) => {
  return (
    <div className="selector relative">
      {buttonNames.map(({ value, label }, index) => (
        <button
          key={index}
          className={`selector__button capitalize ${
            selection === value ? "selector__button--selected" : ""
          }`}
          onClick={() => handleSelection(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default Selector;
