import * as React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./styles.css";

function renderRoot(id: string) {
  const root = createRoot(document.getElementById(id) as HTMLElement);
  root.render(<App />);
}

renderRoot("alpha-badger-app");
