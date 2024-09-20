import React from "react";
import "./Selector.scss";

interface SelectorProps<T> {
  selection: T;
  handleSelection: (buttonName: T) => void;
  buttonNames: T[];
}

const Selector = <T extends React.ReactNode>({
  selection,
  handleSelection,
  buttonNames,
}: SelectorProps<T>) => {
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
