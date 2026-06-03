import { createServer } from "http";
import { Server, type Socket } from "socket.io";
import { createAdapter } from "socket.io-redis-adapter";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import {
  REDIS_NOTIFICATION_CHANNEL,
  SOCKET_EVENTS,
  type NotificationBroadcastPayload,
} from "@/server/lib/events";
import {
  disconnectRedisClients,
  getRedisPubClient,
  getRedisSubClient,
} from "@/server/lib/redis-clients";

/** Railway injects PORT; local dev uses SOCKET_PORT. */
const PORT = Number(process.env.PORT ?? process.env.SOCKET_PORT ?? 3001);

type SocketAuth = {
  userId?: string;
  role?: string;
  warehouseId?: string;
};

async function authenticateSocket(auth: SocketAuth): Promise<{
  userId: string;
  role: string;
  warehouseId: string | null;
} | null> {
  if (!auth.userId) return null;

  const user = await prisma.user.findFirst({
    where: {
      id: auth.userId,
      isActive: true,
      deletedAt: null,
    },
    select: {
      id: true,
      role: true,
      warehouseId: true,
    },
  });

  if (!user) return null;

  return {
    userId: user.id,
    role: user.role,
    warehouseId: user.warehouseId,
  };
}

function joinUserRooms(
  socket: Socket,
  user: { userId: string; role: string; warehouseId: string | null },
): void {
  socket.join(`user:${user.userId}`);
  socket.join(`role:${user.role}`);

  if (user.warehouseId) {
    socket.join(`warehouse:${user.warehouseId}`);
  }
}

async function bootstrap(): Promise<void> {
  const httpServer = createServer((req, res) => {
    const path = req.url?.split("?")[0];
    if (path === "/health" || path === "/api/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok", service: "irrwms-socket" }));
      return;
    }

    res.writeHead(404);
    res.end();
  });

  await new Promise<void>((resolve, reject) => {
    httpServer.listen(PORT, "0.0.0.0", () => {
      logger.info({ port: PORT }, "IrrWMS socket server listening");
      resolve();
    });
    httpServer.on("error", reject);
  });

  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  try {
    const pubClient = getRedisPubClient();
    const subClient = getRedisSubClient();

    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));

    // Fan-out broadcasts published by worker / API routes via Redis pub/sub.
    await subClient.subscribe(REDIS_NOTIFICATION_CHANNEL);
    subClient.on("message", (channel, message) => {
      if (channel !== REDIS_NOTIFICATION_CHANNEL) return;

      try {
        const parsed = JSON.parse(message) as NotificationBroadcastPayload;
        io.to(parsed.room).emit(parsed.event, parsed.payload);
      } catch (error) {
        logger.error({ err: error }, "Invalid socket broadcast payload");
      }
    });
  } catch (error) {
    logger.error(
      { err: error },
      "Redis unavailable — socket server up but cross-instance broadcasts disabled",
    );
  }

  io.use(async (socket, next) => {
    const auth = socket.handshake.auth as SocketAuth;
    const user = await authenticateSocket(auth);

    if (!user) {
      next(new Error("Unauthorized"));
      return;
    }

    socket.data.user = user;
    next();
  });

  io.on("connection", (socket) => {
    const user = socket.data.user as {
      userId: string;
      role: string;
      warehouseId: string | null;
    };

    joinUserRooms(socket, user);
    logger.info({ userId: user.userId }, "Socket connected");

    socket.on(SOCKET_EVENTS.PING, () => {
      socket.emit(SOCKET_EVENTS.PONG, { ts: Date.now() });
    });

    socket.on(SOCKET_EVENTS.NOTIFICATION_READ, async (payload: { notificationId?: string }) => {
      if (!payload?.notificationId) return;

      try {
        await prisma.notification.updateMany({
          where: {
            id: payload.notificationId,
            userId: user.userId,
          },
          data: { isRead: true },
        });

        const unreadCount = await prisma.notification.count({
          where: { userId: user.userId, isRead: false },
        });

        socket.emit(SOCKET_EVENTS.NOTIFICATION_COUNT, { unreadCount });
      } catch (error) {
        logger.error({ err: error }, "Failed to mark notification read");
      }
    });

    socket.on("disconnect", (reason) => {
      logger.info({ userId: user.userId, reason }, "Socket disconnected");
    });
  });

  const shutdown = async (signal: string) => {
    logger.info({ signal }, "Shutting down socket server");
    io.close();
    httpServer.close();
    await disconnectRedisClients();
    await prisma.$disconnect();
    process.exit(0);
  };

  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
}

bootstrap().catch((error) => {
  logger.error({ err: error }, "Socket server failed to start");
  process.exit(1);
});
