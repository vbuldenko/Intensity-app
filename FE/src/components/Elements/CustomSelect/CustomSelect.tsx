import React, { useState, useEffect, useRef } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import "./CustomSelect.scss";

interface Option {
  value: string | number;
  label: string;
}

interface CustomSelectProps {
  value: string | number;
  options: string[] | number[] | Option[];
  onChange: (value: any) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  options,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const handleOptionClick = (optionValue: string | number) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      selectRef.current &&
      !selectRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const renderOptionLabel = (option: string | number | Option) => {
    if (typeof option === "object" && option !== null) {
      return option.label;
    }
    return option;
  };

  const getOptionValue = (option: string | number | Option) => {
    if (typeof option === "object" && option !== null) {
      return option.value;
    }
    return option;
  };

  const selectedOption = options.find(
    (option) => getOptionValue(option) === value
  );

  return (
    <div className="custom-select" ref={selectRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="custom-select__button"
      >
        {selectedOption ? renderOptionLabel(selectedOption) : "Select..."}
        <ChevronDownIcon className="custom-select__icon" />
      </button>
      {isOpen && (
        <ul className="custom-select__menu">
          {options.map((option) => (
            <li
              key={getOptionValue(option)}
              onClick={() => handleOptionClick(getOptionValue(option))}
              className="custom-select__option"
            >
              {renderOptionLabel(option)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
