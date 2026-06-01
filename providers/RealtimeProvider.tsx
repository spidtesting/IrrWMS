"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { useSession } from "next-auth/react";

type RealtimeContextValue = {
  socket: Socket | null;
  isConnected: boolean;
};

const RealtimeContext = createContext<RealtimeContextValue>({
  socket: null,
  isConnected: false,
});

type RealtimeProviderProps = {
  children: React.ReactNode;
};

export function RealtimeProvider({ children }: RealtimeProviderProps) {
  const { data: session, status } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.id) {
      setIsConnected(false);
      setSocket(null);
      return;
    }

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:3001";

    const instance = io(socketUrl, {
      auth: {
        userId: session.user.id,
        role: session.user.role,
        warehouseId: session.user.warehouseId,
      },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    instance.on("connect", onConnect);
    instance.on("disconnect", onDisconnect);

    setSocket(instance);

    return () => {
      instance.off("connect", onConnect);
      instance.off("disconnect", onDisconnect);
      instance.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, [session?.user?.id, session?.user?.role, session?.user?.warehouseId, status]);

  const value = useMemo(() => ({ socket, isConnected }), [socket, isConnected]);

  return <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>;
}

export function useRealtimeContext(): RealtimeContextValue {
  return useContext(RealtimeContext);
}
