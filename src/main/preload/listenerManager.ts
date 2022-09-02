import { ipcRenderer } from "electron";
import { genShortId } from "../utils/generateId";

export type ListenerId = string;
export type Listener<T extends Record<string, unknown>> = (
  payload: WithFFmpegId<T>,
) => void;
type ChannelAndListener = {
  channel: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listener: (event: Event, payload: WithFFmpegId<any>) => void;
};

const listeners: Map<ListenerId, ChannelAndListener> = new Map();

export function addListener<T extends Record<string, unknown>>(
  channel: string,
  listener: Listener<T>,
): ListenerId {
  const id = genShortId("listener");
  if (listeners.get(id)) {
    throw new Error(`trying to register listener on used address: ${id}`);
  }

  const listenerWithoutEvent = (event: Event, payload: WithFFmpegId<T>) => {
    listener(payload);
  };
  listeners.set(id, { channel, listener: listenerWithoutEvent });
  ipcRenderer.on(channel, listenerWithoutEvent);
  return id;
}

export function removeListener(id: ListenerId) {
  const channelAndListener = listeners.get(id);
  if (!channelAndListener) {
    throw new Error(`trying to remove listener on unused address: ${id}`);
  }

  const { channel, listener } = channelAndListener;
  ipcRenderer.removeListener(channel, listener);
  listeners.delete(id);
}
