interface TagChipProps {
  tag: string;
  active?: boolean;
  onClick?: () => void;
}

export default function TagChip({ tag, active = false, onClick }: TagChipProps) {
  const Tag = onClick ? "button" : "span";
  return (
    <Tag
      onClick={onClick}
      className={[
        "font-mono text-[11px] px-2 py-0.5 border tracking-[0.1em] uppercase transition-colors duration-150",
        active
          ? "border-amber text-amber"
          : "border-border text-muted",
        onClick ? "cursor-pointer hover:border-amber-dim hover:text-amber-dim" : "",
      ].join(" ")}
    >
      {tag}
    </Tag>
  );
}
