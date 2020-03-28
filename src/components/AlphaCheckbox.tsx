import React, { ChangeEvent } from "react";

type AlphaCheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

function AlphaCheckbox({ onChange, checked }: AlphaCheckboxProps) {
  const handleChange = ({
    target: { checked }
  }: ChangeEvent<HTMLInputElement>) => {
    onChange(checked);
  };
  return (
    <div>
      <label htmlFor="alpha">Render Alpha</label>
      <input
        type="checkbox"
        id="alpha"
        name="alpha"
        checked={checked}
        onChange={handleChange}
      />
    </div>
  );
}

export default AlphaCheckbox;
