import { Server, Socket } from "socket.io";

abstract class EventHandler {
  protected io: Server;
  protected socket: Socket;

  constructor(io: Server, socket: Socket) {
    this.io = io;
    this.socket = socket;
    this.registerEvent();
  }

  private registerEvent() {
    this.socket.on(this.eventName(), (...args) => this.handler(...args));
}

  // Abstract method to get the event name
  protected abstract eventName(): string;

  // Abstract method to handle the event
  protected abstract handler(...args: any[]): void;
}

export default EventHandler;
