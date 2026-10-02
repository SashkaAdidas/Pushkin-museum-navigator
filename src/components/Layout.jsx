import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useGame } from '../game/store.jsx';
import ToastStack from './ToastStack.jsx';

const NAV = [
  { to: '/', label: 'Карта', icon: '▦' },
  { to: '/halls', label: 'Залы', icon: '▤' },
  { to: '/routes', label: 'Маршруты', icon: '➤' },
  { to: '/quiz', label: 'Викторина', icon: '?' },
  { to: '/profile', label: 'Я', icon: '☺' },
];

export default function Layout() {
  const { state, level, stats } = useGame();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar__brand">
          <span className="topbar__mark" aria-hidden="true">
            Π
          </span>
          <span>
            Пушкинский
            <small>навигатор посетителя</small>
          </span>
        </div>

        <div className="topbar__player">
          <div className="player__level">
            <strong>{level.title}</strong>
            <span>{state.xp} XP</span>
          </div>
          <div
            className="player__bar"
            role="progressbar"
            aria-valuenow={Math.round(level.progress * 100)}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-label="Прогресс до следующего уровня"
          >
            <i style={{ width: `${level.progress * 100}%` }} />
          </div>
          <div className="player__meta">
            {level.next ? `${level.remaining} XP до «${level.next.title}»` : 'Максимальный уровень'}
            {' · '}
            залов {stats.visited.length}/{stats.totalHalls}
          </div>
        </div>
      </header>

      <main className="page">
        <Outlet />
      </main>

      <nav className="tabbar" aria-label="Основная навигация">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `tab${isActive ? ' tab--active' : ''}`}
          >
            <span className="tab__icon" aria-hidden="true">
              {item.icon}
            </span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <ToastStack />
    </div>
  );
}
