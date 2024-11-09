import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import "./Search.scss";
import { useTranslation } from "react-i18next";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchInput({ value, onChange }: SearchInputProps) {
  const { t } = useTranslation();
  return (
    <div className="search">
      <MagnifyingGlassIcon className="icon search__icon" />
      <input
        type="text"
        placeholder={t("search.placeholder")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="search__input"
      />
    </div>
  );
}
