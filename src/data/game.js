/**
 * Правила геймификации: XP, уровни, бейджи.
 *
 * ВАЖНО: бейджей ровно 5 — и все они достижимы в этой модели,
 * потому что их проверки опираются только на те счётчики,
 * которые реально растут в store (см. computeStats в game/store.jsx).
 */

import { HALLS } from './halls.js';
import { QUIZ } from './quiz.js';

export const XP_RULES = {
  HALL_VISIT: 40, // зашёл и подтвердил чекпойнт
  FIRST_STEPS_BONUS: 25, // первый зал в игре
  ROUTE_STEP: 15, // шаг маршрута
  ROUTE_FINISH: 80, // маршрут целиком
  QUIZ_CORRECT: 30, // верный ответ
  QUIZ_HINT_COST: 10, // штраф, если взял подсказку
};

/** Сколько залов на этаже — берём из halls.js, чтобы текст не устаревал. */
const hallsOn = (floor) => HALLS.filter((h) => h.floor === floor).length;

/**
 * Цель бейджа «Знаток». Одно число и для проверки, и для подсказки —
 * иначе подсказка начнёт обещать не то, что реально требует проверка.
 */
export const QUIZ_BADGE_TARGET = Math.min(8, QUIZ.length);

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
    hint: `Обойти все ${hallsOn(1)} залов первого этажа.`,
    check: (s) => s.floorDone?.[1] === true,
  },
  {
    id: 'floor-2',
    title: 'Весь второй этаж',
    icon: '🖼️',
    hint: `Обойти все ${hallsOn(2)} залов второго этажа.`,
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
    hint: `Ответить верно на ${QUIZ_BADGE_TARGET} вопросов из ${QUIZ.length}.`,
    check: (s) => s.quizCorrect >= QUIZ_BADGE_TARGET,
  },
];

export const TOTAL_BADGES = BADGES.length;

/** Тексты подсказок для «Что дальше?» */
export const QUEST_LOG = [
  { id: 'visit', text: 'Найди свободный зал и подтверди его код на чекпойнте.' },
  { id: 'route', text: 'Открой маршрут и пройди его по ниточке — там XP за каждый шаг.' },
  {
    id: 'quiz',
    text: `Загляни в викторину: ${QUIZ_BADGE_TARGET} верных ответов дают бейдж «Знаток».`,
  },
  {
    id: 'floor-1',
    text: `Первый этаж: ${hallsOn(1)} залов от египетских ушебти до венецианской живописи.`,
  },
  { id: 'floor-2', text: `Второй этаж: ${hallsOn(2)} залов — слепки, галерея и коллекция монет.` },
];
