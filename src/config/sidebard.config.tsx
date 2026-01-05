import type { SidebarItemProps } from "@/components/layouts/Sidebar/SidebarItem";
import { LuHouse } from "react-icons/lu";
import { PiStackPlusBold } from "react-icons/pi";

interface SideBarConfigProps {
  body: SidebarItemProps[];
  footer: SidebarItemProps[];
}

export const SideBarConfig: SideBarConfigProps = {
  body: [
    {
      href: "/",
      icon: <LuHouse />,
      label: "Inicio",
    },
    {
      href: "/unidades",
      icon: <PiStackPlusBold />,
      label: "Unidades",
    },
  ],
  footer: [],
};
