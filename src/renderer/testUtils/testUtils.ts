import path from "node:path";
import type { store } from "../../main/store";

import "@testing-library/jest-dom";
export * from "@testing-library/react";

import userEvent from "@testing-library/user-event";
export const user = userEvent.setup();

const mockedStore: typeof store = (() => {
  const _store = new Map();

  return {
    getFFmpegPath: jest.fn((): string => {
      return _store.get("ffmpegPath") || "";
    }),
    setFFmpegPath: jest.fn((ffmpegPath: string): void => {
      _store.set("ffmpegPath", ffmpegPath);
    }),
    getFFprobePath: jest.fn((): string => {
      return _store.get("ffprobePath") || "";
    }),
    setFFprobePath: jest.fn((ffprobePath: string): void => {
      _store.set("ffprobePath", ffprobePath);
    }),
    getSelectedPresetIndex: jest.fn((): number => {
      return _store.get("selectedPresetIndex") || 0;
    }),
    setSelectedPresetIndex: jest.fn((selectedPresetIndex: number): void => {
      _store.set("selectedPresetIndex", selectedPresetIndex);
    }),
  };
})();

const mockedAlphaBadgerAPI: typeof alphaBadgerApi = {
  path,
  chooseFile: jest.fn(),
  chooseFiles: jest.fn(),
  chooseFolder: jest.fn(),

  readMetadata: jest.fn(),
  runFFmpegCommand: jest.fn(),
  stopAll: jest.fn(),

  // listeners
  onError: jest.fn(),
  onStart: jest.fn(),
  onEnd: jest.fn(),
  onProgress: jest.fn(),
  onData: jest.fn(),
  onCodecData: jest.fn(),
  removeListener: jest.fn(),

  // preset
  getSelectedPresetIndex: mockedStore.getSelectedPresetIndex,
  setSelectedPresetIndex: mockedStore.setSelectedPresetIndex,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any)["alphaBadgerApi"] = mockedAlphaBadgerAPI;
