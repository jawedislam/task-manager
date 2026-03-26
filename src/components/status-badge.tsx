const statusConfig: Record<string, { label: string; className: string }> = {
  OPEN: {
    label: "Open",
    className: "bg-blue-100 text-blue-700",
  },
  IN_PROGRESS: {
    label: "In Progress",
    className: "bg-yellow-100 text-yellow-700",
  },
  CLOSED: {
    label: "Closed",
    className: "bg-green-100 text-green-700",
  },
};

export default function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] ?? statusConfig.OPEN;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
