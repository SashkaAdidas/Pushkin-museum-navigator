// Готовые маршруты по музею. Порядок залов важен — он учитывается при подсчёте шагов.

export const ROUTES = [
  {
    id: 'first-visit',
    title: 'Первый визит',
    subtitle: 'Главное за 90 минут',
    minutes: 90,
    level: 'Для всех',
    description:
      'Если вы в музее впервые: античное золото, итальянский дворик и импрессионисты — три опоры коллекции.',
    color: '#e0b64d',
    halls: ['trojan', 'italian-high', 'dutch', 'impressionism', 'post-impressionism'],
  },
  {
    id: 'antique-evening',
    title: 'Античный вечер',
    subtitle: 'От Египта до Трои',
    minutes: 75,
    level: 'Для всех',
    description: 'Полный проход первого этажа без возвратов — логистически самый удобный маршрут.',
    color: '#7fb2c9',
    halls: ['egypt', 'greek-archaic', 'greek-classic', 'rome', 'trojan', 'caucasus'],
  },
  {
    id: 'color-light',
    title: 'Цвет и свет',
    subtitle: 'Французская живопись',
    minutes: 110,
    level: 'Продвинутый',
    description:
      'Как из пейзажа Пуссена вырастает импрессионизм: последовательность залов 3 этажа по хронологии.',
    color: '#d98b6a',
    halls: ['french-17', 'french-18', 'french-19', 'realism', 'impressionism', 'post-impressionism'],
  },
  {
    id: 'with-kids',
    title: 'С детьми',
    subtitle: 'Чтобы не устали',
    minutes: 60,
    level: 'Семейный',
    description:
      'Короткие залы с понятными детям сюжетам: мумии, золото, корабли и большая гипсовая коллекция.',
    color: '#8fc08a',
    halls: ['egypt', 'trojan', 'sculpture-hall', 'music'],
  },
  {
    id: 'rembrandt-room',
    title: 'Один зал, но внимательно',
    subtitle: 'Медленный взгляд',
    minutes: 45,
    level: 'Для вдумчивых',
    description:
      'Маршрут из одного зала — с заданиями на внимательность. Подходит для второго и третьего визита.',
    color: '#b39ddb',
    halls: ['dutch'],
  },
];

// hallIds — публичное поле для компонента маршрута и store.
for (const route of ROUTES) {
  route.hallIds = route.halls;
}

export const ROUTES_BY_ID = new Map(ROUTES.map((r) => [r.id, r]));
