import "./Selector.scss";

import React from "react";

interface SelectorProps {
  selection: string;
  handleSelection: (buttonName: string) => void;
  buttonNames: string[];
}

const Selector: React.FC<SelectorProps> = ({
  selection,
  handleSelection,
  buttonNames,
}) => {
  return (
    <div className="selector">
      {buttonNames.map((buttonName, index) => (
        <button
          key={index}
          className={`selector__button ${
            selection === buttonName ? "selector__button--selected" : ""
          }`}
          onClick={() => handleSelection(buttonName)}
        >
          {buttonName}
        </button>
      ))}
    </div>
  );
};

export default Selector;
