const priorityConfig: Record<string, { label: string; className: string }> = {
  LOW: {
    label: "Low",
    className: "bg-green-100 text-green-700",
  },
  MEDIUM: {
    label: "Medium",
    className: "bg-yellow-100 text-yellow-700",
  },
  HIGH: {
    label: "High",
    className: "bg-orange-100 text-orange-700",
  },
  URGENT: {
    label: "Urgent",
    className: "bg-red-100 text-red-700",
  },
};

export default function PriorityBadge({ priority }: { priority: string }) {
  const config = priorityConfig[priority] ?? priorityConfig.MEDIUM;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
