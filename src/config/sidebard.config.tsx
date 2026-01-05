import type { SidebarItemProps } from "@/components/layouts/Sidebar/SidebarItem";
import { LuHouse } from "react-icons/lu";
import { PiStackPlusBold } from "react-icons/pi";
import { TbCategory2 } from "react-icons/tb";
import { IoImageOutline } from "react-icons/io5";

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
    {
      href: "/categorias",
      icon: <TbCategory2 />,
      label: "Categorias",
    },
    {
      href: "/galeria",
      icon: <IoImageOutline />,
      label: "Galeria",
    }
    
  ],
  footer: [],
};
