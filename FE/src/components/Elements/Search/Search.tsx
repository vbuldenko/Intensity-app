import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import "./Search.scss";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className="search">
      <MagnifyingGlassIcon className="icon search__icon" />
      <input
        type="text"
        placeholder="Search clients..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="search__input"
      />
    </div>
  );
}
