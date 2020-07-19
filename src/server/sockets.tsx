import React from 'react';
import io from 'socket.io-client';

export class SocketClient extends React.Component {
  socket: any;

  async componentDidMount() {
    this.socket = io();
    console.log('Running socket setup');
    this.socketSetup(this.socket);
  }

  async componentWillUnmount() {
    this.socket.emit('disconnect');
  }

  socketSetup(socket) {
    socket.on('connected', data => {
      console.log('Socket connected!');
      socket.emit('workspace:create', {});
    });
    socket.on('workspace:created', workspace => {
      console.log('Workspace created!', workspace);
    });
    socket.on('workspace:event', e => {
      // console.log('Workspace event:', e);
      console.log('Workspace event');
    });
  }

  render() {
    return (<span></span>);
  }
}
