import { Card, CardBody, Chip, Skeleton } from "@heroui/react";
import { type ReactNode } from "react";
import { motion } from "motion/react";

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color?: "primary" | "success" | "warning" | "danger" | "secondary";
  description?: string;
  isLoading?: boolean;
  trend?: string;
  trendColor?:
    | "success"
    | "danger"
    | "warning"
    | "primary"
    | "secondary"
    | "default";
}

const colorMap = {
  primary:
    "from-blue-500/10 to-indigo-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  success:
    "from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  warning:
    "from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  danger:
    "from-rose-500/10 to-red-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800",
  secondary:
    "from-purple-500/10 to-violet-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800",
};

export default function KpiCard({
  title,
  value,
  icon,
  color = "primary",
  description,
  isLoading = false,
  trend,
  trendColor = "primary",
}: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
    >
      <Card
        className={`border shadow-sm hover:shadow-md transition-all duration-300 w-full bg-linear-to-br ${colorMap[color]}`}
        isPressable
      >
        <CardBody className="p-5 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div
              className={`p-3 rounded-xl bg-white dark:bg-zinc-900 shadow-sm`}
            >
              {isLoading ? (
                <Skeleton className="w-6 h-6 rounded-lg" />
              ) : (
                <div className="text-2xl">{icon}</div>
              )}
            </div>
            {trend && !isLoading && (
              <Chip
                size="sm"
                variant="flat"
                color={trendColor}
                className="font-bold border-none"
              >
                {trend}
              </Chip>
            )}
          </div>
          <div className="flex flex-col flex-1">
            <p className="text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider">
              {title}
            </p>
            {isLoading ? (
              <Skeleton className="h-8 w-24 mt-1 rounded-lg" />
            ) : (
              <h3 className="text-2xl font-black mt-0.5">{value}</h3>
            )}
            {description && !isLoading && (
              <p className="text-zinc-500 dark:text-zinc-400 text-[10px] mt-2 font-medium">
                {description}
              </p>
            )}
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
