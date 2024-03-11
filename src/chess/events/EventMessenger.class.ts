import { v4 as uuidv4 } from "uuid";

type Event<P> = {
  payload: P;
};

type Callback<P> = (event: Event<P>["payload"]) => void;

export type Events = Record<string, Event<unknown>>;

export class EventMessenger<T extends Events> {
  private listeners: {
    [key in keyof T]?: Record<string, Callback<T[key]["payload"]>>;
  } = {};

  public on<K extends keyof T>(event: K, callback: Callback<T[K]["payload"]>) {
    if (!this.listeners[event]) {
      this.listeners[event] = {};
    }

    const id = uuidv4();
    this.listeners[event] = {
      ...this.listeners[event],
      [id]: callback,
    };

    return id;
  }

  public off<K extends keyof T>(event: K, id: string) {
    if (!this.listeners[event]) {
      this.listeners[event] = {};
    }

    delete this.listeners[event]![id];
  }

  public emit<K extends keyof T>(event: K, payload: T[K]["payload"]) {
    if (!this.listeners[event]) {
      return;
    }

    Object.values(this.listeners[event]!).forEach((callback) => {
      callback(payload);
    });
  }
}
