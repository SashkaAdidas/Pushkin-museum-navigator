import { useParams, Link } from 'react-router-dom';
import { Pill, EmptyState, SectionTitle } from '../components/ui.jsx';
import { HALLS_BY_ID } from '../data/halls.js';
import { XP_RULES } from '../data/game.js';
import { useGame } from '../game/store.jsx';
import CheckpointForm from '../components/CheckpointForm.jsx';
import HallQuiz from '../components/HallQuiz.jsx';

export default function HallPage() {
  const { hallId } = useParams();
  const { state } = useGame();
  const hall = HALLS_BY_ID.get(hallId);

  if (!hall) {
    return (
      <EmptyState title="Зал не найден">
        Проверьте ссылку — зала с таким идентификатором не существует.
      </EmptyState>
    );
  }

  const visited = Boolean(state.visited[hall.id]);
  const nearby = hall.nearby
    .map((id) => HALLS_BY_ID.get(id))
    .filter(Boolean)
    .map((h) => (
      <Link key={h.id} to={`/halls/${h.id}`} className="tag">
        {h.name}
      </Link>
    ));

  return (
    <>
      <nav className="breadcrumbs" aria-label="Хлебные крошки">
        <Link to="/halls">Все залы</Link>
        <span aria-hidden="true">/</span>
        <span>
          {hall.number} · {hall.name}
        </span>
      </nav>

      <header className="card">
        <div className="hall-header">
          <Pill tone={visited ? 'green' : 'gold'}>
            {visited ? '✓ Зал закрыт' : `+${XP_RULES.HALL_VISIT} XP · ${hall.tag}`}
          </Pill>
          <small className="hall-header__meta">
            {hall.floor} этаж · зал {hall.number} · ≈ {hall.minutes} мин
          </small>
        </div>
        <h1>{hall.name}</h1>
        <p>{hall.description}</p>

        <CheckpointForm hall={hall} />
      </header>

      {hall.highlights.length > 0 && (
        <SectionTitle kicker="Что посмотреть" title="Шедевры зала" />
      )}
      <ul className="list">
        {hall.highlights.map((hl, i) => (
          <li key={i} className="row">
            <span className="row__body">
              <strong>{hl}</strong>
            </span>
          </li>
        ))}
      </ul>

      {nearby.length > 0 && (
        <SectionTitle kicker="Рядом" title="Соседние залы" />
      )}
      <div className="tags">{nearby}</div>

      <SectionTitle kicker="Убедитесь, что запомнили" title="Викторина" />
      <HallQuiz hall={hall} />
    </>
  );
}
