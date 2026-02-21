import type { SidebarItemProps } from "@/components/layouts/Sidebar/SidebarItem";
import { LuBox, LuHouse, LuUsers } from "react-icons/lu";
import { PiStackPlusBold } from "react-icons/pi";
import { TbCategory2, TbShoppingCart } from "react-icons/tb";
import { IoImageOutline } from "react-icons/io5";
import { RiStore2Line } from "react-icons/ri";

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
    },
    {
      href: "/productos",
      icon: <TbShoppingCart />,
      label: "Productos",
    },
    {
      href: "/almacenes",
      icon: <RiStore2Line />,
      label: "Almacenes",
    },
    {
      href: "/proveedores",
      icon: <LuUsers />,
      label: "Proveedores",
    },
    {
      href: "/clientes",
      icon: <LuUsers />,
      label: "Clientes",
    },
    {
      href: "/orden-entrada",
      icon: <LuBox />,
      label: "Orden de Entrada",
    },
  ],
  footer: [],
};
