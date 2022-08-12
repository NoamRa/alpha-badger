import { useMemo, useState } from "react";

type UseToggle = [
  value: boolean,
  toggle: {
    on: () => void;
    off: () => void;
    flip: () => void;
  },
];

export function useToggle(initialState: boolean | (() => boolean)): UseToggle {
  const [value, setValue] = useState<boolean>(initialState);
  const toggle = useMemo(
    () => ({
      on: () => {
        setValue(true);
      },
      off: () => {
        setValue(false);
      },
      flip: () => {
        setValue((v) => !v);
      },
    }),
    [],
  );

  return [value, toggle];
}
