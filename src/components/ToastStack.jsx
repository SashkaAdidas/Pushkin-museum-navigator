import { useGame } from '../game/store.jsx';

export default function ToastStack() {
  const { toasts, dismissToast } = useGame();
  if (!toasts.length) return null;

  return (
    <div className="toasts" role="status" aria-live="polite">
      {toasts.map((t) => (
        <button key={t.id} type="button" className={`toast toast--${t.kind}`} onClick={() => dismissToast(t.id)}>
          <span className="toast__icon" aria-hidden="true">
            {t.icon}
          </span>
          <span className="toast__body">
            <span className="toast__title">{t.title}</span>
            {t.xp ? <span className="toast__xp">+{t.xp} XP</span> : null}
          </span>
        </button>
      ))}
    </div>
  );
}
