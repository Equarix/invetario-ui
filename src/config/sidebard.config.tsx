import type { SidebarItemProps } from "@/components/layouts/Sidebar/SidebarItem";
import {
  LuBox,
  LuCircleCheck,
  LuCreditCard,
  LuFileBox,
  LuFileStack,
  LuHouse,
  LuIndentIncrease,
  LuMessageSquareText,
  LuSettings,
  LuTicketPlus,
  LuUsers,
} from "react-icons/lu";
import { PiStackPlusBold } from "react-icons/pi";
import { TbCategory2, TbShoppingCart } from "react-icons/tb";
import { IoImageOutline } from "react-icons/io5";
import { RiStore2Line } from "react-icons/ri";
import { FiFilePlus } from "react-icons/fi";
import { MdProductionQuantityLimits } from "react-icons/md";

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
          href: "/venta/proforma",
          icon: <LuFileBox />,
          label: "Proformas",
          children: [
            {
              href: "/venta/proforma",
              icon: <LuFileStack />,
              label: "Listar Proformas",
              children: [],
            },
            {
              href: "/venta/proforma/crear",
              icon: <FiFilePlus />,
              label: "Crear Proforma",
              children: [],
            },
          ],
        },
      ],
    },
    {
      href: "/caja",
      icon: <LuBox />,
      label: "Caja",
      children: [
        {
          href: "/caja/resumen",
          icon: <LuBox />,
          label: "Resumen",
          children: [],
        },
        {
          href: "/caja/reportes",
          icon: <LuCircleCheck />,
          label: "Reportes",
          children: [],
        },
      ],
    },
    {
      href: "/reportes",
      icon: <LuCircleCheck />,
      label: "Reportes",
      children: [
        {
          href: "/reportes/productos-faltantes",
          icon: <MdProductionQuantityLimits />,
          label: "Reporte Productos Faltantes",
          children: [],
        },
        {
          href: "/reportes/mensual",
          icon: <LuCircleCheck />,
          label: "Reporte Mensual",
          children: [],
        },
      ],
    },
    {
      href: "/mantenedores",
      label: "Mantendores",
      icon: <LuIndentIncrease />,
      children: [
        {
          href: "/mantenedores/unidades",
          icon: <PiStackPlusBold />,
          label: "Unidades",
          children: [],
        },
        {
          href: "/mantenedores/categorias",
          icon: <TbCategory2 />,
          label: "Categorias",
          children: [],
        },
        {
          href: "/mantenedores/metodos-pago",
          icon: <LuCreditCard />,
          label: "Métodos de Pago",
          children: [],
        },
        {
          href: "/mantenedores/cajas",
          icon: <LuBox />,
          label: "Cajas",
          children: [],
        },
      ],
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
      href: "/usuarios",
      icon: <LuUsers />,
      label: "Usuarios",
      children: [],
    },
    {
      href: "/chat",
      icon: <LuMessageSquareText />,
      children: [],
      label: "Chat",
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
        {
          icon: <LuTicketPlus />,
          label: "Crear Orden",
          children: [],
          href: "/orden-entrada/crear",
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
