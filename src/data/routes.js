/**
 * Готовые маршруты по музею. Порядок залов важен — он учитывается при подсчёте шагов.
 */

export const ROUTES = [
  {
    id: 'first-visit',
    title: 'Первый визит',
    subtitle: 'Главное за 90 минут',
    minutes: 90,
    level: 'Для всех',
    description:
      'Если вы в музее впервые: египетские мумии, троянское золото, Итальянский дворик ' +
      'и Рембрандт — четыре точки, которые дают карту коллекции.',
    color: '#e0b64d',
    hallIds: ['egypt', 'troy', 'italian-yard', 'holland'],
  },
  {
    id: 'antique-evening',
    title: 'Античный вечер',
    subtitle: 'От Египта до Греческого двора',
    minutes: 75,
    level: 'Для всех',
    description:
      'Полный проход первого этажа до Итальянского двора: от египетских древностей ' +
      'через Трую, античность и старую живопись — логистически самый удобный маршрут.',
    color: '#7fb2c9',
    hallIds: [
      'egypt', 'near-east', 'troy', 'antiquity', 'bospor', 'egypt-late',
      'byzantium', 'france', 'italy-late', 'spain', 'holland',
      'germany', 'greek-yard', 'italian-yard',
    ],
  },
  {
    id: 'color-light',
    title: 'Цвет и свет',
    subtitle: 'От византийской иконы до импрессионистов',
    minutes: 110,
    level: 'Продвинутый',
    description:
      'Путь от Византии через французский классицизм, итальянскую ведуту и голландский ' +
      'интерьер к живописи второго этажа — последовательность по хронологии и стилю.',
    color: '#d98b6a',
    hallIds: [
      'byzantium', 'france', 'italy-late', 'spain', 'holland', 'germany',
      'italy-17a', 'italy-17b',
    ],
  },
  {
    id: 'with-kids',
    title: 'С детьми',
    subtitle: 'Чтобы не устали',
    minutes: 60,
    level: 'Семейный',
    description:
      'Короткие залы с понятными детям сюжетами: мумии, золото, корабли, «Давид» ' +
      'и кондотьер на лошади — и никаких залов «без окна».',
    color: '#8fc08a',
    hallIds: ['egypt', 'troy', 'greek-yard', 'italian-yard'],
  },
  {
    id: 'michelangelo',
    title: 'Микеланджело: оригинал и слепок',
    subtitle: 'Медленный взгляд',
    minutes: 45,
    level: 'Для вдумчивых',
    description:
      'Маршрут из двух точек: «Давид» внизу (слепки) и «Давид» на втором этаже — ' +
      'чтобы увидеть, как мастерская и академическая традиция переосмысляют одно и то же.',
    color: '#b39ddb',
    hallIds: ['italian-yard', 'casts-michelangelo'],
  },
];

export const ROUTES_BY_ID = new Map(ROUTES.map((r) => [r.id, r]));
