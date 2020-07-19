// Based on https://medium.com/@markcolling/integrating-socket-io-with-next-js-33c4c435065e
import express from 'express';
import http from 'http';
import makeSocketServer, { Server as SocketServer } from 'socket.io';
import uuid from 'uuid';

const app = express();
const server = new http.Server(app);
const io: SocketServer = makeSocketServer(server);
// const dev = process.env.NODE_ENV !== 'production';

// import { Mididings } from './mididings';

let port = 3000;


function socketSetup(io: SocketServer) {
  io.on('connect', socket => {
    socket.emit('connected', { message: 'hello' });

    socket.on('workspace:create', () => {
      const workspaceId = uuid.v4();      
      // const workspaceId = 'space1';
      const roomId = `workspace:${workspaceId}`;
      socket.join(roomId);
      socket.emit('workspace:created', { id: workspaceId });

      // const instance = new Mididings();
      // instance.on('event', (e) => {
      //   console.log('received dings event', e);
      //   const ev = Object.assign({}, e, { workspaceId });
      //   io.to(roomId).emit('workspace:event', ev);
      // });
      // instance.launch();
    });

    socket.on('disconnect', () => {
      console.log('socket disconnected');
    });
  });
}

socketSetup(io);

// Set up app with any HTTP routes/middleware/etc.
app.get('/', (req, res) => res.send('Hello World!'));

server.listen(port, () => {
  console.log(`> ready on http://localhost:${port}`);
}).on('error', (err) => {
  console.log('Error:', err);
});
