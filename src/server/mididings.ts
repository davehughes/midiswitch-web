import _ from 'lodash';
import child_process from 'child_process';
import tail from 'tail';
import { EventEmitter } from 'events';

export class Mididings extends EventEmitter {
  executablePath: string;
  scriptPath: string;
  logPath: string;
  tail: any;
  subprocess: any;

  constructor() {
    super();

    this.executablePath = '/home/dave/projects/midi/python-relay/env/bin/mididings';
    this.scriptPath = '/home/dave/projects/midi/python-relay/scripts/dings_scratch.py';
    this.logPath = '/tmp/dings.log';
    this.tail = null;
    this.subprocess = null;
    this.attachSignalHandlers();
  }

  launch() {
    if (this.subprocess) {
      console.log("Process is already running, ignoring launch() command");
      return;
    }

    const opts = {
      env: Object.assign({}, process.env, {
        PYTHONPATH: '/home/dave/projects/midi/python-relay',
        VIRTUALENV: '/home/dave/projects/midi/python-relay/env',
      }),
    };
    const sub = child_process.spawn(this.executablePath, ['-R', '-f', this.scriptPath], opts);
    sub.stdout.on('data', d => {
      console.log(`stdout> ${d}`);
    });
    sub.stderr.on('data', d => {
      console.log(`stderr> ${d}`);
    });
    sub.on('close', (code, signal) => {
      if (code) {
        console.log('mididings process exited with code:', code);
        this.subprocess = null;
      } else if (signal) {
        console.log('mididings process killed by signal:', signal);
      }
    });
    this.consumeLog();
    return this.subprocess = sub;
  }

  relaunch() {
    this.close();
    this.launch();
  }

  consumeLog() {
    const tailer = new tail.Tail(this.logPath, "\n", {}, true);
    tailer.on('line', (line) => {
      const event = JSON.parse(line);
      console.log(event);
      this.emit('event', event);
    });
    tailer.on('error', (error) => {
      console.log(`eventlog ERROR>${error}`);
      this.emit('error', error);
    });
    return this.tail = tailer;
  }

  close() {
    if (this.subprocess) {
      this.subprocess.kill('SIGTERM');
      this.subprocess = null;
    }
    if (this.tail) {
      this.tail.unwatch();
      this.tail = null;
    }
  }

  attachSignalHandlers() {
    const handle = (signal) => {
      console.log(`Caught signal ${signal}, exiting...`);
      this.close();
    };
    process.on('SIGINT', handle);
    process.on('SIGTERM', handle);
    process.on('SIGHUP', () => {
      this.relaunch();
    });
  }
}

// 

if (require.main === module) {
  new Mididings().launch();
}
