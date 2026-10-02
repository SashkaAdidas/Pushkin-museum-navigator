import { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { HALLS, HALLS_BY_ID, FLOORS } from '../data/halls.js';
import { ROUTES } from '../data/routes.js';
import { QUIZ } from '../data/quiz.js';
import { BADGES, XP_RULES, levelForXp } from '../data/game.js';

const STORAGE_KEY = 'pushkin-navigator:v1';
export const BADGE_XP = 30;

const EMPTY = {
  xp: 0,
  visited: {}, // hallId -> ISO date
  routes: {}, // routeId -> { hallId: true }
  quiz: {}, // questionId -> { correct, usedHint }
  streak: 0,
  bestStreak: 0,
  badges: {}, // badgeId -> ISO date
  seenIntro: false,
};

function load() {
  if (typeof window === 'undefined') return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw);
    return { ...EMPTY, ...parsed };
  } catch {
    return EMPTY;
  }
}

/** Итоговая статистика игрока — из неё проверяются бейджи. */
export function computeStats(state) {
  const visitedIds = Object.keys(state.visited);
  const floorDone = {};
  for (const floor of FLOORS) {
    const onFloor = HALLS.filter((h) => h.floor === floor.id);
    floorDone[floor.id] = onFloor.length > 0 && onFloor.every((h) => state.visited[h.id]);
  }
  const floorsTouched = new Set(
    visitedIds.map((id) => HALLS_BY_ID.get(id)?.floor).filter(Boolean),
  ).size;

  const routesFinished = ROUTES.filter((r) =>
    r.hallIds.every((id) => state.routes[r.id]?.[id]),
  ).map((r) => r.id);

  const quizCorrect = Object.values(state.quiz).filter((q) => q.correct).length;

  return {
    xp: state.xp,
    visited: visitedIds,
    totalHalls: HALLS.length,
    floorDone,
    floorsTouched,
    routesFinished,
    totalRoutes: ROUTES.length,
    quizCorrect,
    totalQuiz: QUIZ.length,
    streak: state.streak,
    bestStreak: state.bestStreak,
  };
}

function awardBadges(state, toasts) {
  const stats = computeStats(state);
  let xp = state.xp;
  const badges = { ...state.badges };
  for (const badge of BADGES) {
    if (badges[badge.id]) continue;
    let earned = false;
    try {
      earned = badge.check(stats);
    } catch {
      earned = false;
    }
    if (earned) {
      badges[badge.id] = new Date().toISOString();
      xp += BADGE_XP;
      toasts.push({ kind: 'badge', title: `Бейдж «${badge.title}»`, icon: badge.icon, xp: BADGE_XP });
    }
  }
  return { ...state, badges, xp };
}

