import { Avatar, Button, ScrollShadow } from "@heroui/react";
import { LuChevronsLeft } from "react-icons/lu";
import { SideBarConfig } from "@/config/sidebard.config";
import { SidebarItem } from "./SidebarItem";
import { useAuth } from "@/context/AuthContext";
import { HiOutlineMinusCircle } from "react-icons/hi";
import { cn } from "@/utils/cn";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import ButtonTheme from "@/components/components/button-theme/ButtonTheme";

export function Sidebar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useLocalStorage("sidebar-is-open", true);

  return (
    <aside
      className={cn(
        "w-72 h-screen transition-all duration-200 ease-in sticky top-0 left-0 dark:bg-[#121212] border-r border-zinc-200 dark:border-zinc-800 flex flex-col p-4 text-white",
        !isOpen && "w-20",
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center justify-between mb-8 px-2",
          !isOpen && "px-0 justify-center",
        )}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
            <div className="w-4 h-4 bg-black rounded-sm transform rotate-45 flex items-center justify-center">
              <span className="text-[10px] text-white -rotate-45 font-bold">
                I
              </span>
            </div>
          </div>
          {isOpen && (
            <span className="text-lg font-bold dark:text-white text-black">
              Inventario
            </span>
          )}
        </div>
        <Button
          isIconOnly
          variant="light"
          size="sm"
          className={cn(
            "text-zinc-500 min-w-unit-8 w-8 h-8 rounded-full border border-zinc-800",
            !isOpen &&
              "absolute right-0 translate-x-1/2 bg-white dark:bg-zinc-900",
          )}
          onPress={() => setIsOpen(!isOpen)}
        >
          <LuChevronsLeft size={16} className={isOpen ? "" : "rotate-180"} />
        </Button>
      </div>

      {/* User Profile */}
      <div
        className={cn(
          "flex items-center gap-3 mb-8 px-2 relative w-full",
          !isOpen && "px-0 justify-center",
        )}
      >
        <Avatar
          src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
          className="min-w-10 h-10 text-large"
        />
        {isOpen && (
          <div className="w-full flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-black dark:text-white">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="text-xs text-zinc-500">{user?.email}</span>
            </div>

            <ButtonTheme />
          </div>
        )}
      </div>

      {/* Navigation */}
      <ScrollShadow className="flex-1 -mx-2 px-2">
        <nav className="flex flex-col gap-1">
          {SideBarConfig.body.map((item) => (
            <SidebarItem key={item.href} {...item} isOpen={isOpen} />
          ))}
        </nav>
      </ScrollShadow>

      {/* Footer */}
      <div className="mt-auto pt-4 flex flex-col gap-1">
        {SideBarConfig.footer.map((item) => (
          <SidebarItem key={item.href} {...item} isOpen={isOpen} />
        ))}
        <button
          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl transition-colors cursor-pointer group text-zinc-400 hover:bg-zinc-800/50"
          onClick={() => {
            logout();
          }}
        >
          <HiOutlineMinusCircle size={24} />
          {isOpen && "Cerrar sesión"}
        </button>
      </div>
    </aside>
  );
}
