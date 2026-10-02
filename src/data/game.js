/**
 * Правила геймификации: XP, уровни, бейджи.
 *
 * ВАЖНО: бейджей ровно 5 — и все они достижимы в этой модели,
 * потому что их проверки опираются только на те счётчики,
 * которые реально растут в store (см. computeStats в game/store.jsx).
 */

export const XP_RULES = {
  HALL_VISIT: 40, // зашёл и подтвердил чекпойнт
  FIRST_STEPS_BONUS: 25, // первый зал в игре
  ROUTE_STEP: 15, // шаг маршрута
  ROUTE_FINISH: 80, // маршрут целиком
  QUIZ_CORRECT: 30, // верный ответ
  QUIZ_HINT_COST: 10, // штраф, если взял подсказку
  STREAK_BONUS: 10, // за каждую серию из 3 верных подряд
};

export const LEVELS = [
  { level: 1, title: 'Первый шаг', min: 0, icon: '🎫' },
  { level: 2, title: 'Зритель', min: 120, icon: '👀' },
  { level: 3, title: 'Искатель', min: 320, icon: '🧭' },
  { level: 4, title: 'Ценитель', min: 640, icon: '🏛️' },
  { level: 5, title: 'Хранитель', min: 1100, icon: '🗝️' },
  { level: 6, title: 'Академик', min: 1700, icon: '🎓' },
];

export function levelForXp(xp) {
  let current = LEVELS[0];
  for (const l of LEVELS) if (xp >= l.min) current = l;
  const next = LEVELS.find((l) => l.min > xp) || null;
  const span = next ? next.min - current.min : 1;
  const filled = next ? xp - current.min : 1;
  return {
    ...current,
    next,
    toNext: next ? Math.max(0, next.min - xp) : 0,
    progress: next ? Math.min(1, filled / span) : 1,
  };
}

/**
 * @param {{visited:string[], totalHalls:number, floorDone:Record<number,boolean>,
 *          floorsTouched:number, routesFinished:string[], totalRoutes:number,
 *          quizCorrect:number, totalQuiz:number, bestStreak:number, xp:number}} s
 */
export const BADGES = [
  {
    id: 'first-blood',
    title: 'Первый шаг',
    icon: '🚪',
    hint: 'Подтвердить чекпойнт в любом зале.',
    check: (s) => s.visited.length >= 1,
  },
  {
    id: 'floor-1',
    title: 'Весь первый этаж',
    icon: '🏛️',
    hint: 'Обойти все 14 залов первого этажа.',
    check: (s) => s.floorDone?.[1] === true,
  },
  {
    id: 'floor-2',
    title: 'Весь второй этаж',
    icon: '🖼️',
    hint: 'Обойти все 11 залов второго этажа.',
    check: (s) => s.floorDone?.[2] === true,
  },
  {
    id: 'route-master',
    title: 'По ниточке',
    icon: '🧵',
    hint: 'Пройти любой маршрут от точки до точки.',
    check: (s) => s.routesFinished.length >= 1,
  },
  {
    id: 'quiz-master',
    title: 'Знаток',
    icon: '💡',
    hint: 'Ответить верно на 8 вопросов викторины.',
    check: (s) => s.quizCorrect >= 8,
  },
];

export const TOTAL_BADGES = BADGES.length;

/** Тексты подсказок для «Что дальше?» */
export const QUEST_LOG = [
  { id: 'visit', text: 'Найди свободный зал и подтверди его код на чекпойнте.' },
  { id: 'route', text: 'Открой маршрут и пройди его по ниточке — там XP за каждый шаг.' },
  { id: 'quiz', text: 'Загляни в викторину: 8 верных ответов дают бейдж «Знаток».' },
  { id: 'floor-1', text: 'Первый этаж: 14 залов от египетских ушебти до венецианской живописи.' },
  { id: 'floor-2', text: 'Второй этаж: 11 залов — слепки, галерея и коллекция монет.' },
];
