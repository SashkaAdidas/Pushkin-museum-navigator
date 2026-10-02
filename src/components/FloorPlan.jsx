import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { HALLS_BY_FLOOR } from '../data/halls.js';
import { useGame } from '../game/store.jsx';

// Виртуальный холст 1200×620: координаты залов переводим в проценты, чтобы
// план тянулся под любую ширину, а текст переносился средствами CSS
// (в SVG с переносом строк пришлось бы возиться вручную).
//
// Геометрия фиксированная, ряды не «резинятся» под число залов: иначе на
// трёх залоде ряды разъехались бы, а на семи — слиплись.
const VIEW_W = 1200;
const VIEW_H = 620;
const PAD = 24;
const GAP = 12;
const HINT_H = 40; // полоса подсказки сверху
const ROW_TOP = HINT_H + 20; // 60
const ROW_H = 190;
const BAND = 80; // зазор под сквозной коридор

/** Раскладка залов по анфиладе: верхний ряд, коридор, нижний ряд. */
function buildLayout(halls) {
  const topCount = Math.ceil(halls.length / 2);
  const cols = Math.max(topCount, halls.length - topCount, 1);
  const cellW = (VIEW_W - PAD * 2 - GAP * (cols - 1)) / cols;

  return halls.map((hall, index) => {
    const top = index < topCount;
    const col = top ? index : index - topCount;
    const x = PAD + col * (cellW + GAP);
    const y = top ? ROW_TOP : ROW_TOP + ROW_H + BAND;
    return {
      hall,
      style: {
        left: `${(x / VIEW_W) * 100}%`,
        top: `${(y / VIEW_H) * 100}%`,
        width: `${(cellW / VIEW_W) * 100}%`,
        height: `${(ROW_H / VIEW_H) * 100}%`,
      },
    };
  });
}

/** Полоса сквозного коридора — ровно посередине между рядами. */
const CORRIDOR = {
  top: ((ROW_TOP + ROW_H + (BAND - 56) / 2) / VIEW_H) * 100,
  height: (56 / VIEW_H) * 100,
};

/** Подсказка про лестницу — над верхним рядом, вровень с краями залов. */
const HINT = {
  top: 0,
  height: (HINT_H / VIEW_H) * 100,
  left: `${(PAD / VIEW_W) * 100}%`,
  width: `${((VIEW_W - PAD * 2) / VIEW_W) * 100}%`,
};

const NO_DIM = new Set();

/**
 * План этажа.
 * @param {number} floor
 * @param {Set<string>} [dimIds] — залы, отфильтрованные текущим фильтром.
 *   Не удаляем их из DOM, а затемняем: плитки расставлены абсолютно, и
 *   удаление оставило бы дыры в анфиладе — план потерял бы пространственный смысл.
 */
export default function FloorPlan({ floor, dimIds = NO_DIM }) {
  const { state } = useGame();
  const halls = useMemo(() => HALLS_BY_FLOOR(floor), [floor]);
  const cells = useMemo(() => buildLayout(halls), [halls]);

  return (
    <div className="plan" role="group" aria-label={`План ${floor} этажа`}>
      <div className="plan__hint" style={HINT}>
        <span>вход по главной лестнице · залы обходят анфиладу</span>
      </div>
      <div
        className="plan__corridor"
        style={{ top: `${CORRIDOR.top}%`, height: `${CORRIDOR.height}%` }}
      >
        <span>сквозной коридор · ориентир — лестница в центре</span>
      </div>

      {cells.map(({ hall, style }) => {
        const visited = state.visited[hall.id];
        const dim = dimIds.has(hall.id);

        return (
          <Link
            key={hall.id}
            to={`/halls/${hall.id}`}
            className={`plan__hall${visited ? ' is-visited' : ''}${dim ? ' is-dim' : ''}`}
            style={style}
            tabIndex={dim ? -1 : undefined}
            aria-hidden={dim || undefined}
            aria-label={`Зал ${hall.number}: ${hall.name}${visited ? ', пройден' : ''}`}
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
