import envConfig from "@/config";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Khởi tạo kết nối Socket.IO
    socketRef.current = io(envConfig.NEXT_PUBLIC_API_ENDPOINT, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ["websocket", "polling"],
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to Socket.IO server");
      setIsConnected(true);
    });

    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server");
      setIsConnected(false);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return { socket: socketRef.current, isConnected };
};
