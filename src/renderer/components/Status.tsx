import React from "react";
import type { UseProgress } from "../hooks/useProgress";
import { FFmpegStatus } from "../hooks/useFFmpegStatus";

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
  progress?: UseProgress["progress"];
};

export function Status({ status, progress }: StatusProps) {
  const progressEntries = Object.entries(progress ?? {});

  return (
    <section id="status">
      {statusText(status) && <div>{statusText(status)}</div>}
      {progressEntries.length > 0 && (
        <ul id="progress">
          {progressEntries.map(([key, value]) => (
            <li key={key}>
              <>
                {key}: {value}
              </>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
