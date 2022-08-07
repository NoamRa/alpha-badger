import React from "react";

type NumericInputProps = {
  id: string;
  name: string;
  value: number;
  max: number;
  onChange: (num: number) => void;
};

export function NumericInput({
  id,
  name,
  value,
  max,
  onChange,
}: NumericInputProps) {
  return (
    <span>
      <label id={`${id}-label`} htmlFor={name}>
        {name}
      </label>
      <input
        id={`${id}-input`}
        type="number"
        name={name}
        value={value}
        max={max.toString()}
        min={(0).toString()}
        onChange={(evt) => {
          onChange(evt.target.valueAsNumber);
        }}
      />
      <span>(Max {max})</span>
    </span>
  );
}
