import type { SidebarItemProps } from "@/components/layouts/Sidebar/SidebarItem";
import {
  LuBox,
  LuCircleCheck,
  LuHouse,
  LuSettings,
  LuUsers,
} from "react-icons/lu";
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
      children: [],
    },
    {
      href: "/venta",
      icon: <TbShoppingCart />,
      label: "Ventas",
      children: [
        {
          href: "/venta",
          icon: <TbShoppingCart />,
          label: "Listar Ventas",
          children: [],
        },
        {
          href: "/venta/crear",
          icon: <LuBox />,
          label: "Crear Venta",
          children: [],
        },
        {
          href: "/venta/reportes",
          icon: <LuCircleCheck />,
          label: "Reportes",
          children: [
            {
              href: "/venta/reportes/diario",
              icon: <LuCircleCheck />,
              label: "Reporte Diario",
              children: [],
            },
            {
              href: "/venta/reportes/mensual",
              icon: <LuCircleCheck />,
              label: "Reporte Mensual",
              children: [],
            },
          ],
        },
      ],
    },
    {
      href: "/unidades",
      icon: <PiStackPlusBold />,
      label: "Unidades",
      children: [],
    },
    {
      href: "/categorias",
      icon: <TbCategory2 />,
      label: "Categorias",
      children: [],
    },
    {
      href: "/galeria",
      icon: <IoImageOutline />,
      label: "Galeria",
      children: [],
    },
    {
      href: "/productos",
      icon: <TbShoppingCart />,
      label: "Productos",
      children: [],
    },
    {
      href: "/almacenes",
      icon: <RiStore2Line />,
      label: "Almacenes",
      children: [],
    },
    {
      href: "/proveedores",
      icon: <LuUsers />,
      label: "Proveedores",
      children: [],
    },
    {
      href: "/clientes",
      icon: <LuUsers />,
      label: "Clientes",
      children: [],
    },
    {
      href: "/orden-entrada",
      icon: <LuBox />,
      label: "Orden de Entrada",
      children: [
        {
          icon: <LuBox />,
          label: "Ordenes de Entrada",
          children: [],
          href: "/orden-entrada",
        },
        {
          icon: <LuCircleCheck />,
          label: "Aceptar Recepción",
          children: [],
          href: "/orden-entrada/recepcion",
        },
      ],
    },
    {
      href: "/configuracion",
      icon: <LuSettings />,
      label: "Configuración",
      children: [],
    },
  ],
  footer: [],
};
