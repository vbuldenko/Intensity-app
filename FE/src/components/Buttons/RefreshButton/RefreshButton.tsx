import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { ButtonHTMLAttributes } from "react";

interface RefreshButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  handleClick: () => void;
}

const RefreshButton: React.FC<RefreshButtonProps> = ({
  handleClick,
  ...props
}) => {
  return (
    <button onClick={handleClick} aria-label="Refresh" {...props}>
      <ArrowPathIcon />
    </button>
  );
};

export default RefreshButton;
