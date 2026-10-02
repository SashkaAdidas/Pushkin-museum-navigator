import { useState } from 'react';
import { Link } from 'react-router-dom';
import FloorPlan from '../components/FloorPlan.jsx';
import { Pill, ProgressBar, SectionTitle } from '../components/ui.jsx';
import { FLOORS, HALLS_BY_FLOOR } from '../data/halls.js';
import { useGame } from '../game/store.jsx';

export default function MapPage() {
  const { state, stats, level } = useGame();
  const [floor, setFloor] = useState(() => {
    const open = FLOORS.find((f) =>
      HALLS_BY_FLOOR(f.id).some((h) => !state.visited[h.id]),
    );
    return (open || FLOORS[0]).id;
  });

  const halls = HALLS_BY_FLOOR(floor);
  const doneOnFloor = halls.filter((h) => state.visited[h.id]).length;

  // Фильтр по статусу. Плитку на плане не убираем из DOM, а затемняем:
  // залы расставлены абсолютно, удаление оставило бы дыры в анфиладе.
  const [show, setShow] = useState({ todo: true, done: true });
  const toggle = (key) => setShow((s) => ({ ...s, [key]: !s[key] }));
  const isDone = (hall) => Boolean(state.visited[hall.id]);

  const dimIds = new Set(halls.filter((h) => !show[isDone(h) ? 'done' : 'todo']).map((h) => h.id));
  const shownHalls = halls.filter((h) => show[isDone(h) ? 'done' : 'todo']);
  const todoOnFloor = halls.length - doneOnFloor;

  return (
    <>
      <section className="hero card">
        <p className="hero__kicker">{level.note}</p>
        <h1 className="hero__title">
          {stats.visited.length === 0
            ? 'Начните с первого зала'
            : `Вы закрыли ${stats.visited.length} из ${stats.totalHalls} залов`}
        </h1>
        <p className="hero__text">
          Найдите в зале табличку с кодом, введите его — зал закроется, а вы получите опыт,
          бейджи и открытку с репродукцией.
        </p>
        <div className="hero__actions">
          <Link className="btn btn--primary" to="/routes">
            Взять готовый маршрут
          </Link>
          <Link className="btn" to="/halls">
            Все залы
          </Link>
        </div>
        <ProgressBar
          value={stats.visited.length / stats.totalHalls}
          label={`${state.xp} XP · ${level.title}`}
        />
      </section>

      <SectionTitle kicker="Навигация" title="План этажей" />

      <div className="tabs" role="tablist" aria-label="Этажи">
        {FLOORS.map((f) => {
          const total = HALLS_BY_FLOOR(f.id).length;
          const done = HALLS_BY_FLOOR(f.id).filter((h) => state.visited[h.id]).length;
          return (
            <button
              key={f.id}
              role="tab"
              aria-selected={floor === f.id}
              className={`tabs__item${floor === f.id ? ' is-active' : ''}`}
              onClick={() => setFloor(f.id)}
            >
              <strong>{f.name}</strong>
              <small>{f.subtitle}</small>
              <span className="tabs__count">
                {done}/{total}
              </span>
            </button>
          );
        })}
      </div>

      <div className="card plan-card">
        <FloorPlan floor={floor} dimIds={dimIds} />
        <div className="legend" role="group" aria-label="Фильтр залов на плане">
          <label className={`legend__item${show.todo ? ' is-selected' : ' is-off'}`}>
            <input
              type="checkbox"
              className="legend__check"
              checked={show.todo}
              onChange={() => toggle('todo')}
            />
            <i className="legend__swatch legend__swatch--todo" aria-hidden="true" />
            <span className="legend__text">
              не посещён<b className="legend__count">{todoOnFloor}</b>
            </span>
          </label>
          <label className={`legend__item${show.done ? ' is-selected' : ' is-off'}`}>
            <input
              type="checkbox"
              className="legend__check"
              checked={show.done}
              onChange={() => toggle('done')}
            />
            <i className="legend__swatch legend__swatch--done" aria-hidden="true" />
            <span className="legend__text">
              пройден по коду<b className="legend__count">{doneOnFloor}</b>
            </span>
          </label>
          {dimIds.size > 0 ? (
            <button type="button" className="legend__reset" onClick={() => setShow({ todo: true, done: true })}>
              Показать все
            </button>
          ) : (
            <span className="legend__hint">Нажмите на зал, чтобы открыть карточку</span>
          )}
        </div>
      </div>

      <SectionTitle
        kicker={`${doneOnFloor} из ${halls.length}`}
        title={`Залы ${floor} этажа`}
        action={<Pill tone="gold">{Math.round((doneOnFloor / halls.length) * 100)}%</Pill>}
      />

      <div className="hall-grid">
        {shownHalls.length === 0 ? (
          <p className="legend__empty">
            Нет залов, подходящих под фильтр.
            <br />
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => setShow({ todo: true, done: true })}>
              Показать все
            </button>
          </p>
        ) : (
          shownHalls.map((hall) => {
            const visited = isDone(hall);
            return (
            <Link key={hall.id} to={`/halls/${hall.id}`} className={`hall-card${visited ? ' is-done' : ''}`}>
              <div className="hall-card__head">
                <span className="hall-card__number">зал {hall.number}</span>
                <Pill tone={visited ? 'green' : 'neutral'}>{visited ? 'закрыт' : hall.tag}</Pill>
              </div>
              <h3>{hall.name}</h3>
              <p>{hall.description}</p>
              <div className="hall-card__foot">
                <span>≈ {hall.minutes} мин</span>
                <span>{hall.highlights.length} шедевра</span>
              </div>
            </Link>
            );
          })
        )}
      </div>

      <p className="notice">
        Номера и расположение залов в этом прототипе условны — подставьте актуальную схему
        музея в файле <code>src/data/halls.js</code>.
      </p>
    </>
  );
}
