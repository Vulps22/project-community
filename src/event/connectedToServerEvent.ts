import EventHandler from '../handlers/eventHandler';

class ConnectedToServerEvent extends EventHandler {
  protected eventName(): string {
    return 'join';
  }

  protected handler(serverId: string): void {
    this.socket.join(`server_${serverId}`);
    console.log(`User joined server_${serverId}`);
  }
}

export default ConnectedToServerEvent;
