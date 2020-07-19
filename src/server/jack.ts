import _ from 'lodash';
import fs from 'fs';
import readline from 'readline';
import child_process from 'child_process';

async function parseJackPorts(stream) {
  const rl = readline.createInterface({
    input: stream,
    terminal: false,
  });

  // device: port
  const portPattern = /^([^:]*):(.*)$/;
  // <3 spaces>device: port
  const connectionPattern = /^   ([^:]*):(.*)$/;
  // <tab>properties: <comma-separated properties>
  const propertiesPattern = /^\tproperties: (.*)$/;
  // <tab>type
  const typePattern = /^\t(.*)$/;

  const ports = [];
  let currentPort = null;
  rl.on('line', (line) => {
    const mproperties = propertiesPattern.exec(line);
    if (mproperties) {
      if (!currentPort) {
        console.log('Properties matched but no current port; skipping...');
        return;
      }
      currentPort.properties = _(mproperties[1].split(',')).map(s => s.trim()).compact().value();
      return;
    }

    const mtype = typePattern.exec(line);
    if (mtype) {
      if (!currentPort) {
        console.log('Type matched but no current port; skipping...');
        return;
      }
      currentPort.type = mtype[1].trim();
      return;
    }

    const mconnection = connectionPattern.exec(line);
    if (mconnection) {
      if (!currentPort) {
        console.log('Connection matched but no current port; skipping...');
        return;
      }
      currentPort.connections.push(mconnection[1].trim());
      return;
    }

    const mport = portPattern.exec(line);
    if (mport) {
      if (currentPort) {
        ports.push(currentPort);
        currentPort = null;
      }
      currentPort = {
        device: mport[1],
        port: mport[2],
        connections: [],
      }
    }
  });

  return new Promise(resolve => {
    rl.on('close', () => {
      if (currentPort) {
        ports.push(currentPort);
        currentPort = null;
      }
      resolve(ports);
    });
  });
}

async function fetchJackPorts() {
  const sub = child_process.spawn('jack_lsp', ['--connections', '--properties', '--type']);
  sub.on('close', (code, signal) => {
    console.log(`sub exited, code: ${code}, signal: ${signal}`);
  });
  return parseJackPorts(sub.stdout);
}

async function main() {
  const ports = await fetchJackPorts();
  console.log(ports);
}

if (require.main === module) {
  main();
}
