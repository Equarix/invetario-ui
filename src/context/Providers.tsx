import { HeroUIProvider, ToastProvider } from "@heroui/react";
import type { PropsWithChildren } from "react";
import { BrowserRouter } from "react-router";
import { ThemeProvider as NextTheme } from "next-themes";
import { AlertProvider } from "./AlertContext";
import GlobalAlert from "@/components/components/GlobalAlert";

export default function Providers({ children }: PropsWithChildren) {
  return (
    <HeroUIProvider>
      <AlertProvider>
        <ToastProvider placement="top-right" />
        <GlobalAlert />
        <NextTheme attribute="class" defaultTheme="dark">
          <BrowserRouter>{children}</BrowserRouter>
        </NextTheme>
      </AlertProvider>
    </HeroUIProvider>
  );
}