function reducer(state, action) {
  switch (action.type) {
    case 'visit-hall': {
      const { hallId } = action;
      if (state.visited[hallId]) return state;
      const hall = HALLS_BY_ID.get(hallId);
      if (!hall) return state;
      const toasts = [];
      const isFirst = Object.keys(state.visited).length === 0;
      let xp = state.xp + XP_RULES.HALL_VISIT + (isFirst ? XP_RULES.FIRST_STEPS_BONUS : 0);
      toasts.push({
        kind: 'visit',
        title: `Зал «${hall.short}» закрыт`,
        icon: '🚪',
        xp: XP_RULES.HALL_VISIT + (isFirst ? XP_RULES.FIRST_STEPS_BONUS : 0),
      });
      let next = {
        ...state,
        xp,
        visited: { ...state.visited, [hallId]: new Date().toISOString() },
      };
      next = awardBadges(next, toasts);
      return { ...next, __toasts: toasts };
    }

    case 'route-step': {
      const { routeId, hallId } = action;
      const route = ROUTES.find((r) => r.id === routeId);
      if (!route || !route.hallIds.includes(hallId)) return state;
      const current = state.routes[routeId] || {};
      if (current[hallId]) return state;
      const toasts = [];
      let xp = state.xp + XP_RULES.ROUTE_STEP;
      toasts.push({ kind: 'route', title: 'Шаг маршрута пройден', icon: '🧵', xp: XP_RULES.ROUTE_STEP });
      const routes = { ...state.routes, [routeId]: { ...current, [hallId]: true } };
      const done = route.hallIds.every((id) => routes[routeId][id]);
      if (done) {
        xp += XP_RULES.ROUTE_FINISH;
        toasts.push({
          kind: 'route',
          title: `Маршрут «${route.title}» пройден`,
          icon: '🏁',
          xp: XP_RULES.ROUTE_FINISH,
        });
      }
      let next = { ...state, xp, routes };
      next = awardBadges(next, toasts);
      return { ...next, __toasts: toasts };
    }

    case 'quiz-answer': {
      const { questionId, correct, usedHint = false, choice = null } = action;
      if (state.quiz[questionId]) return state; // один вопрос — одна попытка
      const toasts = [];
      const streak = correct ? state.streak + 1 : 0;
      let xp = state.xp;
      if (correct) {
        xp += XP_RULES.QUIZ_CORRECT - (usedHint ? XP_RULES.QUIZ_HINT_COST : 0);
        toasts.push({ kind: 'quiz', title: 'Верно!', icon: '💡', xp: XP_RULES.QUIZ_CORRECT });
      } else {
        toasts.push({ kind: 'quiz', title: 'Не в этот раз', icon: '❌', xp: 0 });
      }
      let next = {
        ...state,
        xp: Math.max(0, xp),
        streak,
        bestStreak: Math.max(state.bestStreak, streak),
        quiz: { ...state.quiz, [questionId]: { correct, usedHint, at: new Date().toISOString(), choice } },
      };
      next = awardBadges(next, toasts);
      return { ...next, __toasts: toasts };
    }

    case 'seen-intro':
      return { ...state, seenIntro: true };

    case 'reset':
      return { ...EMPTY };

    default:
      return state;
  }
}

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, load);
  const [toasts, setToasts] = useState([]);
  const queue = useRef([]);

  // reducer кладёт всплывающие уведомления в служебное поле __toasts,
  // здесь мы перекладываем их в очередь тостов и чистим состояние.
  useEffect(() => {
    if (!state.__toasts?.length) return;
    const incoming = state.__toasts.map((t, i) => ({
      ...t,
      id: `${Date.now()}-${i}-${Math.random().toString(36).slice(2, 7)}`,
    }));
    queue.current = [...queue.current, ...incoming];
    setToasts(queue.current);
    const timer = setTimeout(() => {
      queue.current = queue.current.filter((t) => !incoming.some((n) => n.id === t.id));
      setToasts(queue.current);
    }, 4200);
    return () => clearTimeout(timer);
  }, [state.__toasts]);

  useEffect(() => {
    const { __toasts, ...persistable } = state;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
    } catch {
      /* приватный режим — просто не сохраняем */
    }
  }, [state]);

  const value = useMemo(() => {
    const { __toasts, ...clean } = state;
    const stats = computeStats(clean);
    return {
      state: clean,
      stats,
      level: levelForXp(clean.xp),
      toasts,
      dismissToast: (id) => {
        queue.current = queue.current.filter((t) => t.id !== id);
        setToasts(queue.current);
      },
      visitHall: (hallId) => dispatch({ type: 'visit-hall', hallId }),
      routeStep: (routeId, hallId) => dispatch({ type: 'route-step', routeId, hallId }),
      answerQuiz: (questionId, correct, usedHint = false, choice = null) =>
        dispatch({ type: 'quiz-answer', questionId, correct, usedHint, choice }),
      markIntroSeen: () => dispatch({ type: 'seen-intro' }),
      resetProgress: () => dispatch({ type: 'reset' }),
    };
  }, [state, toasts]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame должен вызываться внутри <GameProvider>');
  return ctx;
}

/** Проверка кода чекпойнта: код должен совпасть с кодом зала (регистр и пробелы не важны). */
export function isCodeForHall(code, hallId) {
  const normalized = String(code || '')
    .trim()
    .toUpperCase()
    .replace(/[\s-]/g, '');
  const hall = HALLS_BY_ID.get(hallId);
  if (!hall) return false;
  return normalized === hall.checkpoint.toUpperCase();
}
