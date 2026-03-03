import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Progress,
} from "@heroui/react";
import {
  MdOutlineInventory2,
  MdOutlineTrendingUp,
  MdOutlineWarningAmber,
  MdAttachMoney,
  MdOutlineLocalShipping,
  MdOutlinePointOfSale,
} from "react-icons/md";

export default function HomePage() {
  // Mock data for demonstration - in a real app these would come from hooks
  const metrics = [
    {
      title: "Valor Total Inventario",
      value: "$124,500.00",
      description: "Valor total de productos en almacén",
      icon: <MdAttachMoney className="text-2xl text-success" />,
      trend: "+12% vs mes anterior",
      trendColor: "text-success",
    },
    {
      title: "Productos sin Stock",
      value: "14",
      description: "Requieren reabastecimiento urgente",
      icon: <MdOutlineWarningAmber className="text-2xl text-danger" />,
      trend: "5 nuevos hoy",
      trendColor: "text-danger",
    },
    {
      title: "Órdenes Pendientes",
      value: "8",
      description: "Entradas esperando aprobación",
      icon: <MdOutlineLocalShipping className="text-2xl text-warning" />,
      trend: "3 urgentes",
      trendColor: "text-warning",
    },
    {
      title: "Ventas del Mes",
      value: "142",
      description: "Transacciones completadas",
      icon: <MdOutlinePointOfSale className="text-2xl text-primary" />,
      trend: "+8% vs promedio",
      trendColor: "text-primary",
    },
  ];

  const lowStockItems = [
    { name: "Laptop Dell XPS 15", stock: 2, min: 5, status: "Crítico" },
    { name: 'Monitor LG 27"', stock: 4, min: 10, status: "Bajo" },
    { name: "Teclado Mecánico RGB", stock: 1, min: 8, status: "Crítico" },
    { name: "Mouse Inalámbrico", stock: 5, min: 15, status: "Bajo" },
  ];

  return (
    <div className="flex flex-col gap-6 p-4">
      <div>
        <h1 className="text-2xl font-bold dark:text-white">Panel de Control</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Resumen operativo y métricas de valor empresarial
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card
            key={index}
            className="bg-zinc-100 dark:bg-zinc-800 border-none shadow-sm"
          >
            <CardHeader className="flex gap-3 justify-between items-start pb-0">
              <div className="flex flex-col">
                <p className="text-tiny uppercase font-bold text-zinc-500">
                  {metric.title}
                </p>
              </div>
              <div className="p-2 bg-white/10 rounded-lg">{metric.icon}</div>
            </CardHeader>
            <CardBody className="py-2">
              <h2 className="text-3xl font-bold dark:text-white">
                {metric.value}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`text-tiny font-semibold ${metric.trendColor}`}
                >
                  {metric.trend}
                </span>
              </div>
              <p className="text-tiny text-zinc-400 mt-2">
                {metric.description}
              </p>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inventory Distribution */}
        <Card className="lg:col-span-2 bg-zinc-100 dark:bg-zinc-800">
          <CardHeader className="flex gap-3">
            <MdOutlineTrendingUp className="text-xl text-primary" />
            <div className="flex flex-col">
              <p className="text-md font-bold">Estado del Inventario</p>
              <p className="text-tiny text-zinc-500">
                Distribución de stock por categorías principales
              </p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="gap-6 py-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-tiny">
                  <span className="font-semibold">Electrónica</span>
                  <span>75% de capacidad</span>
                </div>
                <Progress color="primary" value={75} size="sm" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-tiny">
                  <span className="font-semibold">Accesorios</span>
                  <span>45% de capacidad</span>
                </div>
                <Progress color="secondary" value={45} size="sm" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-tiny">
                  <span className="font-semibold">Periféricos</span>
                  <span>90% de capacidad</span>
                </div>
                <Progress color="warning" value={90} size="sm" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-tiny">
                  <span className="font-semibold">Papelería</span>
                  <span>20% de capacidad</span>
                </div>
                <Progress color="success" value={20} size="sm" />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Low Stock Alerts */}
        <Card className="bg-zinc-100 dark:bg-zinc-800">
          <CardHeader className="flex gap-3">
            <MdOutlineWarningAmber className="text-xl text-danger" />
            <div className="flex flex-col">
              <p className="text-md font-bold">Alertas de Stock</p>
              <p className="text-tiny text-zinc-500">
                Items por debajo del mínimo
              </p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="px-0 py-0">
            <div className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {lowStockItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="text-small font-medium dark:text-white">
                      {item.name}
                    </span>
                    <span className="text-tiny text-zinc-500">
                      Stock: {item.stock} / Mín: {item.min}
                    </span>
                  </div>
                  <Chip
                    size="sm"
                    variant="flat"
                    color={item.status === "Crítico" ? "danger" : "warning"}
                  >
                    {item.status}
                  </Chip>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Recent Activity placeholder/summary */}
      <Card className="bg-zinc-100 dark:bg-zinc-800">
        <CardBody className="flex flex-row items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/20 rounded-full">
              <MdOutlineInventory2 className="text-2xl text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Resumen de Actividad</h3>
              <p className="text-small text-zinc-500">
                Se han procesado 24 movimientos de inventario en las últimas 48
                horas.
              </p>
            </div>
          </div>
          <Chip color="primary" variant="shadow">
            Ver historial completo
          </Chip>
        </CardBody>
      </Card>
    </div>
  );
}
