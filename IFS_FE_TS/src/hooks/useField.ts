import { useState, ChangeEvent } from "react";

type UseFieldProps = {
  type: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const useField = (type: string): [UseFieldProps, () => void] => {
  const [value, setValue] = useState<string>("");

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const reset = () => {
    setValue("");
  };

  const props = { type, value, onChange };

  return [props, reset];
};
