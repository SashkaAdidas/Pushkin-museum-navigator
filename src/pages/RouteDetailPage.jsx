import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ROUTES_BY_ID } from '../data/routes.js';
import { HALLS_BY_ID } from '../data/halls.js';
import { XP_RULES } from '../data/game.js';
import { EmptyState, Pill, ProgressBar, SectionTitle } from '../components/ui.jsx';
import { useGame } from '../game/store.jsx';

export default function RouteDetailPage() {
  const { routeId } = useParams();
  const { state, routeStep } = useGame();
  const route = ROUTES_BY_ID.get(routeId);

  const progress = state.routes[routeId] || {};

  // Залы, закрытые по коду, автоматически засчитываются как пройденные шаги маршрута.
  useEffect(() => {
    if (!route) return;
    for (const hallId of route.hallIds) {
      if (state.visited[hallId] && !progress[hallId]) routeStep(route.id, hallId);
    }
  }, [route, state.visited, progress, routeStep]);

  if (!route) {
    return <EmptyState title="Маршрут не найден">Вернитесь к списку маршрутов.</EmptyState>;
  }

  const steps = route.hallIds.map((id) => HALLS_BY_ID.get(id)).filter(Boolean);
  const doneCount = steps.filter((h) => progress[h.id]).length;
  const completed = doneCount === steps.length;
  const nextStep = steps.find((h) => !progress[h.id]);

  return (
    <>
      <nav className="breadcrumbs" aria-label="Хлебные крошки">
        <Link to="/routes">Маршруты</Link>
        <span aria-hidden="true">/</span>
        <span>{route.title}</span>
      </nav>

      <header className="card route-hero" style={{ '--route-color': route.color }}>
        <Pill tone="gold">{route.level}</Pill>
        <h1>{route.title}</h1>
        <p className="route-hero__subtitle">{route.subtitle}</p>
        <p>{route.description}</p>
        <ProgressBar
          value={doneCount / steps.length}
          label={`${doneCount} из ${steps.length} залов`}
        />
        <p className="route-hero__meta">
          ≈ {route.minutes} мин · шаг +{XP_RULES.ROUTE_STEP} XP · финал +{XP_RULES.ROUTE_FINISH} XP
        </p>
        {completed ? (
          <p className="banner banner--ok">Маршрут пройден целиком. Отличный темп!</p>
        ) : nextStep ? (
          <p className="banner">
            Следующая точка: <b>{nextStep.name}</b> (зал {nextStep.number}, {nextStep.floor} этаж)
          </p>
        ) : null}
      </header>

      <SectionTitle kicker="Пошагово" title="Ход маршрута" />

      <ol className="steps">
        {steps.map((hall, index) => {
          const done = Boolean(progress[hall.id]);
          const visited = Boolean(state.visited[hall.id]);
          const isNext = !completed && hall.id === nextStep?.id;
          return (
            <li key={hall.id} className={`step${done ? ' is-done' : ''}${isNext ? ' is-next' : ''}`}>
              <span className="step__index" aria-hidden="true">
                {done ? '✓' : index + 1}
              </span>
              <div className="step__body">
                <Link to={`/halls/${hall.id}`} className="step__title">
                  {hall.name}
                </Link>
                <p className="step__meta">
                  {hall.floor} этаж · зал {hall.number} · ≈ {hall.minutes} мин
                  {visited ? ' · код зала введён' : ''}
                </p>
                {!done && (
                  <button
                    type="button"
                    className="btn btn--ghost btn--sm"
                    onClick={() => routeStep(route.id, hall.id)}
                  >
                    Я здесь, отметить шаг
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </>
  );
}
