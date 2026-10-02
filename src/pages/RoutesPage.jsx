import { Link } from 'react-router-dom';
import { ROUTES } from '../data/routes.js';
import { Pill, SectionTitle } from '../components/ui.jsx';
import { useGame } from '../game/store.jsx';

export default function RoutesPage() {
  const { state } = useGame();

  return (
    <>
      <SectionTitle kicker={ROUTES.length} title="Маршруты-квесты" />
      <p className="text">
        Каждый маршрут — это последовательность залов с таймером и бонусами.
        Выберите по уровню и интересам.
      </p>

      <div className="routes">
        {ROUTES.map((route) => {
          const routes = state.routes[route.id] || {};
          const done = route.hallIds.filter((id) => routes[id]).length;
          const completed = done === route.hallIds.length;
          return (
            <Link key={route.id} to={`/routes/${route.id}`} className={`route-card${completed ? ' is-done' : ''}`}>
              <div className="route-card__head">
                <span className="route-card__color" style={{ background: route.color }} />
                <Pill tone="gold">{route.level}</Pill>
                {completed ? <Pill tone="green">✓</Pill> : null}
              </div>
              <h3>{route.title}</h3>
              <p>{route.subtitle}</p>
              <p>{route.description}</p>
              <div className="route-card__foot">
                <span>≈ {route.minutes} мин</span>
                <span>{route.hallIds.length} залов</span>
                {done > 0 ? <span>пройдено: {done}/{route.hallIds.length}</span> : null}
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
