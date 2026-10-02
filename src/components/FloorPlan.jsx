import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { HALLS_BY_FLOOR } from '../data/halls.js';
import { useGame } from '../game/store.jsx';

// Виртуальный план 1000×560: координаты переводим в проценты,
// чтобы план тянулся под любую ширину экрана, а текст залов переносился
// средствами CSS (в SVG с переносом строк пришлось бы возиться вручную).
const VIEW_W = 1000;
const VIEW_H = 560;
const PAD = 18;
const GAP = 10;
const TOP = 44;
const BAND = 84; // сквозной коридор

/** Раскладка залов по анфиладе: верхний ряд, коридор, нижний ряд. */
function buildLayout(halls) {
  const topCount = Math.ceil(halls.length / 2);
  const cols = Math.max(topCount, halls.length - topCount, 1);
  const rowH = (VIEW_H - TOP * 2 - BAND) / 2;
  const cellW = (VIEW_W - PAD * 2 - GAP * (cols - 1)) / cols;

  return halls.map((hall, index) => {
    const top = index < topCount;
    const col = top ? index : index - topCount;
    const x = PAD + col * (cellW + GAP);
    const y = top ? TOP : TOP + rowH + BAND;
    return {
      hall,
      style: {
        left: `${(x / VIEW_W) * 100}%`,
        top: `${(y / VIEW_H) * 100}%`,
        width: `${(cellW / VIEW_W) * 100}%`,
        height: `${(rowH / VIEW_H) * 100}%`,
      },
    };
  });
}

export default function FloorPlan({ floor }) {
  const { state } = useGame();
  const halls = useMemo(() => HALLS_BY_FLOOR(floor), [floor]);
  const cells = useMemo(() => buildLayout(halls), [halls]);

  const corridorTop = ((TOP + (VIEW_H - TOP * 2 - BAND) / 2) / VIEW_H) * 100;
  const corridorHeight = (BAND / VIEW_H) * 100;

  return (
    <div className="plan" role="group" aria-label={`План ${floor} этажа`}>
      <div
        className="plan__corridor"
        style={{ top: `${corridorTop}%`, height: `${corridorHeight}%` }}
      >
        <span>сквозной коридор · ориентир — лестница в центре</span>
      </div>

      {cells.map(({ hall, style }) => {
        const visited = Boolean(state.visited[hall.id]);
        return (
          <Link
            key={hall.id}
            to={`/halls/${hall.id}`}
            className={`plan__hall${visited ? ' is-visited' : ''}`}
            style={style}
            aria-label={`Зал ${hall.number}, ${hall.name}${visited ? ', посещён' : ''}`}
          >
            <span className="plan__hall-top">
              <span className="plan__hall-number">{hall.number}</span>
              {visited ? (
                <span className="plan__hall-check" aria-hidden="true">
                  ✓
                </span>
              ) : null}
            </span>
            <span className="plan__hall-name">{hall.short}</span>
            <span className="plan__hall-meta">{hall.minutes} мин</span>
          </Link>
        );
      })}
    </div>
  );
}
