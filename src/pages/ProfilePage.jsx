import { useState } from 'react';
import { Pill, ProgressBar, SectionTitle } from '../components/ui.jsx';
import { BADGES, LEVELS } from '../data/game.js';
import { useGame } from '../game/store.jsx';

export default function ProfilePage() {
  const { state, stats, level, resetProgress } = useGame();
  const [confirming, setConfirming] = useState(false);

  const earnedCount = Object.keys(state.badges).length;

  return (
    <>
      <header className="card">
        <div className="profile-header">
          <div className="profile-header__avatar" aria-hidden="true">
            {level.level}
          </div>
          <div className="profile-header__info">
            <h1>{level.title}</h1>
            <p className="text">{level.note}</p>
          </div>
          <Pill tone="gold">{state.xp} XP</Pill>
        </div>

        <ProgressBar
          value={level.progress}
          label={
            level.next
              ? `${level.remaining} XP до уровня «${level.next.title}»`
              : 'Достигнут максимальный уровень'
          }
        />
      </header>

      <SectionTitle kicker="Прогресс" title="Статистика визита" />

      <div className="stats-grid">
        <div className="stat">
          <strong>
            {stats.visited.length}
            <small>/{stats.totalHalls}</small>
          </strong>
          <span>залов закрыто</span>
        </div>
        <div className="stat">
          <strong>
            {stats.quizCorrect}
            <small>/{stats.totalQuiz}</small>
          </strong>
          <span>верных ответов</span>
        </div>
        <div className="stat">
          <strong>
            {stats.routesFinished.length}
            <small>/{stats.totalRoutes}</small>
          </strong>
          <span>маршрутов пройдено</span>
        </div>
        <div className="stat">
          <strong>{stats.bestStreak}</strong>
          <span>лучшая серия ответов</span>
        </div>
      </div>

      <SectionTitle
        kicker={`${earnedCount} из ${BADGES.length}`}
        title="Бейджи"
        action={<Pill tone="neutral">+30 XP за каждый</Pill>}
      />

      <div className="badges">
        {BADGES.map((badge) => {
          const earnedAt = state.badges[badge.id];
          return (
            <div
              key={badge.id}
              className={`badge${earnedAt ? ' badge--earned' : ''}`}
              title={badge.desc}
            >
              <span className="badge__icon" aria-hidden="true">
                {badge.icon}
              </span>
              <strong>{badge.title}</strong>
              <small>{badge.desc}</small>
              {earnedAt ? (
                <span className="badge__date">
                  {new Date(earnedAt).toLocaleDateString('ru-RU')}
                </span>
              ) : (
                <span className="badge__date">ещё не получен</span>
              )}
            </div>
          );
        })}
      </div>

      <SectionTitle kicker="Как устроено" title="Уровни" />

      <ol className="levels">
        {LEVELS.map((l) => {
          const reached = state.xp >= l.xp;
          const isCurrent = l.level === level.level;
          return (
            <li
              key={l.level}
              className={`level${reached ? ' is-reached' : ''}${isCurrent ? ' is-current' : ''}`}
            >
              <span className="level__num">{l.level}</span>
              <span className="level__body">
                <strong>{l.title}</strong>
                <small>{l.note}</small>
              </span>
              <span className="level__xp">{l.xp} XP</span>
            </li>
          );
        })}
      </ol>

      <SectionTitle kicker="Осторожно" title="Сброс" />

      <div className="card danger-zone">
        <p className="text">
          Прогресс хранится только в этом браузере. Сброс удалит все закрытые залы, бейджи и очки.
        </p>
        {confirming ? (
          <div className="danger-zone__confirm">
            <span>Удалить весь прогресс?</span>
            <button
              type="button"
              className="btn btn--danger btn--sm"
              onClick={() => {
                resetProgress();
                setConfirming(false);
              }}
            >
              Да, сбросить
            </button>
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => setConfirming(false)}>
              Отмена
            </button>
          </div>
        ) : (
          <button type="button" className="btn btn--ghost" onClick={() => setConfirming(true)}>
            Сбросить прогресс
          </button>
        )}
      </div>

      <p className="notice">
        Данные о залах демонстрационные. Чтобы подставить актуальную схему музея, отредактируйте{' '}
        <code>src/data/halls.js</code>.
      </p>
    </>
  );
}
