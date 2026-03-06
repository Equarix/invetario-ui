import { Avatar } from "@heroui/react";
import type { ResponseChats } from "@/interface/response.interface";

interface ChatMessageProps {
  message: ResponseChats;
  isMe: boolean;
}

export default function ChatMessage({ message, isMe }: ChatMessageProps) {
  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const initials = `${message.user.firstName[0]}${message.user.lastName[0] || ""}`.toUpperCase();

  return (
    <div className={`flex gap-3 ${isMe ? "flex-row-reverse" : "flex-row"} mb-2`}>
      <Avatar
        name={initials}
        size="sm"
        className="shrink-0"
        classNames={{
          base: isMe ? "bg-primary-100 text-primary-600" : "bg-default-200 text-default-600",
          name: "text-[10px] font-bold"
        }}
      />
      
      <section className={`flex flex-col max-w-[75%] ${isMe ? "items-end" : "items-start"}`}>
        {!isMe && (
          <header className="text-[11px] font-semibold text-default-600 mb-1 ml-1 px-1">
            {message.user.firstName} {message.user.lastName}
          </header>
        )}
        
        <main
          className={`relative p-3 rounded-2xl shadow-sm group transition-shadow hover:shadow-md ${
            isMe
              ? "bg-primary text-primary-foreground rounded-tr-none"
              : "bg-white dark:bg-default-100 rounded-tl-none border border-default-100"
          }`}
        >
          <p className="text-small whitespace-pre-wrap leading-relaxed">
            {message.message}
          </p>
          
          <div className="flex items-center justify-end gap-1 mt-1">
            <span
              className={`text-[9px] ${
                isMe ? "text-primary-foreground/70" : "text-default-400"
              }`}
            >
              {time}
            </span>
          </div>
        </main>
      </section>
    </div>
  );
}
