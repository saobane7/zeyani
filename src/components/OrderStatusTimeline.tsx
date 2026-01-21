import { Check, Clock, Package, Truck, Home, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface OrderStatus {
  value: string;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const ORDER_STATUSES: OrderStatus[] = [
  {
    value: "pending",
    label: "En attente",
    description: "Paiement en cours de vérification",
    icon: Clock,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    borderColor: "border-yellow-300",
  },
  {
    value: "paid",
    label: "Payée",
    description: "Paiement confirmé, commande reçue",
    icon: Check,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
    borderColor: "border-emerald-300",
  },
  {
    value: "processing",
    label: "En préparation",
    description: "Votre commande est en cours de préparation",
    icon: Package,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-300",
  },
  {
    value: "shipped",
    label: "Expédiée",
    description: "Votre colis est en route",
    icon: Truck,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    borderColor: "border-purple-300",
  },
  {
    value: "completed",
    label: "Livrée",
    description: "Commande livrée avec succès",
    icon: Home,
    color: "text-green-600",
    bgColor: "bg-green-100",
    borderColor: "border-green-300",
  },
  {
    value: "cancelled",
    label: "Annulée",
    description: "Commande annulée",
    icon: X,
    color: "text-red-600",
    bgColor: "bg-red-100",
    borderColor: "border-red-300",
  },
];

export const getStatusConfig = (statusValue: string): OrderStatus => {
  return (
    ORDER_STATUSES.find((s) => s.value === statusValue) || {
      value: statusValue,
      label: statusValue,
      description: "",
      icon: Clock,
      color: "text-gray-600",
      bgColor: "bg-gray-100",
      borderColor: "border-gray-300",
    }
  );
};

interface OrderStatusTimelineProps {
  currentStatus: string;
  showLabels?: boolean;
  compact?: boolean;
}

export const OrderStatusTimeline = ({
  currentStatus,
  showLabels = true,
  compact = false,
}: OrderStatusTimelineProps) => {
  // Filter out cancelled for timeline progression
  const progressStatuses = ORDER_STATUSES.filter((s) => s.value !== "cancelled");
  const currentIndex = progressStatuses.findIndex((s) => s.value === currentStatus);
  const isCancelled = currentStatus === "cancelled";

  if (isCancelled) {
    const cancelledStatus = getStatusConfig("cancelled");
    const CancelledIcon = cancelledStatus.icon;
    return (
      <div className={cn("flex items-center gap-3 p-3 rounded-lg", cancelledStatus.bgColor, cancelledStatus.borderColor, "border")}>
        <div className={cn("p-2 rounded-full", cancelledStatus.bgColor)}>
          <CancelledIcon className={cn("h-5 w-5", cancelledStatus.color)} />
        </div>
        <div>
          <p className={cn("font-medium", cancelledStatus.color)}>{cancelledStatus.label}</p>
          <p className="text-sm text-muted-foreground">{cancelledStatus.description}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full", compact ? "py-2" : "py-4")}>
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-muted mx-8">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{
              width: currentIndex >= 0 ? `${(currentIndex / (progressStatuses.length - 1)) * 100}%` : "0%",
            }}
          />
        </div>

        {/* Status circles */}
        {progressStatuses.map((status, index) => {
          const StatusIcon = status.icon;
          const isPast = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isFuture = index > currentIndex;

          return (
            <div key={status.value} className="flex flex-col items-center z-10">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                  isPast && "bg-primary border-primary text-primary-foreground",
                  isCurrent && cn(status.bgColor, status.borderColor, status.color),
                  isFuture && "bg-background border-muted-foreground/30 text-muted-foreground/50"
                )}
              >
                <StatusIcon className="h-5 w-5" />
              </div>
              {showLabels && (
                <div className="mt-2 text-center">
                  <p
                    className={cn(
                      "text-xs font-medium",
                      isPast && "text-primary",
                      isCurrent && status.color,
                      isFuture && "text-muted-foreground/50"
                    )}
                  >
                    {status.label}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Current status description */}
      {currentIndex >= 0 && (
        <div className="mt-4 text-center">
          <p className={cn("text-sm", progressStatuses[currentIndex].color)}>
            {progressStatuses[currentIndex].description}
          </p>
        </div>
      )}
    </div>
  );
};

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md" | "lg";
}

export const StatusBadge = ({ status, size = "md" }: StatusBadgeProps) => {
  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium border",
        config.bgColor,
        config.color,
        config.borderColor,
        size === "sm" && "px-2 py-0.5 text-xs",
        size === "md" && "px-3 py-1 text-sm",
        size === "lg" && "px-4 py-1.5 text-base"
      )}
    >
      <Icon className={cn(size === "sm" ? "h-3 w-3" : size === "md" ? "h-4 w-4" : "h-5 w-5")} />
      {config.label}
    </span>
  );
};
