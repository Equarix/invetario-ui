import { Card, CardBody, CardHeader, Chip, Skeleton } from "@heroui/react";
import {
  MdOutlineTrendingUp,
  MdOutlineWarningAmber,
  MdAttachMoney,
  MdOutlineLocalShipping,
  MdOutlinePointOfSale,
  MdDonutLarge,
  MdBarChart,
} from "react-icons/md";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { useHome } from "./hooks/useHome";

export default function HomePage() {
  const { trend, criticalProducts, kpi, topProducts, categoryTop } = useHome();

  const metrics = [
    {
      title: "Valor Total Inventario",
      value: `S/. ${kpi.total_inventory_value || "0"}`,
      description: "Valor total de productos en almacén",
      icon: <MdAttachMoney className="text-2xl text-success" />,
      trend: "+12% vs mes anterior",
      trendColor: "text-success",
    },
    {
      title: "Productos sin Stock",
      value: `${kpi.out_of_stock_products || "0"}`,
      description: "Requieren reabastecimiento urgente",
      icon: <MdOutlineWarningAmber className="text-2xl text-danger" />,
      trend: "5 nuevos hoy",
      trendColor: "text-danger",
    },
    {
      title: "Órdenes Pendientes",
      value: `${kpi.entry_order_pending || "0"}`,
      description: "Entradas esperando aprobación",
      icon: <MdOutlineLocalShipping className="text-2xl text-warning" />,
      trend: "3 urgentes",
      trendColor: "text-warning",
    },
    {
      title: "Ventas del Mes",
      value: `${kpi.sales_this_month || "0"}`,
      description: "Transacciones completadas",
      icon: <MdOutlinePointOfSale className="text-2xl text-primary" />,
      trend: "+8% vs promedio",
      trendColor: "text-primary",
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-6 min-h-screen bg-zinc-50/50 dark:bg-zinc-950">
      <div>
        <h1 className="text-3xl font-black tracking-tighter dark:text-white">
          Panel de Control
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 font-medium">
          Resumen operativo y métricas de valor empresarial
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card
            key={index}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all"
          >
            <CardBody className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-xl shadow-inner">
                  {metric.icon}
                </div>
                <Chip
                  size="sm"
                  variant="flat"
                  color={
                    metric.trendColor.includes("success")
                      ? "success"
                      : metric.trendColor.includes("danger")
                        ? "danger"
                        : "primary"
                  }
                  className="font-bold border-none"
                >
                  {metric.trend}
                </Chip>
              </div>
              <div>
                <p className="text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-widest mb-1">
                  {metric.title}
                </p>
                {kpi.isLoading ? (
                  <Skeleton className="h-9 w-32 rounded-lg" />
                ) : (
                  <h2 className="text-3xl font-black dark:text-white tracking-tight">
                    {metric.value}
                  </h2>
                )}
                <p className="text-zinc-400 dark:text-zinc-500 text-[10px] mt-2 font-medium">
                  {metric.description}
                </p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart - Sales Trend */}
        <Card className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between p-6 pb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <MdOutlineTrendingUp className="text-xl text-blue-500" />
              </div>
              <div className="flex flex-col">
                <p className="text-md font-black dark:text-white">
                  Tendencia de Ventas
                </p>
                <p className="text-tiny text-zinc-500 font-medium">
                  Volumen de ventas y recaudación (Últimos 7 días)
                </p>
              </div>
            </div>
            <div className="hidden sm:flex gap-2">
              <Chip size="sm" variant="dot" color="primary">
                Ventas
              </Chip>
              <Chip size="sm" variant="dot" color="success">
                Ingresos
              </Chip>
            </div>
          </CardHeader>
          <CardBody className="p-6 h-87.5">
            {trend.isLoading ? (
              <Skeleton className="w-full h-full rounded-2xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend.data}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e4e4e7"
                    className="dark:stroke-zinc-800"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#71717a" }}
                    dy={10}
                  />
                  <YAxis
                    hide
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#71717a" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0,0,0,0.8)",
                      border: "none",
                      borderRadius: "12px",
                      color: "white",
                      fontSize: "12px",
                    }}
                    itemStyle={{ padding: "0" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorSales)"
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10B981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardBody>
        </Card>

        {/* Inventory Distribution - Pie */}
        <Card className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <CardHeader className="flex gap-3 p-6 pb-2">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <MdDonutLarge className="text-xl text-purple-500" />
            </div>
            <div className="flex flex-col">
              <p className="text-md font-black dark:text-white">
                Valor del Inventario
              </p>
              <p className="text-tiny text-zinc-500 font-medium">
                Distribución por categoría
              </p>
            </div>
          </CardHeader>
          <CardBody className="p-0 flex flex-col items-center justify-center">
            {categoryTop.isLoading ? (
              <Skeleton className="w-48 h-48 rounded-full my-12" />
            ) : (
              <div className="w-full h-62.5">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryTop.data}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {categoryTop.data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-tiny font-bold text-zinc-400 uppercase">
                    Total
                  </p>
                  <p className="text-xl font-black dark:text-white">100%</p>
                </div>
              </div>
            )}
            <div className="w-full px-6 pb-6 mt-4 space-y-2">
              {categoryTop.data.map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs font-medium dark:text-zinc-300">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-xs font-bold dark:text-white">
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Top Selling Products - Bar Chart */}
        <Card className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <CardHeader className="flex gap-3 p-6 pb-2">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <MdBarChart className="text-xl text-amber-500" />
            </div>
            <div className="flex flex-col">
              <p className="text-md font-black dark:text-white">
                Productos con Mayor Rotación
              </p>
              <p className="text-tiny text-zinc-500 font-medium">
                Top 5 productos más vendidos del mes
              </p>
            </div>
          </CardHeader>
          <CardBody className="p-6 h-75">
            {topProducts.isLoading ? (
              <Skeleton className="w-full h-full rounded-2xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topProducts.data}
                  layout="vertical"
                  margin={{ left: 40 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={true}
                    vertical={false}
                    stroke="#e4e4e7"
                    className="dark:stroke-zinc-800"
                  />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#71717a", fontWeight: "bold" }}
                    width={100}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(0,0,0,0.05)" }}
                    contentStyle={{
                      backgroundColor: "rgba(0,0,0,0.8)",
                      border: "none",
                      borderRadius: "12px",
                      color: "white",
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill="#F59E0B"
                    radius={[0, 8, 8, 0]}
                    barSize={32}
                  >
                    {topProducts.data.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          index === 0
                            ? "#F59E0B"
                            : index === 1
                              ? "#FBBF24"
                              : index === 2
                                ? "#FCD34D"
                                : "#FDE68A"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardBody>
        </Card>

        {/* Critical Alerts */}
        <Card className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm self-start">
          <CardHeader className="flex gap-3 p-6 pb-2">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <MdOutlineWarningAmber className="text-xl text-red-500" />
            </div>
            <div className="flex flex-col">
              <p className="text-md font-black dark:text-white">
                Alertas Críticas
              </p>
              <p className="text-tiny text-zinc-500 font-medium">
                Items por debajo del mínimo stock
              </p>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {criticalProducts.data.slice(0, 5).map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-bold dark:text-white tracking-tight">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-tighter">
                      Stock: {item.stock} / Mín: {item.min}
                    </span>
                  </div>
                  <Chip
                    size="sm"
                    variant="flat"
                    color={item.status === "Crítico" ? "danger" : "warning"}
                    className="font-bold border-none h-6"
                  >
                    {item.status}
                  </Chip>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Activity Summary Footer Card */}
      <Card className="bg-linear-to-r from-blue-600 to-indigo-700 dark:from-blue-900 dark:to-indigo-950 border-none shadow-lg text-white">
        <CardBody className="flex flex-col sm:flex-row items-center justify-between p-8 gap-6">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md shadow-inner">
              <MdOutlinePointOfSale className="text-4xl text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black tracking-tight">
                Resumen Global de Actividad
              </h3>
              <p className="text-blue-100 font-medium">
                Se han procesado 84 movimientos de inventario en las últimas 48
                horas.
              </p>
            </div>
          </div>
          <button className="px-8 py-3 bg-white text-blue-700 font-black rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-widest">
            Ver Estadísticas
          </button>
        </CardBody>
      </Card>
    </div>
  );
}
