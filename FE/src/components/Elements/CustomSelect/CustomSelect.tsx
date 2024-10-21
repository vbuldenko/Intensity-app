import React, { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import "./CustomSelect.scss";

interface CustomSelectProps {
  value: string;
  options: string[];
  onChange: (value: any) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  options,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="custom-select">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="custom-select__button"
      >
        {options.find((option) => option === value)}
        <ChevronDownIcon className="custom-select__icon" />
      </button>
      {isOpen && (
        <ul className="custom-select__menu">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => handleOptionClick(option)}
              className="custom-select__option"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
