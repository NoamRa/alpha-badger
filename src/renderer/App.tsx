import * as React from "react";
import { Layout } from "./components/Layout";
import { GifMaker } from "./presets/GifMaker/GifMaker";

export function App() {
  return (
    <React.StrictMode>
      <Layout>
        <nav>
          <h2>Alpha-Badger🦡</h2>
        </nav>
        <GifMaker />
      </Layout>
    </React.StrictMode>
  );
}
