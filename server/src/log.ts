type LogExtra = Record<string, unknown>;

const json = (level: string, message: string, extra?: LogExtra): string =>
  JSON.stringify({ timestamp: new Date().toISOString(), level, message, ...extra });

const log = {
  info: (msg: string, extra?: LogExtra): void => {
    process.stdout.write(`${json('info', msg, extra)}\n`);
  },
  warn: (msg: string, extra?: LogExtra): void => {
    process.stderr.write(`${json('warn', msg, extra)}\n`);
  },
  error: (msg: string, extra?: LogExtra): void => {
    process.stderr.write(`${json('error', msg, extra)}\n`);
  },
};

export default log;
