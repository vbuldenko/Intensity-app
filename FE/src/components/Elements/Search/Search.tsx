import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import "./Search.scss";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useDebouncedCallback } from "../../../hooks/useDebounce";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchInput({ value, onChange }: SearchInputProps) {
  const { t } = useTranslation();

  const [inputValue, setInputValue] = useState(value);
  const debouncedOnChange = useDebouncedCallback(onChange, 500);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    debouncedOnChange(e.target.value);
  };

  return (
    <div className="search">
      <MagnifyingGlassIcon className="icon search__icon" />
      <input
        type="text"
        placeholder={t("search.placeholder")}
        value={inputValue}
        onChange={handleChange}
        className="search__input"
      />
    </div>
  );
}
