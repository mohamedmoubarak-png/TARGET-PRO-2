interface Props {
  pct: number;
  color: string;
}

export function ProgressBar({ pct, color }: Props) {
  return (
    <div className="progress">
      <div
        className="progress__fill"
        style={{ width: `${Math.min(pct, 100)}%`, background: color }}
      />
    </div>
  );
}
