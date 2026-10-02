// Игровая конфигурация: уровни, бейджи, награды.

export const XP_RULES = {
  HALL_VISIT: 20, // зал закрыт по чекпойнт-коду
  ROUTE_STEP: 10, // шаг маршрута
  ROUTE_FINISH: 60, // маршрут пройден целиком
  QUIZ_CORRECT: 15,
  QUIZ_HINT_COST: 5,
  FIRST_STEPS_BONUS: 25, // приветственный бонус за первый закрытый зал
};

export const LEVELS = [
  { level: 1, title: 'Зритель', xp: 0, note: 'Вы вошли в главное здание' },
  { level: 2, title: 'Посетитель', xp: 60, note: 'Первые три зала позади' },
  { level: 3, title: 'Любознательный', xp: 150, note: 'Вы уже знаете, где что лежит' },
  { level: 4, title: 'Знаток этажа', xp: 280, note: 'Уверенно двигаетесь между экспозициями' },
  { level: 5, title: 'Хранитель маршрутов', xp: 450, note: 'Вы проходите маршруты целиком' },
  { level: 6, title: 'Собиратель залов', xp: 650, note: 'Почти вся навигация вам открыта' },
  { level: 7, title: 'Пушкинист', xp: 900, note: 'Максимальная глубина погружения' },
];

export const BADGES = [
  {
    id: 'first-step',
    title: 'Первый шаг',
    icon: '👣',
    desc: 'Закрыть первый зал по чекпойнт-коду',
    check: (s) => s.visited.length >= 1,
  },
  {
    id: 'five-halls',
    title: 'Пять залов',
    icon: '🚪',
    desc: 'Закрыть пять залов',
    check: (s) => s.visited.length >= 5,
  },
  {
    id: 'half-way',
    title: 'Половина музея',
    icon: '🧭',
    desc: 'Закрыть половину всех залов',
    check: (s) => s.visited.length >= Math.ceil(s.totalHalls / 2),
  },
  {
    id: 'full-museum',
    title: 'Весь музей',
    icon: '🏛️',
    desc: 'Закрыть все залы главной экспозиции',
    check: (s) => s.visited.length >= s.totalHalls,
  },
  {
    id: 'floor-master-1',
    title: 'Хозяин античности',
    icon: '🏺',
    desc: 'Все залы 1 этажа',
    check: (s) => s.floorDone[1],
  },
  {
    id: 'floor-master-2',
    title: 'Хозяин старой живописи',
    icon: '🖼️',
    desc: 'Все залы 2 этажа',
    check: (s) => s.floorDone[2],
  },
  {
    id: 'floor-master-3',
    title: 'Хозяин импрессионистов',
    icon: '🎨',
    desc: 'Все залы 3 этажа',
    check: (s) => s.floorDone[3],
  },
  {
    id: 'route-first',
    title: 'Первый маршрут',
    icon: '🧵',
    desc: 'Пройти любой маршрут до конца',
    check: (s) => s.routesFinished.length >= 1,
  },
  {
    id: 'route-all',
    title: 'Куратор выходного дня',
    icon: '🗺️',
    desc: 'Пройти все маршруты до конца',
    check: (s) => s.routesFinished.length >= s.totalRoutes,
  },
  {
    id: 'quiz-first',
    title: 'Первый ответ',
    icon: '💡',
    desc: 'Ответить верно на первый вопрос',
    check: (s) => s.quizCorrect >= 1,
  },
  {
    id: 'quiz-streak',
    title: 'Пять подряд',
    icon: '🔥',
    desc: 'Пять верных ответов подряд',
    check: (s) => s.bestStreak >= 5,
  },
  {
    id: 'quiz-perfect',
    title: 'Без промахов',
    icon: '🎯',
    desc: 'Верно ответить на все вопросы викторины',
    check: (s) => s.quizCorrect >= s.totalQuiz,
  },
  {
    id: 'scholar',
    title: 'Сотня очков',
    icon: '⭐',
    desc: 'Набрать 100 XP',
    check: (s) => s.xp >= 100,
  },
  {
    id: 'collector',
    title: 'Четыре этажа',
    icon: '🪜',
    desc: 'Побывать хотя бы по одному залу на каждом этаже',
    check: (s) => s.floorsTouched >= 4,
  },
];

export function levelForXp(xp) {
  let current = LEVELS[0];
  for (const l of LEVELS) if (xp >= l.xp) current = l;
  const next = LEVELS.find((l) => l.xp > xp) || null;
  const span = next ? next.xp - current.xp : 1;
  const into = next ? xp - current.xp : 1;
  return {
    ...current,
    next,
    remaining: next ? next.xp - xp : 0,
    progress: next ? Math.min(1, into / span) : 1,
  };
}
