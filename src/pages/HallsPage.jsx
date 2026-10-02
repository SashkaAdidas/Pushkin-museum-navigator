import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pill, EmptyState, SectionTitle } from '../components/ui.jsx';
import { FLOORS, HALLS } from '../data/halls.js';
import { useGame } from '../game/store.jsx';

const STATUS = [
  { id: 'all', label: 'Все' },
  { id: 'todo', label: 'Не закрыты' },
  { id: 'done', label: 'Закрыты' },
];

export default function HallsPage() {
  const { state } = useGame();
  const [query, setQuery] = useState('');
  const [floor, setFloor] = useState('all');
  const [status, setStatus] = useState('all');

  const halls = useMemo(() => {
    const q = query.trim().toLowerCase();
    return HALLS.filter((hall) => {
      if (floor !== 'all' && String(hall.floor) !== floor) return false;
      const visited = Boolean(state.visited[hall.id]);
      if (status === 'todo' && visited) return false;
      if (status === 'done' && !visited) return false;
      if (!q) return true;
      return (
        hall.name.toLowerCase().includes(q) ||
        hall.tag.toLowerCase().includes(q) ||
        hall.description.toLowerCase().includes(q) ||
        hall.highlights.some((h) => h.toLowerCase().includes(q))
      );
    });
  }, [query, floor, status, state.visited]);

  return (
    <>
      <SectionTitle kicker={`${HALLS.length} залов`} title="Все залы" />

      <div className="filters card">
        <input
          className="input"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск: Рембрандт, мумии, Ван Гог…"
          aria-label="Поиск по залам"
        />

        <div className="filters__row">
          <div className="segmented" role="group" aria-label="Этаж">
            <button
              className={`segmented__btn${floor === 'all' ? ' is-active' : ''}`}
              onClick={() => setFloor('all')}
            >
              Все этажи
            </button>
            {FLOORS.map((f) => (
              <button
                key={f.id}
                className={`segmented__btn${floor === String(f.id) ? ' is-active' : ''}`}
                onClick={() => setFloor(String(f.id))}
              >
                {f.id}
              </button>
            ))}
          </div>

          <div className="segmented" role="group" aria-label="Статус">
            {STATUS.map((s) => (
              <button
                key={s.id}
                className={`segmented__btn${status === s.id ? ' is-active' : ''}`}
                onClick={() => setStatus(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {halls.length === 0 ? (
        <EmptyState title="Ничего не нашлось">
          Попробуйте убрать фильтры — например, искать просто «живопись».
        </EmptyState>
      ) : (
        <div className="list">
          {halls.map((hall) => {
            const visited = Boolean(state.visited[hall.id]);
            return (
              <Link key={hall.id} to={`/halls/${hall.id}`} className={`row${visited ? ' is-done' : ''}`}>
                <span className="row__floor">{hall.floor}</span>
                <span className="row__body">
                  <strong>{hall.name}</strong>
                  <small>
                    зал {hall.number} · {hall.tag} · ≈ {hall.minutes} мин
                  </small>
                </span>
                {visited ? <Pill tone="green">✓</Pill> : <Pill tone="neutral">+20 XP</Pill>}
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
