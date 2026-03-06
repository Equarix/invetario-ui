import Container from "@/components/components/container/Container";
import ChatMessage from "@/components/components/chat-message/ChatMessage";
import Load from "@/components/components/load/Load";
import Header from "@/components/layouts/header/Header";
import { useAuth } from "@/context/AuthContext";
import { useSignalR } from "@/hooks/useSignalR";
import {
  type ResponseChats,
  type ApiResponse,
  type ResponseStore,
} from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import {
  Button,
  Card,
  CardBody,
  Input,
  ScrollShadow,
  Select,
  SelectItem,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { LuMessageSquareCode, LuSend, LuStore } from "react-icons/lu";

export default function ChatPage() {
  const { on, off, invoke, joinRoom, leaveRoom } = useSignalR("chat");

  const { token, user } = useAuth();
  const [selectedStore, setSelectedStore] = useState<string>("");
  const [messages, setMessages] = useState<ResponseChats[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!selectedStore) {
      setMessages([]);
      return;
    }

    joinRoom(selectedStore);

    const handler = (data: ResponseChats) => {
      setMessages((prev) => [...prev, data]);
    };

    on("ReceiveMessage", handler);

    return () => {
      off("ReceiveMessage", handler);
      leaveRoom(selectedStore);
    };
  }, [selectedStore]);

  const { data, isLoading } = useQuery<ApiResponse<ResponseStore[]>>({
    queryKey: ["stores"],
    queryFn: async () => {
      const res = await instance.get("/store", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
  });

  const handleSelectionChange = (storeId: string) => {
    setSelectedStore(storeId);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const payload = {
      content: message,
      room: selectedStore,
    };

    setMessages((prev) => [
      ...prev,
      {
        chatId: Date.now(),
        createdAt: new Date().toISOString(),
        userId: user?.userId || 0,
        message: message,
        storeId: parseInt(selectedStore),
        user: user!,
      },
    ]);

    invoke("SendMessage", payload);

    setMessage("");
  };

  return (
    <Container>
      <Load loading={isLoading} />
      <Header
        icon={<LuMessageSquareCode />}
        text={{
          header: "Mensajería",
        }}
        disabledButton
      />

      <div className="flex flex-col gap-6 mt-4 max-h-[85dvh]">
        <div className="w-full">
          <Select
            label="Seleccionar Tienda"
            placeholder="Elige una tienda para chatear"
            className="w-full"
            variant="flat"
            startContent={<LuStore className="text-default-400" />}
            selectedKeys={selectedStore ? [selectedStore] : []}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0];
              if (selectedKey) {
                handleSelectionChange(selectedKey.toString());
              }
            }}
          >
            {(data?.data || []).map((store) => (
              <SelectItem key={store.storeId.toString()} textValue={store.name}>
                <div className="flex flex-col">
                  <span className="text-small font-medium">{store.name}</span>
                  <span className="text-tiny text-default-400">
                    {store.address}
                  </span>
                </div>
              </SelectItem>
            ))}
          </Select>
        </div>

        <Card className="grow shadow-sm border-none bg-white">
          <CardBody className="p-0 flex flex-col">
            <ScrollShadow className="grow p-4 space-y-4 overflow-y-auto">
              {selectedStore ? (
                <>
                  {messages.map((msg) => (
                    <ChatMessage
                      key={msg.chatId}
                      message={msg}
                      isMe={msg.userId === user?.userId}
                    />
                  ))}
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-default-400 gap-2">
                  <LuMessageSquareCode size={48} className="opacity-20" />
                  <p>Selecciona una tienda para iniciar la conversación</p>
                </div>
              )}
            </ScrollShadow>

            <div className="p-4 border-t border-divider bg-white dark:bg-default-50">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex gap-2 items-center"
              >
                <Input
                  placeholder="Escribe un mensaje..."
                  variant="bordered"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  isDisabled={!selectedStore}
                  className="grow"
                />
                <Button
                  isIconOnly
                  color="primary"
                  type="submit"
                  isDisabled={!selectedStore || !message.trim()}
                  className="min-w-unit-10"
                >
                  <LuSend size={20} />
                </Button>
              </form>
            </div>
          </CardBody>
        </Card>
      </div>
    </Container>
  );
}
