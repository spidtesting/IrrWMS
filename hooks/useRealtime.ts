"use client";

import { useCallback, useEffect } from "react";
import { useRealtimeContext } from "@/providers/RealtimeProvider";

type RealtimeEventHandler<T = unknown> = (payload: T) => void;

export function useRealtime() {
  const { socket, isConnected } = useRealtimeContext();

  const subscribe = useCallback(
    <T = unknown>(event: string, handler: RealtimeEventHandler<T>) => {
      if (!socket) {
        return () => undefined;
      }

      socket.on(event, handler);

      return () => {
        socket.off(event, handler);
      };
    },
    [socket],
  );

  const emit = useCallback(
    <T = unknown>(event: string, payload?: T) => {
      socket?.emit(event, payload);
    },
    [socket],
  );

  return {
    socket,
    isConnected,
    subscribe,
    emit,
  };
}

export function useRealtimeEvent<T = unknown>(
  event: string,
  handler: RealtimeEventHandler<T>,
  enabled = true,
): void {
  const { socket } = useRealtime();

  useEffect(() => {
    if (!socket || !enabled) {
      return;
    }

    socket.on(event, handler);

    return () => {
      socket.off(event, handler);
    };
  }, [enabled, event, handler, socket]);
}
