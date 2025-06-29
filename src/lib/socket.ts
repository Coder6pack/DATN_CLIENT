// import envConfig from "@/config";
// import { io } from "socket.io-client";
// // Cấu hình kết nối WebSocket
// const socket = io("localhost:3003");

// // Sự kiện khi kết nối thành công
// socket.on("connect", () => {
//   console.log("Đã kết nối với server WebSocket:", socket.id);
// });

// // Sự kiện khi có lỗi kết nối
// // socket.on("connect_error", (error) => {
// //   console.error("Lỗi kết nối:", error.message);
// // });

// // Sự kiện khi ngắt kết nối
// socket.on("disconnect", (reason) => {
//   console.log("Ngắt kết nối:", reason);
// });

// // Xuất socket để sử dụng ở nơi khác
// export default socket;

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
