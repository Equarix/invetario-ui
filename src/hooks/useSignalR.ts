import { useEffect, useRef, useState, useCallback } from "react";
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";
import { useAuth } from "@/context/AuthContext";
import { ENV } from "@/config/env";

const connections: Record<string, HubConnection> = {};

export function useSignalR(url: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const connRef = useRef<HubConnection | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    if (!token || token === "") return;

    if (!connections[url]) {
      connections[url] = new HubConnectionBuilder()
        .withUrl(`${ENV.API_WEB_SOCKET_URL}/${url}`, {
          accessTokenFactory: () => token,
        })
        .withAutomaticReconnect([0, 2000, 5000, 10000])
        .configureLogging(LogLevel.Warning)
        .build();
    }

    const conn = connections[url];
    connRef.current = conn;

    if (conn.state === HubConnectionState.Disconnected) {
      conn
        .start()
        .then(() => {
          setIsConnected(true);
          setConnectionId(conn.connectionId);
        })
        .catch(console.error);
    } else {
      setIsConnected(conn.state === HubConnectionState.Connected);
      setConnectionId(conn.connectionId);
    }

    conn.onreconnecting(() => setIsConnected(false));
    conn.onreconnected(() => {
      setIsConnected(true);
      setConnectionId(conn.connectionId);
    });
    conn.onclose(() => setIsConnected(false));
  }, [url]);

  // escuchar evento
  const on = useCallback(<T>(event: string, callback: (data: T) => void) => {
    connRef.current?.on(event, callback);
  }, []);

  const off = useCallback(<T>(event: string, callback: (data: T) => void) => {
    if (callback) {
      connRef.current?.off(event, callback);
    } else {
      connRef.current?.off(event);
    }
  }, []);

  const invoke = useCallback(async (method: string, ...args: unknown[]) => {
    try {
      return await connRef.current?.invoke(method, ...args);
    } catch (err) {
      console.error(`SignalR invoke [${method}]:`, err);
      throw err;
    }
  }, []);

  const joinRoom = useCallback(
    async (room: string) => {
      if (connRef.current?.state === HubConnectionState.Connected) {
        await connRef.current?.invoke("JoinRoom", room);
      }
    },
    [connRef],
  );

  const leaveRoom = useCallback(async (room: string) => {
    if (connRef.current?.state === HubConnectionState.Connected) {
      await connRef.current?.invoke("LeaveRoom", room);
    }
  }, []);

  return {
    isConnected,
    connectionId,
    on,
    off,
    invoke,
    joinRoom,
    leaveRoom,
  };
}
