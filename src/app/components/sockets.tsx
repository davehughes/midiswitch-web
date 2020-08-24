import io, { Client } from 'socket.io-client';
import { WorkspaceEvent } from '@models/index';

export class SocketClient {
  socket: any;

  constructor() {
    this.socket = io();
    this.socketSetup(this.socket);
  }

  socketSetup(socket: Client) {
    socket.on('connected', data => {
      console.log('Socket connected!');
      socket.emit('workspace:create', {});
    });
    socket.on('workspace:created', workspace => {
      console.log('Workspace created!', workspace);
    });
    socket.on('workspace:event', (e: WorkspaceEvent) => {
      // console.log('Workspace event:', e);
      console.log('Workspace event');
    });
  }

  disconnect() {
    this.socket.emit('disconnect');
  }
}
