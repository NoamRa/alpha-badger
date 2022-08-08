import React from "react";
import type { UseProgress } from "../../hooks/useProgress";
import { FFmpegStatus } from "../../hooks/useFFmpegStatus";

function statusText(status: FFmpegStatus): string | undefined {
  switch (status) {
    case FFmpegStatus.Working: {
      return "Working...";
    }
    case FFmpegStatus.Error: {
      return "Error";
    }
    case FFmpegStatus.Ended: {
      return "Done";
    }
  }
}

type StatusProps = {
  status: FFmpegStatus;
  progress: UseProgress["progress"];
};

export function Status({ status, progress }: StatusProps) {
  return (
    <section id="status">
      {statusText(status) && <div>{statusText(status)}</div>}
      <ul id="progress">
        {Object.entries(progress).map(([key, value]) => (
          <li key={key}>
            <>
              {key}: {value}
            </>
          </li>
        ))}
      </ul>
    </section>
  );
}
