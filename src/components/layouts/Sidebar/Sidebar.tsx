import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  ScrollShadow,
} from "@heroui/react";
import {
  LuChevronUp,
  LuChevronsLeft,
  LuMoon,
  LuStore,
  LuSun,
  LuUser,
} from "react-icons/lu";
import { SideBarConfig } from "@/config/sidebard.config";
import { SidebarItem } from "./SidebarItem";
import { useAuth } from "@/context/AuthContext";
import { HiOutlineMinusCircle } from "react-icons/hi";
import { cn } from "@/utils/cn";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useTheme } from "next-themes";
import { useNavigate } from "react-router";

export function Sidebar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useLocalStorage("sidebar-is-open", true);
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <aside
      className={cn(
        "w-72 h-screen transition-all duration-300 ease-in-out sticky top-0 left-0 bg-white dark:bg-[#09090b] border-r border-zinc-200 dark:border-zinc-800 flex flex-col p-4 text-zinc-900 dark:text-zinc-400 z-50",
        !isOpen && "w-20",
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center justify-between mb-6 px-2",
          !isOpen && "px-0 justify-center",
        )}
      >
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <div className="w-5 h-5 bg-white rounded-md transform rotate-45 flex items-center justify-center">
              <span className="text-[12px] text-primary -rotate-45 font-black">
                I
              </span>
            </div>
          </div>
          {isOpen && (
            <span className="text-xl font-black tracking-tighter dark:text-white text-zinc-900">
              Inventario
            </span>
          )}
        </div>
        <Button
          isIconOnly
          variant="light"
          size="sm"
          className={cn(
            "text-zinc-400 hover:text-zinc-900 dark:hover:text-white min-w-8 w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm",
            !isOpen && "absolute right-0 translate-x-1/2",
          )}
          onPress={() => setIsOpen(!isOpen)}
        >
          <LuChevronsLeft
            size={16}
            className={cn(
              "transition-transform duration-300",
              !isOpen && "rotate-180",
            )}
          />
        </Button>
      </div>

      {/* User Profile Floating Menu */}
      <div
        className={cn(
          "mb-6 px-2 w-full flex justify-center",
          !isOpen && "px-0",
        )}
      >
        <Dropdown placement="right-end">
          <DropdownTrigger>
            <button
              type="button"
              className={cn(
                "flex items-center gap-3 w-full p-2 rounded-2xl transition-all duration-200 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-left outline-none border border-transparent hover:border-zinc-200/80 dark:hover:border-zinc-800/80 group",
                !isOpen &&
                  "px-0 justify-center hover:bg-transparent dark:hover:bg-transparent border-none",
              )}
            >
              <Avatar
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                className="min-w-10 h-10 text-large ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all"
              />
              {isOpen && (
                <div className="w-full flex items-center justify-between min-w-0">
                  <div className="flex flex-col truncate">
                    <span className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                      {user?.firstName} {user?.lastName}
                    </span>
                    <span className="text-xs text-zinc-500 truncate">
                      {user?.email}
                    </span>
                  </div>
                  <LuChevronUp className="text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-200 transition-transform group-aria-expanded:rotate-180 min-w-4 h-4 ml-1" />
                </div>
              )}
            </button>
          </DropdownTrigger>

          <DropdownMenu
            aria-label="Opciones de usuario"
            className="w-64 p-2"
            variant="flat"
          >
            <DropdownSection showDivider aria-label="Información de usuario">
              <DropdownItem
                key="user-info"
                className="h-14 gap-2 opacity-100 cursor-default"
                isReadOnly
              >
                <div className="flex flex-col">
                  <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                    Conectado como
                  </span>
                  <span className="font-semibold text-sm text-zinc-900 dark:text-white truncate">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <span className="text-xs text-zinc-500 truncate">
                    {user?.email}
                  </span>
                </div>
              </DropdownItem>
            </DropdownSection>

            <DropdownSection aria-label="Acciones principales">
              <DropdownItem
                key="profile"
                startContent={<LuUser size={18} className="text-primary" />}
                onPress={() => navigate("/perfil")}
                className="rounded-lg py-2"
              >
                Ver Perfil
              </DropdownItem>
              <DropdownItem
                key="store"
                startContent={<LuStore size={18} className="text-primary" />}
                onPress={() => {
                  window.dispatchEvent(new CustomEvent("open-store-modal"));
                }}
                className="rounded-lg py-2"
              >
                Cambiar Tienda / Caja
              </DropdownItem>
              <DropdownItem
                key="theme"
                closeOnSelect={false}
                startContent={
                  theme === "dark" ? (
                    <LuSun size={18} className="text-amber-500" />
                  ) : (
                    <LuMoon size={18} className="text-indigo-500" />
                  )
                }
                endContent={
                  <span className="text-xs font-medium text-zinc-400 capitalize">
                    {theme === "dark" ? "Oscuro" : "Claro"}
                  </span>
                }
                onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-lg py-2"
              >
                Cambiar Tema
              </DropdownItem>
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>
      </div>

      {/* Navigation */}
      <ScrollShadow className="flex-1 -mx-2 px-2">
        <nav className="flex flex-col gap-1">
          {SideBarConfig.body.map((item) => (
            <SidebarItem key={item.href} {...item} isOpen={isOpen} />
          ))}
        </nav>
      </ScrollShadow>

      {/* Footer / Logout */}
      <div className="mt-auto pt-4 flex flex-col gap-1 border-t border-zinc-200 dark:border-zinc-800/80">
        {SideBarConfig.footer.map((item) => (
          <SidebarItem key={item.href} {...item} isOpen={isOpen} />
        ))}
        <button
          type="button"
          className={cn(
            "flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer group text-zinc-500 dark:text-zinc-400 hover:bg-danger-50 dark:hover:bg-danger-900/20 hover:text-danger",
            !isOpen && "px-0 justify-center",
          )}
          onClick={logout}
        >
          <HiOutlineMinusCircle size={22} className="min-w-5" />
          {isOpen && (
            <span className="font-semibold text-sm">Cerrar sesión</span>
          )}
        </button>
      </div>
    </aside>
  );
}
