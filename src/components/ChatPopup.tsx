'use client';
import React, { useState } from "react";

const ChatPopup: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "admin", text: "Xin chào! Tôi có thể giúp gì cho bạn?" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() === "") return;
    setMessages([...messages, { from: "user", text: input }]);
    setInput("");
    // Ở đây bạn có thể tích hợp gửi message lên server hoặc xử lý thêm
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open ? (
        <div className="w-80 bg-white shadow-lg rounded-lg flex flex-col h-96 border border-gray-200">
          <div className="flex items-center justify-between p-3 border-b">
            <span className="font-semibold">Chat hỗ trợ</span>
            <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-red-500">×</button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`px-3 py-2 rounded-lg text-sm max-w-[70%] ${msg.from === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t flex gap-2">
            <input
              className="flex-1 border rounded px-2 py-1 text-sm focus:outline-none"
              type="text"
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
            />
            <button
              className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 text-sm"
              onClick={handleSend}
            >
              Gửi
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-blue-600 text-2xl"
          aria-label="Mở chat hỗ trợ"
        >
          💬
        </button>
      )}
    </div>
  );
};

export default ChatPopup; 