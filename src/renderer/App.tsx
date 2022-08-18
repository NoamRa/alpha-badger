import React, { useState } from "react";
import styled from "@emotion/styled";
import { DefaultErrorBoundary } from "./components/DefaultErrorBoundary";
import { presets, presetOptions } from "./presets";
import { FormGroup, HTMLSelect } from "@blueprintjs/core";

export function App() {
  const [presetIndex, setPresetIndex] = useState(
    alphaBadgerApi.getSelectedPresetIndex,
  );

  const SelectedPreset = presets[presetIndex].component;

  const handlePresetChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    const presetIndex = parseInt(evt.target.value);
    setPresetIndex(presetIndex);
    alphaBadgerApi.setSelectedPresetIndex(presetIndex);
  };

  return (
    <DefaultErrorBoundary>
      <Layout>
        <Nav>
          <h2>Alpha-Badger🦡</h2>
          <FormGroup label="Choose preset" labelFor="preset-select">
            <HTMLSelect
              id="preset-select"
              fill
              onChange={handlePresetChange}
              options={presetOptions}
              value={presetIndex.toString()}
            />
          </FormGroup>
        </Nav>
        <Padding>
          <SelectedPreset />
        </Padding>
      </Layout>
    </DefaultErrorBoundary>
  );
}

const Layout = styled.div`
  height: 100vh;
  display: grid;
  grid-template-columns: 200px 1fr;
`;

const Padding = styled.div`
  padding: 16px;
`;

const Nav = styled(Padding)`
  border-right: 1px black solid;
`.withComponent("nav");
