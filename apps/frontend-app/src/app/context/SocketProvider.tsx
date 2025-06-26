// "use client";

// import React, {
//   useCallback,
//   useContext,
//   useEffect,
//   useState,
//   createContext,
//   useMemo,
// } from "react";
// import { io, Socket } from "socket.io-client";
// import { useGameStore } from "@/stores/useGameStore";

// interface SocketProviderProps {
//   children?: React.ReactNode;
// }

// interface ChatMessage {
//   user: string;
//   message: string;
//   timestamp?: string;
// }

// interface ISocketContext {
//   sendMessage: (msg: string) => void;
//   messages: ChatMessage[];
//   isConnected: boolean;
// }

// const SocketContext = createContext<ISocketContext | null>(null);

// export const useSocket = () => {
//   const state = useContext(SocketContext);
//   if (!state) throw new Error("Socket context is undefined");
//   return state;
// };

// export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [isConnected, setIsConnected] = useState(false);

//   const { username, avatar, room } = useGameStore();

//   const sendMessage = useCallback(
//     (msg: string) => {
//       if (!socket || !msg.trim()) return;

//       const messageData = {
//         roomId: room || "test-room",
//         user: username || "Anonymous",
//         message: msg.trim(),
//       };

//       console.log("📤 Sending message to server:", messageData);
//       socket.emit("chat-message", messageData);
//     },
//     [socket, username, room]
//   );

//   const handleIncomingMessage = useCallback((data: ChatMessage) => {
//     console.log("📥 Received chat-message from server:", data);
//     setMessages((prev) => [...prev, data]);
//   }, []);

//   const handleChatHistory = useCallback((history: ChatMessage[]) => {
//     console.log("📜 Received chat-history from server:", history);
//     setMessages(history);
//   }, []);

//   useEffect(() => {
//     const _socket = io("http://localhost:8000", {
//       reconnection: true,
//       reconnectionAttempts: 5,
//       reconnectionDelay: 1000,
//     });

//     _socket.on("connect", () => {
//       setIsConnected(true);
//       console.log("✅ Socket connected");

//       // ✅ Join room after connection
//       if (room && username && avatar) {
//         _socket.emit("join-room", room, {
//           id: _socket.id,
//           username,
//           avatar,
//         });
//         console.log("🟡 join-room emitted", { room, username, avatar });
//       } else {
//         console.warn("❌ Missing username/avatar/room to join");
//       }
//     });

//     _socket.on("disconnect", () => {
//       setIsConnected(false);
//       console.log("🔌 Socket disconnected");
//     });

//     _socket.on("chat-message", handleIncomingMessage);
//     _socket.on("chat-history", handleChatHistory);

//     setSocket(_socket);

//     return () => {
//       _socket.off("connect");
//       _socket.off("disconnect");
//       _socket.off("chat-message", handleIncomingMessage);
//       _socket.off("chat-history", handleChatHistory);
//       _socket.disconnect();
//       setSocket(null);
//     };
//   }, [room, username, avatar, handleIncomingMessage, handleChatHistory]);

//   const contextValue = useMemo(
//     () => ({
//       sendMessage,
//       messages,
//       isConnected,
//     }),
//     [sendMessage, messages, isConnected]
//   );

//   return (
//     <SocketContext.Provider value={contextValue}>
//       {children}
//     </SocketContext.Provider>
//   );
// };
