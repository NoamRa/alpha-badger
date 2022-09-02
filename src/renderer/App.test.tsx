import React from "react";
import { fireEvent, render, screen } from "./testUtils/testUtils";
import { App } from "./App";
import { presets } from "./presets";

describe("Test Navigation", () => {
  it("should see the app's title and preset selection", () => {
    render(<App />);

    expect(screen.getByText("Alpha-Badger🦡")).toBeVisible();

    expect(screen.getByLabelText("Choose preset:")).toBeVisible();

    expect(screen.getAllByRole("option").length).toBe(presets.length);
  });

  it("should be able to switch between presets and see the preset's description", async () => {
    const getOption = (name: string): HTMLOptionElement => {
      return screen.getByRole<HTMLOptionElement>("option", { name });
    };

    render(<App />);

    let presetUnderTestIndex = 0;
    let presetUnderTest = presets[presetUnderTestIndex];
    presets.forEach((preset) => {
      if (preset === presetUnderTest) {
        expect(screen.getByText(preset.name)).toBeVisible();
        expect(getOption(preset.name).selected).toBe(true);
        expect(screen.getByText(preset.description)).toBeVisible();
      } else {
        expect(getOption(preset.name).selected).toBe(false);
        expect(screen.queryByText(preset.description)).toBeNull();
      }
    });

    // change to preset 1
    presetUnderTestIndex = 1;
    presetUnderTest = presets[presetUnderTestIndex];
    fireEvent.change(screen.getByLabelText("Choose preset:"), {
      target: { value: presetUnderTestIndex },
    });

    // assert change preset called the API
    expect(alphaBadgerApi.setSelectedPresetIndex).toHaveBeenCalledWith(
      presetUnderTestIndex,
    );
    // this asserts the mocked value has changed, unrelated to the state in App.
    // may be useful for catching regressions down the line
    expect(alphaBadgerApi.getSelectedPresetIndex()).toBe(presetUnderTestIndex);

    expect(getOption(presetUnderTest.name).selected).toBe(true);

    presets.forEach((preset) => {
      if (preset === presetUnderTest) {
        expect(getOption(preset.name).selected).toBe(true);
        expect(screen.getByText(preset.description)).toBeVisible();
      } else {
        expect(getOption(preset.name).selected).toBe(false);
        expect(screen.queryByText(preset.description)).toBeNull();
      }
    });
  });
});
