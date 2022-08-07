import React from "react";
import { useProgress } from "../../hooks/useProgress";
import { FFmpegStatus, useFFmpegStatus } from "../../hooks/useFFmpegStatus";

function statusText(status: FFmpegStatus): string | undefined {
  switch (status) {
    case FFmpegStatus.Start: {
      return "Working...";
    }
    case FFmpegStatus.Error: {
      return "Error";
    }
    case FFmpegStatus.End: {
      return "Done";
    }
  }
}

export function Status() {
  const { status } = useFFmpegStatus();
  const { progress } = useProgress();
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
