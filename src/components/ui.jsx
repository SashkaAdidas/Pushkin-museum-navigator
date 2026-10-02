export function ProgressBar({ value, label, tone = 'gold' }) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <div className="progress">
      <div
        className={`progress__track progress__track--${tone}`}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label={label}
      >
        <i style={{ width: `${pct}%` }} />
      </div>
      {label ? (
        <span className="progress__label">
          {label} · {pct}%
        </span>
      ) : null}
    </div>
  );
}

export function Pill({ children, tone = 'neutral' }) {
  return <span className={`pill pill--${tone}`}>{children}</span>;
}

export function EmptyState({ title, children }) {
  return (
    <div className="empty">
      <p className="empty__title">{title}</p>
      {children ? <p className="empty__text">{children}</p> : null}
    </div>
  );
}

export function SectionTitle({ kicker, title, action }) {
  return (
    <div className="section-title">
      <div>
        {kicker ? <span className="section-title__kicker">{kicker}</span> : null}
        <h2>{title}</h2>
      </div>
      {action}
    </div>
  );
}
