import pino from "pino";
import pretty from "pino-pretty";
import { env } from "@/config/env";

const isDevelopment = env.NODE_ENV === "development";

const loggerOptions: pino.LoggerOptions = {
  level: env.LOG_LEVEL,
  base: {
    service: "irrwms",
    env: env.NODE_ENV,
  },
  redact: {
    paths: [
      "password",
      "token",
      "authorization",
      "cookie",
      "req.headers.authorization",
      "req.headers.cookie",
    ],
    remove: true,
  },
};

/**
 * Do not use pino `transport` here — it spawns thread-stream workers that fail
 * under Next.js / Turbopack with ERR_WORKER_PATH on API routes.
 */
const prettyStream = isDevelopment
  ? pretty({
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname",
    })
  : undefined;

export const logger = prettyStream ? pino(loggerOptions, prettyStream) : pino(loggerOptions);

export type Logger = typeof logger;

export function createChildLogger(bindings: Record<string, unknown>): Logger {
  return logger.child(bindings);
}

export default logger;
