type Status = "active" | "archived" | "stealth";

const STATUS_STYLES: Record<Status, string> = {
  active: "text-amber-dim border-amber",
  archived: "text-muted border-border",
  stealth: "text-terra border-terra",
};

const STATUS_LABELS: Record<Status, string> = {
  active: "active",
  archived: "archived",
  stealth: "stealth",
};

interface StatusBadgeProps {
  status: Status;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={[
        "font-mono text-[10px] px-2 py-0.5 border tracking-[0.15em] uppercase",
        STATUS_STYLES[status],
      ].join(" ")}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
