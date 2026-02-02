import { HeroUIProvider, ToastProvider } from "@heroui/react";
import type { PropsWithChildren } from "react";
import { BrowserRouter } from "react-router";
import { ThemeProvider as NextTheme } from "next-themes";

export default function Providers({ children }: PropsWithChildren) {
  return (
    <HeroUIProvider>
      <ToastProvider placement="top-right" />
      <NextTheme attribute="class" defaultTheme="dark">
        <BrowserRouter>{children}</BrowserRouter>
      </NextTheme>
    </HeroUIProvider>
  );
}
