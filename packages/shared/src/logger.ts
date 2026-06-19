export const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
} as const;

export type LogLevelType = (typeof LogLevel)[keyof typeof LogLevel];

const levelNames: Record<LogLevelType, string> = {
  [LogLevel.DEBUG]: "DEBUG",
  [LogLevel.INFO]: "INFO",
  [LogLevel.WARN]: "WARN",
  [LogLevel.ERROR]: "ERROR",
};

function getEnvLevel(): LogLevelType {
  const env = process.env.LOG_LEVEL?.toUpperCase();
  switch (env) {
    case "DEBUG": return LogLevel.DEBUG;
    case "INFO": return LogLevel.INFO;
    case "WARN": return LogLevel.WARN;
    case "ERROR": return LogLevel.ERROR;
    default: return LogLevel.INFO;
  }
}

class Logger {
  private minLevel: LogLevelType = getEnvLevel();

  private log(level: LogLevelType, ...args: unknown[]) {
    if (level < this.minLevel) return;
    const timestamp = new Date().toISOString();
    const prefix = `[${levelNames[level]}]`;
    const fn = level >= LogLevel.ERROR ? console.error
      : level >= LogLevel.WARN ? console.warn
      : console.log;
    fn(prefix, ...args);
  }

  debug(...args: unknown[]) { this.log(LogLevel.DEBUG, ...args); }
  info(...args: unknown[]) { this.log(LogLevel.INFO, ...args); }
  warn(...args: unknown[]) { this.log(LogLevel.WARN, ...args); }
  error(...args: unknown[]) { this.log(LogLevel.ERROR, ...args); }
}

export const logger = new Logger();