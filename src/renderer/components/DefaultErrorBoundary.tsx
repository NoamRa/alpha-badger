import type { ErrorInfo, PropsWithChildren } from "react";
import React, { Component } from "react";

type DefaultErrorBoundaryProps = PropsWithChildren<Record<string, unknown>>;

type DefaultErrorBoundaryState = {
  hasError: boolean;
};

export class DefaultErrorBoundary extends Component<
  DefaultErrorBoundaryProps,
  DefaultErrorBoundaryState
> {
  constructor(props: DefaultErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Something went wrong 😿</h1>
          <p>
            Please let me know what{" "}
            <a
              onClick={() =>
                alphaBadgerApi.openExternal("mailto:noamraby@gmail.com")
              }
            >
              noamraby@gmail.com
            </a>
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
